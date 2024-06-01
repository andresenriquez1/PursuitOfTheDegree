import { defs, tiny } from './examples/common.js';
import { Player } from './player.js';
import { Maze } from './maze.js';
import { Egg } from './egg.js';
import { HealthBar } from './HealthBar.js';
import { Timer } from './Timer.js';

const { vec3, vec4, color, Mat4, Light, Vector, Scene } = tiny;

export class Game extends Scene {
    constructor() {
        super();
        this.initializeGame();
    }
    initializeGame() {
        // Objects in the scene
        console.log("Initializing game...");
        this.maze = new Maze();
        this.player = new Player(this.maze);
        this.egg = new Egg();
        this.health = new HealthBar(4);
        this.timer = new Timer(180);

        // Boolean to change POVs
        this.pov = false;
        
        // Camera state
        this.current_camera_position = vec3(0, 0, 0);
        this.current_look_at_point = vec3(0, 0, 0);
    }
    

    make_control_panel() {
        this.key_triggered_button("Move Forward", ["ArrowUp"], () => this.player.move_forward());
        this.key_triggered_button("Move Forward", ["ArrowUp"], () => this.player.move_forward());
        this.new_line();
        this.key_triggered_button("Move Backward", ["ArrowDown"], () => this.player.move_backward());
        this.key_triggered_button("Move Backward", ["ArrowDown"], () => this.player.move_backward());
        this.new_line();
        this.key_triggered_button("Turn Left", ["ArrowLeft"], () => this.player.turn_left());
        this.new_line();
        this.key_triggered_button("Turn Right", ["ArrowRight"], () => this.player.turn_right());
        this.new_line();
        this.key_triggered_button("Switching POV", ["p"], function() { this.pov = !this.pov }.bind(this))
        this.new_line();
        this.key_triggered_button("Regenerate Maze", ["r"], () => this.regenerate_maze());
    }

    regenerate_maze() {
        this.initializeGame();
    }

    // Linear interpolation function
    lerp(a, b, t) {
        return a.times(1 - t).plus(b.times(t));
    }

    display(context, program_state) {
        

        context.context.clearColor(0.5, 0.8, 0.9, 1.0);
        
        
        program_state.projection_transform = Mat4.perspective(Math.PI / 4, context.width / context.height, 0.1, 1000);
        
        const light_position = vec4(0, 10, 10, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];

        // this.timer.update(program_state);

        // Display the player, egg, and maze
        this.player.display(context, program_state);
        this.egg.display(context, program_state);
        this.maze.display(context, program_state);

        // Display the health bar
        this.health.display(context, program_state);

        // Display the timer
        this.timer.display(context, program_state);

        if (this.pov){
            const player_position = this.player.get_position();
            const player_direction = this.player.get_direction();
            
            // Calculate camera position directly behind and slightly above the player
            const camera_offset = vec3(0, 5, -5);
            const target_camera_position = player_position.plus(player_direction.times(camera_offset[2])).plus(vec3(0, camera_offset[1], 0));            
            const target_look_at_point = player_position.plus(player_direction.times(2));
            
            // Smoothly update the camera position            
            // Interpolate between current and target positions for smooth transition
            this.current_camera_position = this.lerp(Vector.from(this.current_camera_position), Vector.from(target_camera_position), 0.1);
            this.current_look_at_point = this.lerp(Vector.from(this.current_look_at_point), Vector.from(target_look_at_point), 0.1);

            // Calculate the new camera transform from the interpolated positions
            const new_camera_transform = Mat4.look_at(this.current_camera_position, this.current_look_at_point, vec3(0, 1, 0));

            program_state.set_camera(new_camera_transform);
        } 
        else{
            program_state.set_camera(Mat4.look_at(vec3(26, 80, 20), vec3(26, 0, 20), vec3(0, 0, -1)));
        }

    }
}