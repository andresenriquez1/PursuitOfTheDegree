import { defs, tiny } from './examples/common.js';
const { vec3, Mat4, Shape, Material, Scene, hex_color } = tiny;
import { Maze } from './maze.js'

export class Player {
    constructor(){
        this.position = vec3(0, 1, 0);
        this.direction = vec3(0,0,-1);
        this.rotation = 0.0;
        this.speed = 2;
        this.maze = new Maze();
        this.shapes = {
            box: new defs.Cube()
        }
        this.materials = {
            plastic: new Material(new defs.Phong_Shader(), {
                color: hex_color("#ffffff"), ambient: 1
            })
        }
    }
    move_forward() {
        let nextPosition = this.position.plus(this.direction);
        if (!this.is_collision(nextPosition))
            this.position = nextPosition;
        // let nextPosition = [...this.position];
        // nextPosition[2] -= this.speed * Math.cos(this.rotation);
        // nextPosition[0] -= this.speed * Math.sin(this.rotation);
        // this.position = nextPosition;
        
        //NOTE: When collsion detection is on, the block won't move forward.
        /*
        if (!this.checkCollision(nextPosition, maze)) {
            this.position = nextPosition;
        }
        */
    }

    move_backward() {
        if (!is_collision(this.position.minus(this.direction)))
            this.position = this.position.minus(this.direction);
        // let nextPosition = vec3(this.position);
        // nextPosition.z += this.speed * Math.cos(this.rotation);
        // nextPosition.x += this.speed * Math.sin(this.rotation);
        // this.position = nextPosition;

        //NOTE: When collsion detection is on, the block won't move backward.
        
        // if (!this.checkCollision(nextPosition)) {
        //     this.position = nextPosition;
        // }
        
        
    }

    turn_left() {
        this.rotation += Math.PI / 16;
    }

    turn_right() {
        this.rotation -= Math.PI / 16;
    }

    // checkCollision(nextPosition) {
    //     const x = Math.floor(nextPosition.x / 2);
    //     const z = Math.floor(nextPosition.z / 2);

    //     // Check bounds
    //     if (x < 0 || x >= this.maze.maze_layout.length || z < 0 || z >= this.maze.maze_layout[0].length) {
    //         return true;
    //     }

    //     // Check collision with walls
    //     return this.maze.maze_layout[x+1][z] === 1;
    // }

    is_collision(nextPosition) {
        return (this.maze.maze_layout[nextPosition.x][nextPosition.z] === 1)
    }

    display(context, program_state) {
        const model_transform = Mat4.translation(...this.position).times(Mat4.scale(0.5, 0.5, 0.5)).times(Mat4.rotation(this.rotation, 0, 1, 0));
        this.shapes.box.draw(context, program_state, model_transform, this.materials.plastic);
    }

    getTransform() {
        return Mat4.translation(this.position[0], this.position[1], this.position[2]);
    }
}