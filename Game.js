import { defs, tiny } from './examples/common.js';
import { Player } from './player.js';
import { Maze } from './maze.js';
import { Egg } from './egg.js';

const { vec3, vec4, color, Mat4, Light, Shape, Material, Shader, Texture, Scene } = tiny;

export class Game extends Scene {
    constructor() {
        super();
        //Objects in the scene
        this.maze = new Maze();
        this.player = new Player(this.maze);
        this.egg = new Egg();


        //Boolean to change POVs
        this.pov = false;
    }

    make_control_panel() {
        this.key_triggered_button("Move Forward", ["ArrowUp"], () => this.player.move_forward());
        this.new_line();
        this.key_triggered_button("Move Backward", ["ArrowDown"], () => this.player.move_backward());
        this.new_line();
        this.key_triggered_button("Turn Left", ["ArrowLeft"], () => this.player.turn_left());
        this.new_line();
        this.key_triggered_button("Turn Right", ["ArrowRight"], () => this.player.turn_right());
        this.new_line();
        this.key_triggered_button("Switching POV", ["p"], function() { this.pov = !this.pov }.bind(this))
    }

    display(context, program_state) {

        context.context.clearColor(0.5, 0.8, 0.9, 1.0);
        
        program_state.projection_transform = Mat4.perspective(Math.PI / 4, context.width / context.height, 0.1, 1000);
        
        const light_position = vec4(0, 10, 10, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];

        this.egg.display(context, program_state);
        this.player.display(context, program_state);
        this.maze.display(context, program_state);

        if (this.pov){
            const player_position = this.player.get_position();
            const camera_position = player_position.plus(vec3(0, 10, 0));
            const look_at_point = player_position.plus(this.player.get_direction().times(2));
            program_state.set_camera(Mat4.look_at(camera_position, look_at_point, vec3(0, 1, 0)));
        } 
        else{
            program_state.set_camera(Mat4.look_at(vec3(26, 80, 20), vec3(26, 0, 20), vec3(0, 0, -1)));
        }

    }
}
