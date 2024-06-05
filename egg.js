import { defs, tiny } from './examples/common.js';
const { vec3, Mat4, Shape, Material, Scene, hex_color } = tiny;
import { Maze } from './maze.js'

export class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.edges = [];
        this.gScore = Infinity; // Cost from start to this node
        this.fScore = Infinity; // Cost from start to goal through this node
        this.cameFrom = null; // Node from which this node was reached
    }
}

export class Graph {
    constructor(maze) {
        this.nodes = [];

        for (let y = 0; y < maze.length; y++) {
            for (let x = 0; x < maze[y].length; x++) {
                if (maze[y][x] === 0 || maze[y][x] === 2) {
                    this.nodes.push(new Node(x, y));
                }
            }
        }

        for (let node of this.nodes) {
            for (let otherNode of this.nodes) {
                let x = Math.abs(node.x - otherNode.x) + Math.abs(node.y - otherNode.y);
                if (x === 1) {
                    node.edges.push(otherNode);
                }
            }
        }
    }
    astar(startVec3, goalVec3) {
        let startX = Math.round(startVec3[0]/2);
        let startZ = Math.round(startVec3[2]/2);
    
        let goalX = Math.round(goalVec3[0]/2);
        let goalZ = Math.round(goalVec3[2]/2);

        // Find the nodes in the graph that match these coordinates
        let start = this.nodes.find(node => node.x === startZ && node.y === startX);
        let goal = this.nodes.find(node => node.x === goalZ && node.y === goalX);
        
        if (!start || !goal) {
            // One or both of the nodes could not be found in the graph
            return null;
        }
        // Initialize the starting node
        start.gScore = 0;
        start.fScore = this.heuristic(start, goal);

        // Initialize open set with starting node
        let openSet = [start];
        console.log(start);
        while (openSet.length > 0) {
            // Get the node in the open set with the lowest fScore
            let minFScore = openSet[0].fScore;
            let current = openSet[0];
            
            for (let i = 1; i < openSet.length; i++) {
                if (openSet[i].fScore < minFScore) {
                    minFScore = openSet[i].fScore;
                    current = openSet[i];
                }
            }
            // If the current node is the goal, reconstruct the path and return it
            if (current === goal) {
                return this.reconstructPath(current);
            }

            // Remove the current node from the open set
            openSet = openSet.filter(node => node !== current);

            // Check each neighbor of the current node
            for (let neighbor of current.edges) {
                // Calculate tentative gScore
                let tentativeGScore = current.gScore + 1; // Assuming 1 is the cost to move from one node to another

                // Update gScore and fScore if the new path to the neighbor is better
                if (tentativeGScore < neighbor.gScore) {
                    neighbor.cameFrom = current;
                    neighbor.gScore = tentativeGScore;
                    neighbor.fScore = neighbor.gScore + this.heuristic(neighbor, goal);

                    // Add neighbor to open set if it's not already there
                    if (!openSet.includes(neighbor)) {
                        openSet.push(neighbor);
                    }
                }
            }
        }
        // If open set is empty and goal was not reached, return null
        return null;
    }

    heuristic(node1, node2) {
        // Manhattan distance
        return Math.abs(node1.x - node2.x) + Math.abs(node1.y - node2.y);
    }

    reconstructPath(current) {
        const path = [current];
        while (current.cameFrom) {
            path.unshift(current.cameFrom);
            current = current.cameFrom;
        }
        return path;
    }
}

export class Egg {
    constructor(){
        this.position = vec3(2, 1, 2);
        this.rotation = 0.0;
        this.speed = 2;
        this.intervalId = null;
        this.shapes = {
            egg: new defs.Subdivision_Sphere(4) // Sphere shape, with a high subdivision for smoothness
        };
        this.materials = {
            egg: new Material(new defs.Textured_Phong(), {
                color: hex_color("#ffffff"), // Base color of the egg
                ambient: 0.4,
                diffusivity: 0.6,
                specularity: 0.3,
                //texture: new Texture("assets/egg_texture.jpg") // Path to your egg texture
            })
        };
    }

    calculate_path(maze, player_position){
        const graph = new Graph(maze.maze_layout);                 //1. Build graph
        const path = graph.astar(this.position, player_position);  //2. Run A*
        if (!path) {
            return;
        } 
        return path 
    }

    move_egg(path){
        if (!path){
            return
        }
        let counter = 0;
        let lerpAmount = 0;
        let currentTarget = vec3(path[counter].y * 2, 1, path[counter].x * 2);
        this.intervalId = setInterval(() => {
            if (counter < path.length) {
                const nextTarget = vec3(path[counter].y * 2, 1, path[counter].x * 2);
                if (lerpAmount < 1) { //Using lerping to smoothen the movement
                    this.position = this.position.mix(currentTarget, lerpAmount);
                    lerpAmount += 0.005; 
                } else {
                    // Once we've reached the target, move on to the next node
                    currentTarget = nextTarget;
                    lerpAmount = 0;
                    counter++;
                }
            } else { //If we reach the end of our path, clear the interval and set it to null
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
        }, 250/60); // This determines the speed of the egg
    }

    //Update the eggs position based on if the egg or player is moving
    update_egg(maze, player_position){
        if (!this.lastPlayerPosition || !this.lastPlayerPosition.equals(player_position)) {
            this.lastPlayerPosition = player_position;
            if (this.intervalId){
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
            const path = this.calculate_path(maze, player_position);
            this.move_egg(path);
        }
    }

    display(context, program_state) {
        const model_transform = Mat4.translation(...this.position)
            .times(Mat4.scale(0.5, 0.7, 0.5)); // Scale to resemble an egg shape        
        this.shapes.egg.draw(context, program_state, model_transform, this.materials.egg);
    }
}