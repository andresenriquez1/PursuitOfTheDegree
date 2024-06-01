import { defs, tiny } from './examples/common.js';
const { vec3, Mat4, Shape, Material, Scene, hex_color } = tiny;
import { Maze } from './maze.js'

export class Egg {
    constructor(){
        this.position = vec3(10, -20, 0);
        this.rotation = 0.0;
        this.speed = 4;
        this.shapes = {
            egg: new defs.Cube()
        }
        this.materials = {
            eggshell: new Material(new defs.Phong_Shader(), {
                color: hex_color("#ffffff"), ambient: 1
            })
        }
    }
    
    display(context, program_state){
        const model_transform = Mat4.translation(...this.position).times(Mat4.scale(0.75, 0.75, 0.75));
        this.shapes.egg.draw(context, program_state, model_transform, this.materials.eggshell);
    }
}