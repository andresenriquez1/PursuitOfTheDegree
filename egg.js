import { defs, tiny } from './examples/common.js';
const { vec3, Mat4, Shape, Material, Scene, hex_color } = tiny;
import { Maze } from './maze.js'

export class Egg {
    constructor(){
        this.position = vec3(-10, 1, 0);
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
    display(context, program_state) {
        const model_transform = Mat4.translation(...this.position)
            .times(Mat4.scale(0.5, 0.7, 0.5)); // Scale to resemble an egg shape

        this.shapes.egg.draw(context, program_state, model_transform, this.materials.egg);
    }
    // display(context, program_state){
    //     const model_transform = Mat4.translation(...this.position).times(Mat4.scale(0.75, 0.75, 0.75));
    //     this.shapes.egg.draw(context, program_state, model_transform, this.materials.eggshell);
    // }
}