import { defs, tiny } from './common.js';
import { Player } from './player.js';
import { Maze } from './maze.js';

const { vec3, vec4, color, Mat4, Light, Shape, Material, Shader, Texture, Scene } = tiny;

export class Game extends Scene {
    constructor() {
        super();
        this.player = new Player();
        this.maze = new Maze();
    }

    make_control_panel() {
        this.key_triggered_button("Move Forward", ["w"], () => this.player.move_forward());
        this.key_triggered_button("Move Backward", ["s"], () => this.player.move_backward());
        this.key_triggered_button("Turn Left", ["a"], () => this.player.turn_left());
        this.key_triggered_button("Turn Right", ["d"], () => this.player.turn_right());
    }

    display(context, program_state) {
        program_state.set_camera(Mat4.look_at(vec3(0, 5, 10), vec3(0, 0, 0), vec3(0, 1, 0)));
        program_state.projection_transform = Mat4.perspective(Math.PI / 4, context.width / context.height, 0.1, 1000);

        const light_position = vec4(0, 10, 10, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];

        this.player.display(context, program_state);
        this.maze.display(context, program_state);
    }
}

