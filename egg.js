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
                if (maze[y][x] === 0) {
                    this.nodes.push(new Node(x, y));
                }
            }
        }

        for (let node of this.nodes) {
            for (let otherNode of this.nodes) {
                if (Math.abs(node.x - otherNode.x) + Math.abs(node.y - otherNode.y) === 1) {
                    node.edges.push(otherNode);
                }
            }
        }
    }
    astar(startVec3, goalVec3) {
        let startX = Math.ceil(startVec3[0]/2);
        let startZ = Math.ceil(startVec3[2]/2);
    
        let goalX = Math.ceil(goalVec3[0]/2);
        let goalZ = Math.ceil(goalVec3[2]/2);

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
        this.position = vec3(51, 1, 38);
        this.rotation = 0.0;
        this.speed = 4;
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

    egg_pathfinding(maze, player_position){
        const graph = new Graph(maze.maze_layout);                 //1. Build graph
        const path = graph.astar(this.position, player_position);  //2. Run A*
        if (!path) {
            return;
        }
        let counter = 0;
        // Create an interval that runs every 3 seconds
        let intervalId = setInterval(() => {
            if (counter < path.length) {
                const node = path[counter];
                const x = node.x * 2;
                const z = node.y * 2;
                console.log(x);
                console.log(z);
                let difference = vec3(node.x, 1, node.y).minus(this.position);
                this.position = this.position.plus(difference);
                console.log(this.position);
                counter++;
            } else {
                // If we've reached the end of the path, clear the interval
                clearInterval(intervalId);
            }
        }, 3000); // 3000 milliseconds = 3 seconds
    }

    /*
    move_next_position(maze, player_position){
        const path = this.egg_pathfinding(maze, player_position);
        let counter = 0;
        if (!path){
            
        }

        // Create an interval that runs every 3 seconds
        let intervalId = setInterval(() => {
            if (counter < path.length) {
                const node = path[counter];
                const x = node.x;
                const z = node.y;
                this.position = vec3(node.x * 2, 1, node.y * 2);
                counter++;
            } else {
                // If we've reached the end of the path, clear the interval
                clearInterval(intervalId);
            }
        }, 3000); // 3000 milliseconds = 3 seconds

    }
    */
    display(context, program_state) {
        const model_transform = Mat4.translation(...this.position)
            .times(Mat4.scale(0.5, 0.7, 0.5)); // Scale to resemble an egg shape
        
        this.shapes.egg.draw(context, program_state, model_transform, this.materials.egg);
    }
}