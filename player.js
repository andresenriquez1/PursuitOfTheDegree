import { defs, tiny } from './examples/common.js';
const { vec3, Mat4, Shape, Material, Scene, hex_color } = tiny;
import { Maze } from './maze.js'

export class Player {
    constructor(){
        this.position = vec3(0, 1, 0);
        this.direction = vec3(0, 0, 1);
        this.rotation = 0.0;
        this.speed = 2;
        this.shapes = {
            box: new defs.Cube()
        }
        this.materials = {
            plastic: new Material(new defs.Phong_Shader(), {
                color: hex_color("#00000"), ambient: 1
            })
        }
    }
//     move_forward() {
//         const nextPosition = this.position.plus(vec3(this.speed * Math.sin(this.rotation), 0, this.speed * Math.cos(this.rotation)));
//         //console.log(nextPosition,"nextPosition");
//         if (!this.checkCollision(nextPosition)) {
//             this.position = nextPosition;
//         }
//     }

//     move_backward() {
//         const nextPosition = this.position.minus(vec3(this.speed * Math.sin(this.rotation), 0, this.speed * Math.cos(this.rotation)));
//         if (!this.checkCollision(nextPosition)) {
//             this.position = nextPosition;
//         }
//     }


    checkCollision(nextPosition) {
        
        const x = Math.floor(nextPosition[0] / 2);
        const z = Math.floor(nextPosition[2] / 2);

        console.log(x,"x");
        console.log(z,"z");

        console.log(this.maze.maze_layout[z][x], "layout");

        // Check bounds
        // if (x < 0 || x >= this.maze.maze_layout.length || z < 0 || z >= this.maze.maze_layout[0].length) {
        //     return true;
        // }

        // Check collision with walls
        return this.maze.maze_layout[x][z] === 1; // Notice the use of z and x to match maze layout
    }
    
    get_position() {
        return this.position;
    }

    get_direction(){
        return this.direction;
    }

    move_forward(){
        let next_position = this.position.plus(this.direction);
        this.position = next_position;
    }
    move_backward(){
        let next_position = this.position.minus(this.direction);
        this.position = next_position; 
    }
    turn_left(){
        const angle = -Math.PI / 2; // 90 degrees in radians
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        this.direction = vec3(cos * this.direction[0] - sin * this.direction[2], this.direction[1], sin * this.direction[0] + cos * this.direction[2]);
    }
    
    turn_right(){
        const angle = Math.PI / 2; // -90 degrees in radians
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        this.direction = vec3(cos * this.direction[0] - sin * this.direction[2], this.direction[1], sin * this.direction[0] + cos * this.direction[2]);
    }
    
    display(context, program_state) {
        const model_transform = Mat4.translation(...this.position).times(Mat4.scale(0.5, 0.5, 0.5)).times(Mat4.rotation(this.rotation, 0, 1, 0));
        this.shapes.box.draw(context, program_state, model_transform, this.materials.plastic);
    }
}