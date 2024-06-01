import { defs, tiny } from './examples/common.js';
const { vec3, Mat4, Shape, Material, Scene, hex_color, Texture } = tiny;
const { Cube, Phong_Shader } = defs;

export class Timer {
    constructor(initial_time) {
        this.time_remaining = initial_time; // Timer in seconds
        this.start_time = null; // To track the start time
        this.shapes = {
            bar: new Cube(),
            text: new Cube()
        };
        this.materials = {
            bar: new Material(new Phong_Shader(), {
                color: hex_color("#ffffff"), ambient: 1, diffusivity: 1, specularity: 0,
            }),
            text: new Material(new Phong_Shader(), {
                color: hex_color("#000000"), ambient: 1, diffusivity: 0, specularity: 0,
            })
        };
    }

    update(program_state) {
        if (!this.start_time) {
            this.start_time = program_state.animation_time / 1000;
        }
        const elapsed_time = program_state.animation_time / 1000 - this.start_time;
        this.time_remaining = Math.max(180 - Math.floor(elapsed_time), 0);
    }

    display(context, program_state) {
        const timer_transform = Mat4.inverse(program_state.camera_inverse)
            .times(Mat4.translation(-0.9, 0.8, -1))
            .times(Mat4.scale(0.9, 0.05, 0.01));
        this.shapes.bar.draw(context, program_state, timer_transform, this.materials.bar);

        const timer_text_transform = Mat4.inverse(program_state.camera_inverse)
            .times(Mat4.translation(-0.9, 0.8, -0.99))
            .times(Mat4.scale(0.05, 0.05, 0.05));
        this.draw_text(context, program_state, `Time: ${this.time_remaining}`, timer_text_transform);
    }

    draw_text(context, program_state, text, transform) {
        const char_size = 0.1;
        const spacing = 0.15;
        for (let i = 0; i < text.length; i++) {
            let char_transform = transform.times(Mat4.translation(i * spacing, 0, 0));
            this.shapes.text.draw(context, program_state, char_transform, this.materials.text);
        }
    }
}
