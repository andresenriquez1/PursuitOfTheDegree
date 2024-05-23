import { defs, tiny } from './examples/common.js';
import { Maze } from './maze.js';
import { Player } from './player.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, Matrix, Mat4, Light, Shape, Material, Shader, Texture, Scene,
    Canvas_Widget, Code_Widget, Text_Widget
} = tiny;

//Extra imports from a previous assignment for experimentation sake
/*
import {Axes_Viewer, Axes_Viewer_Test_Scene} from "./examples/axes-viewer.js"
import {Collision_Demo, Inertia_Demo} from "./examples/collisions-demo.js"
import {Many_Lights_Demo} from "./examples/many-lights-demo.js"
import {Obj_File_Demo} from "./examples/obj-file-demo.js"
import {Scene_To_Texture_Demo} from "./examples/scene-to-texture-demo.js"
import {Surfaces_Demo} from "./examples/surfaces-demo.js"
import {Text_Demo} from "./examples/text-demo.js"
import {Transforms_Sandbox} from "./examples/transforms-sandbox.js"

const Minimal_Webgl_Demo = defs.Minimal_Webgl_Demo;

Object.assign(defs,
    {Axes_Viewer, Axes_Viewer_Test_Scene},
    {Inertia_Demo, Collision_Demo},
    {Many_Lights_Demo},
    {Obj_File_Demo},
    {Scene_To_Texture_Demo},
    {Surfaces_Demo},
    {Text_Demo},
    {Transforms_Sandbox}
);
*/
//export {Canvas_Widget, Code_Widget, Text_Widget, defs}

export class Main_Scene extends Scene {
    constructor() {
        super();
        this.maze = new Maze();
        this.player = new Player();
        this.player.position = this.maze.start_position;
        this.initial_camera_location = Mat4.look_at(vec3(15, 50, 40), vec3(15, 0, 20), vec3(0, 1, 0));
        //NOTE: Current alternative solution to the control panel.
        window.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowLeft':
                    this.player.turn_left();
                    break;
                case 'ArrowRight':
                    this.player.turn_right();
                    break;
                case 'ArrowUp':
                    this.player.move_forward();
                    break;
                case 'ArrowDown':
                    this.player.move_backward();
                    break;
            }
        });
    }

    //NOTE: Not sure, why this method doesn't work, but the above one does. Should probably ask a TA.
    /*
    make_control_panel() {
        this.key_triggered_button("Move Player Left", ['ArrowLeft'], () => {
            console.log("Turning Left!")
            this.player.turn_left()
        });
        this.new_line();
        this.key_triggered_button("Move Player Right", ['ArrowRight'], () => this.player.turn_right());
        this.new_line();
        this.key_triggered_button("Move Player Forward", ['ArrowUp'], () => this.player.move_forward(this.maze));
        this.new_line()
        this.key_triggered_button("Move Player Back", ['ArrowDown'], () => this.player.move_backward(this.maze));
    }
    */

    display(context, program_state) {
        //Setting the animation time
        let t = program_state.animation_time / 1000.0; // ms -> s

        // Set the initial camera location
        program_state.set_camera(this.initial_camera_location);
        program_state.projection_transform = Mat4.perspective(Math.PI / 4, context.width / context.height, 0.1, 1000);

        // Set up the light
        const light_position = vec4(20, 50, 20, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];

        // Display the maze
        this.maze.display(context, program_state);
        
        // Display the player
        this.player.display(context, program_state);
    }
}

