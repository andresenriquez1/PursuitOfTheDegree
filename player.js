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