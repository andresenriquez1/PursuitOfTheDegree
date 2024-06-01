import { defs, tiny } from './examples/common.js';
import { Player } from './player.js';
import { Maze } from './maze.js';
import { Egg } from './egg.js';

const { vec3, vec4, color, Mat4, Light, Shape, Material, Shader, Texture, Scene } = tiny;

export class Game extends Scene {
    constructor() {
        super();
        
        this.maze = new Maze();
        this.player = new Player(this.maze);
        this.egg = new Egg();
    }

    make_control_panel() {
        this.key_triggered_button("Move Forward", ["ArrowUp"], () => this.player.move_forward(this.maze));
        this.new_line();
        this.key_triggered_button("Move Backward", ["ArrowDown"], () => this.player.move_backward(this.maze));
        this.new_line();
        this.key_triggered_button("Turn Left", ["ArrowLeft"], () => this.player.turn_left());
        this.new_line();
        this.key_triggered_button("Turn Right", ["ArrowRight"], () => this.player.turn_right());
    }

    display(context, program_state) {
        context.context.clearColor(0.5, 0.8, 0.9, 1.0);
        program_state.set_camera(Mat4.look_at(vec3(26, 80, 20), vec3(26, 0, 20), vec3(0, 0, -1)));
        program_state.projection_transform = Mat4.perspective(Math.PI / 4, context.width / context.height, 0.1, 1000);
        
        const light_position = vec4(0, 10, 10, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];

        this.player.display(context, program_state);
        this.maze.display(context, program_state);
        this.egg.display(context, program_state);
    }
}
