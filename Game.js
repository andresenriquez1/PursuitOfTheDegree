import { defs, tiny } from './examples/common.js';
import { Player } from './player.js';
import { Maze } from './maze.js';
import { Egg } from './egg.js';
import { Stats_Card } from './Stats_Card.js';

const { vec3, vec4, color, Mat4, Light, Vector, Scene, Material, Texture } = tiny;

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
        this.started = false;
       

        this.materials = {
            text_image: new Material(new defs.Textured_Phong(), {
                ambient: 1, diffusivity: 0, specularity: 0,
                texture: new Texture('./assets/text.png')
            })
        };

        // start game functionality
        this.MenuStart = document.getElementById('startMenu');
        this.StartGame = document.getElementById('startGame');
        this.mainPage = document.getElementById('mainCanvas');

        this.howToPlay = document.getElementById('howToPlay');
        this.howToPlayText = document.getElementById('instructionsMenu');
        this.GoBack = document.getElementById('backToStart');

        // end game functionality
        this.start_again_button = document.getElementById('restartGame');
        this.game_done_menu = document.getElementById('gameDoneMenu');

        this.quit_btn = document.getElementById('quitGame');
        this.play_again_win_btn = document.getElementById('playAgainWin');
        this.quit_win_btn = document.getElementById('quitWin');
        this.play_again_lose_btn = document.getElementById('playAgainLose');
        this.quit_lose_btn = document.getElementById('quitLose');

        this.win_menu = document.getElementById('winMenu');
        this.lose_menu = document.getElementById('loseMenu');

        // button event listeners
        this.StartGame.onclick = () => {
            this.started = true;
            this.start_round_time = performance.now(); // Record the game start time
            this.MenuStart.classList.add('hidden');
            this.mainPage.classList.remove('hidden');
            document.body.classList.add('transparent-box');
        };

        this.howToPlay.onclick = () => {
            this.start_menu.classList.add('hidden');
            this.howToPlayText.classList.remove('hidden');
        };

        this.GoBack.onclick = () => {
            this.start_menu.classList.remove('hidden');
            this.howToPlayText.classList.add('hidden');
        };

        this.start_again_button.onclick = () => {
            this.game_done_menu.classList.add('hidden');
            this.mainPageclassList.remove('hidden');
        };

        this.quit_btn.onclick = () => {
            this.game_done_menu.classList.add('hidden');
            this.start_menu.classList.remove('hidden');
        };

        this.play_again_win_btn.onclick = () => {
            this.win_menu.classList.add('hidden');
            this.mainPage.classList.remove('hidden');
        };

        this.quit_win_btn.onclick = () => {
            this.win_menu.classList.add('hidden');
            this.start_menu.classList.remove('hidden');
        };

        this.play_again_lose_btn.onclick = () => {
            this.lose_menu.classList.add('hidden');
            this.mainPage.classList.remove('hidden');
        };

        this.quit_lose_btn.onclick = () => {
            this.lose_menu.classList.add('hidden');
            this.MenuStart.classList.remove('hidden');
        };
    }

    initializeGame() {
        // Objects in the scene
        console.log("Initializing game...");
        this.maze = new Maze();
        this.player = new Player(this.maze);
        this.egg = new Egg();
        this.pov = true; // Boolean to change POVs
        this.POVUsedToManyTimesBruh=6;

        // Camera state
        this.current_camera_position = vec3(0, 0, 0);
        this.current_look_at_point = vec3(0, 0, 0);
    }

    WinGameCheck() {
        if (this.count_rounds >= 3) {
            document.getElementById('mainCanvas').classList.add('hidden');
            document.getElementById('winMenu').classList.remove('hidden');
            document.getElementById('win-image').style.display = 'block';
        }
    }

    LoseGameBecauseOfEgg()
    {
        const egg_x = Math.round(this.egg.position[0]/2 );
        const egg_z = Math.round(this.egg.position[2]/2 );
            const player_x = Math.round(this.player.position[0] / 2);
            const player_z = Math.round(this.player.position[2] / 2);

           

            if (egg_x === player_x && egg_z === player_z || (egg_x === player_x -1) && egg_z === player_z-1 || (egg_x === player_x -1) && egg_z === player_z || (egg_x === player_x) && egg_z === player_z-1 || (egg_x === player_x+1) && (egg_z === player_z+1)) {
                // Move player to the end of the maze (25, 18)
                //this.maze.key_position = null; // Remove key from the maze
                console.log("Collision with egg and playerrrr");
                document.getElementById('mainCanvas').classList.add('hidden');
                document.getElementById('loseMenu').classList.remove('hidden');
                document.getElementById('losingDisplay').style.display = 'block';

            }
    }

    LoseGameCheck()
    {
        // console.log(this.seconds, "seconds check");
        if(this.count_rounds ==0 && this.seconds ==959)
            {
                
                document.getElementById('mainCanvas').classList.add('hidden');
                document.getElementById('loseMenu').classList.remove('hidden');
                document.getElementById('losingDisplay').style.display = 'block';

            }
            if(this.count_rounds ==1  && this.seconds ==45)
                {//you lose
                    document.getElementById('mainCanvas').classList.add('hidden');
                    document.getElementById('loseMenu').classList.remove('hidden');
                    document.getElementById('losingDisplay').style.display = 'block';
                }
                if(this.count_rounds ==2 && this.seconds ==35)
                    {//you lose
                        document.getElementById('mainCanvas').classList.add('hidden');
                        document.getElementById('loseMenu').classList.remove('hidden');
                        document.getElementById('losingDisplay').style.display = 'block';
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
        // this.key_triggered_button("Toggle Map View", ["p"], () => { this.pov = !this.pov });
        this.key_triggered_button("Toggle Map View", ["p"], () => {
            if (this.POVUsedToManyTimesBruh > 0) {
                this.pov = !this.pov;
                this.POVUsedToManyTimesBruh--;
                console.log(`POV toggled. Remaining uses: ${this.POVUsedToManyTimesBruh}`);
            } else {
                this.pov = true; // Force first-person POV
                console.log("First-person POV only. Counter has reached zero.");
            }
        });
    
        this.new_line();
        this.key_triggered_button("Regenerate Maze", ["r"], () => this.regenerate_maze());
    }

    regenerate_maze() {
        this.POVUsedToManyTimesBruh=6;
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

        // Display the player, egg, and maze
        this.player.display(context, program_state);
        this.maze.display(context, program_state);
        if (program_state.animation_time - this.start_round_time > 6000) { // After 6 seconds render the egg
            this.egg.display(context, program_state);
            this.egg.update_egg(this.maze, this.player.get_position());
            this.LoseGameBecauseOfEgg();
        }

        let countDisplay = "Completed mazes: " + this.count_rounds;
        this.shapes.text.set_string(countDisplay, context.context);
        let counter_transform = Mat4.inverse(program_state.camera_inverse)
            .times(Mat4.translation(5.0 / 16, 6.0 / 16, -1))
            .times(Mat4.scale(1.0 / 64, 1.0 / 64, 1.0 / 64));
        this.shapes.text.draw(context, program_state, counter_transform, this.materials.text_image);

        // seconds
        let adjusted_time = this.started ? program_state.animation_time - this.start_round_time : 0;

        this.seconds = Math.floor((adjusted_time / 1000) % 60);
        this.minutes = Math.floor((adjusted_time / 1000) / 60);

        this.LoseGameCheck();
        

        // minutes
        let timerDisplay = "Time: " + this.minutes.toFixed(0) + ":" + this.seconds.toFixed(0);
        if (this.seconds < 10)
            timerDisplay = "Time: " + this.minutes.toFixed(0) + ":0" + this.seconds.toFixed(0);
        this.shapes.timer.set_string(timerDisplay, context.context);
        let timer_transform = Mat4.inverse(program_state.camera_inverse)
            .times(Mat4.translation(5.0 / 16, 5.0 / 16, -1))
            .times(Mat4.scale(1.0 / 64, 1.0 / 64, 1.0 / 64));
        this.shapes.timer.draw(context, program_state, timer_transform, this.materials.text_image);

        if (this.pov) {
            const player_position = this.player.get_position();
            const player_direction = this.player.get_direction();

            const camera_offset = vec3(0, 2, 0.7);
            const target_camera_position = player_position.plus(player_direction.times(camera_offset[2])).plus(vec3(0, camera_offset[1], 0));
            const target_look_at_point = player_position.plus(player_direction.times(9));

            this.current_camera_position = this.lerp(Vector.from(this.current_camera_position), Vector.from(target_camera_position), 0.1);
            this.current_look_at_point = this.lerp(Vector.from(this.current_look_at_point), Vector.from(target_look_at_point), 0.1);

            const new_camera_transform = Mat4.look_at(this.current_camera_position, this.current_look_at_point, vec3(0, 1, 0));

            program_state.set_camera(new_camera_transform);
        } else {
            program_state.set_camera(Mat4.look_at(vec3(26, 80, 20), vec3(26, 0, 20), vec3(0, 0, -1)));
        }

        if (this.maze.checkEnd(this.player.get_position())) {
            this.count_rounds += 1;
            this.WinGameCheck();
            this.start_round_time = program_state.animation_time;
            this.regenerate_maze();
        }
    }
}
