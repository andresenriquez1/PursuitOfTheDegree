import { defs, tiny } from './common.js';
const { vec3, Mat4, Shape, Material, Scene } = tiny;

export class Player {
    constructor() {
        this.position = vec3(0, 1, 0); // Ensure the player is within the camera's view
        this.rotation = 0;
        this.speed = 0.1;
        this.shapes = { box: new defs.Cube() }; // Shape for the player
        this.materials = { plastic: new Material(new defs.Phong_Shader(), { color: tiny.color(0.9, 0.5, 0.5, 1) }) }; // Material for the player
    }

    move_forward() {
        this.position[2] -= this.speed * Math.cos(this.rotation);
        this.position[0] -= this.speed * Math.sin(this.rotation);
    }

    move_backward() {
        this.position[2] += this.speed * Math.cos(this.rotation);
        this.position[0] += this.speed * Math.sin(this.rotation);
    }

    turn_left() {
        this.rotation += Math.PI / 16;
    }

    turn_right() {
        this.rotation -= Math.PI / 16;
    }

    display(context, program_state) {
        const model_transform = Mat4.translation(...this.position).times(Mat4.rotation(this.rotation, 0, 1, 0));
        this.shapes.box.draw(context, program_state, model_transform, this.materials.plastic);
    }
}
