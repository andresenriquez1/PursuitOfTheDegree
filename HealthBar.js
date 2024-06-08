import { defs, tiny } from './examples/common.js';
const { vec3, Mat4, Shape, Material, hex_color } = tiny;
const { Cube, Phong_Shader } = defs;
//We did not end up using this 
export class HealthBar {
    constructor(max_health) {
        this.max_health = max_health;
        this.health = max_health;
        this.shapes = {
            bar: new Cube()
        };
        this.materials = {
            green: new Material(new Phong_Shader(), {
                color: hex_color("#00ff00"), ambient: 1, diffusivity: 1, specularity: 0
            }),
            red: new Material(new Phong_Shader(), {
                color: hex_color("#ff0000"), ambient: 1, diffusivity: 1, specularity: 0
            }),
        };
    }

    decrement_health() {
        if (this.health > 0) {
            this.health -= 1;
        }
    }

    display(context, program_state) {
        const bar_width = 0.2;
        const bar_height = 0.05;
        for (let i = 0; i < this.max_health; i++) {
            const bar_transform = Mat4.inverse(program_state.camera_inverse)
                .times(Mat4.translation(-0.9 + i * bar_width * 2, 0.7, -1))
                .times(Mat4.scale(bar_width / 2, bar_height / 2, 0.01));
            const material = (i < this.health) ? this.materials.green : this.materials.red;
            this.shapes.bar.draw(context, program_state, bar_transform, material);
        }
    }
}
