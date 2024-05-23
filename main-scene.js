import { defs, tiny } from './common.js';
import { Maze } from './maze.js';
import { Player } from './player.js';

const { vec3, vec4, color, Mat4, Light, Scene } = tiny;

export class Main_Scene extends Scene {
    constructor() {
        super();
        this.maze = new Maze();
        this.player = new Player();
        this.player.position = this.maze.start_position;
        this.initial_camera_location = Mat4.look_at(vec3(15, 50, 40), vec3(20, 0, 20), vec3(0, 1, 0));
    }

    display(context, program_state) {
        // Set the initial camera location
        program_state.set_camera(this.initial_camera_location);
        program_state.projection_transform = Mat4.perspective(Math.PI / 4, context.width / context.height, 0.1, 1000);

        // Set up the light
        const light_position = vec4(20, 50, 20, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];

        // Display the maze
        this.maze.display(context, program_state);
    }
}
