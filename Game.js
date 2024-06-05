import { defs, tiny } from './examples/common.js';
import { Player } from './player.js';
import { Maze } from './maze.js';
import { Egg } from './egg.js';
import { Stats_Card } from './Stats_Card.js';

//import { HealthBar } from './HealthBar.js';
//import { Timer } from './Timer.js';

const { vec3, vec4, color, Mat4, Light, Vector, Scene , Material, Texture} = tiny;

export class Game extends Scene {
    constructor() {
        super();
        this.initializeGame();
        this.shapes = {
            text: new Stats_Card(35),
            timer: new Stats_Card(35)
        };
        this.count_rounds = 0;
        this.seconds = 0;
        this.minutes = 0;
        this.start_round_time = 0;

        this.materials = {
            text_image: new Material(new defs.Textured_Phong(), {
                ambient: 1, diffusivity: 0, specularity: 0,
                texture: new Texture('./assets/text.png')
            })
        }
    }
    initializeGame() {
        // Objects in the scene
        console.log("Initializing game...");
        this.maze = new Maze();
        this.player = new Player(this.maze);
        this.egg = new Egg();
      //this.health = new HealthBar(4);
      //this.timer = new Timer(180);
        // Boolean to change POVs
        this.pov = true;
        
        // Camera state
        this.current_camera_position = vec3(0, 0, 0);
        this.current_look_at_point = vec3(0, 0, 0);
    }
    WinGameCheck() {
        if (this.count_rounds >= 1) {
            document.getElementById('main-canvas').classList.add('hidden');
            document.getElementById('win-menu').classList.remove('hidden');
            document.getElementById('win-image').style.display = 'block';
        }
    }

    make_control_panel() {
        this.key_triggered_button("Move Forward", ["ArrowUp"], () => this.player.move_forward(this.maze));
        this.new_line();
        this.key_triggered_button("Move Backward", ["ArrowDown"], () => this.player.move_backward(this.maze));
        this.new_line();
        this.key_triggered_button("Turn Left", ["ArrowLeft"], () => this.player.turn_left());
        this.new_line();
        this.key_triggered_button("Turn Right", ["ArrowRight"], () => this.player.turn_right());
        this.new_line();
        this.key_triggered_button("Toggle Map View", ["p"], function() { this.pov = !this.pov }.bind(this))
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
        context.context.clearColor(0.2, 0.5, 0.6, 1.0); // Darker background color
        
        program_state.projection_transform = Mat4.perspective(Math.PI / 4, context.width / context.height, 0.1, 1000);
        
        const light_position = vec4(0, 10, 10, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];

        // this.timer.update(program_state);
        // Display the player, egg, and maze
        this.player.display(context, program_state);
        this.maze.display(context, program_state);
        if(program_state.animation_time - this.start_round_time > 6000){//After 6 seconds render the egg
            this.egg.display(context, program_state);
            this.egg.update_egg(this.maze, this.player.get_position());
        }
        // Display the health bar
        //this.health.display(context, program_state);

        // Display the timer
        //this.timer.display(context, program_state);


        let countDisplay = "Completed mazes: " + this.count_rounds;
        this.shapes.text.set_string(countDisplay, context.context);
        let counter_transform = Mat4.inverse(program_state.camera_inverse)
            .times(Mat4.translation(5.0/16, 6.0/16, -1))
            .times(Mat4.scale(1.0/64, 1.0/64, 1.0/64));
        this.shapes.text.draw(context, program_state, counter_transform, this.materials.text_image);

        // seconds
        this.seconds = Math.floor((program_state.animation_time / 1000) % 60);
        this.minutes = Math.floor((program_state.animation_time / 1000) / 60);

        // minutes
        let timerDisplay = "Time: " + this.minutes.toFixed(0) + ":" + this.seconds.toFixed(0);
        if (this.seconds < 10)
            timerDisplay = "Time: " + this.minutes.toFixed(0) + ":0" + this.seconds.toFixed(0);
        this.shapes.timer.set_string(timerDisplay, context.context);
        let timer_transform = Mat4.inverse(program_state.camera_inverse)
            .times(Mat4.translation(5.0/16, 5.0/16, -1))
            .times(Mat4.scale(1.0/64, 1.0/64, 1.0/64));
        this.shapes.timer.draw(context, program_state, timer_transform, this.materials.text_image);


        if (this.pov){
            const player_position = this.player.get_position();
            const player_direction = this.player.get_direction();
            
            // Calculate camera position directly behind and slightly above the player
            const camera_offset = vec3(0, 2, 0.7);
            const target_camera_position = player_position.plus(player_direction.times(camera_offset[2])).plus(vec3(0, camera_offset[1], 0));            
            const target_look_at_point = player_position.plus(player_direction.times(9));
            
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

        if (this.maze.checkEnd(this.player.get_position())) {
            this.count_rounds += 1;
            this.WinGameCheck();
            this.round_start_time = program_state.animation_time;
            this.regenerate_maze();
            // console.log(`count rounds: $(this.count_rounds)`);
        }
    }
}