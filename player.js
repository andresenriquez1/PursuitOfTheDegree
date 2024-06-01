import { defs, tiny } from './examples/common.js';
const { vec3, Mat4, Shape, Material, Scene, hex_color } = tiny;
import { Maze } from './maze.js'

export class Player {
    constructor(){
        this.position = vec3(0, 1, 0);
        this.direction = vec3(0, 0, 1);
        this.rotation = 0.0;
        this.speed = 2;
        
        this.shapes = {
            sphere: new defs.Subdivision_Sphere(4), // Use a subdivision sphere for a smoother, more realistic shape
            body: new defs.Cube(), // Use a cube for the body to provide a different texture
        };
        this.materials = {
            plastic: new Material(new defs.Textured_Phong(), {
                color: hex_color("#ffffff"), ambient: 0.5, diffusivity: 0.5, specularity: 0.5,
                //texture: new Texture("assets/player_texture.jpg") // Add texture for more realism
            }),
            head: new Material(new defs.Textured_Phong(), {
                color: hex_color("#ffcc99"), ambient: 0.5, diffusivity: 0.5, specularity: 0.5,
               // texture: new Texture("assets/player_head_texture.jpg") // Texture for the head
            }),
        
        }
    }
//     move_forward() {
//         const nextPosition = this.position.plus(vec3(this.speed * Math.sin(this.rotation), 0, this.speed * Math.cos(this.rotation)));
//         //console.log(nextPosition,"nextPosition");
//         if (!this.checkCollision(nextPosition)) {
//             this.position = nextPosition;
//         }
//     }

//     move_backward() {
//         const nextPosition = this.position.minus(vec3(this.speed * Math.sin(this.rotation), 0, this.speed * Math.cos(this.rotation)));
//         if (!this.checkCollision(nextPosition)) {
//             this.position = nextPosition;
//         }
//     }


    checkCollision(nextPosition) {
        
        const x = Math.floor(nextPosition[0] / 2);
        const z = Math.floor(nextPosition[2] / 2);

        console.log(x,"x");
        console.log(z,"z");

        console.log(this.maze.maze_layout[z][x], "layout");

        // Check bounds
        // if (x < 0 || x >= this.maze.maze_layout.length || z < 0 || z >= this.maze.maze_layout[0].length) {
        //     return true;
        // }

        // Check collision with walls
        return this.maze.maze_layout[x][z] === 1; // Notice the use of z and x to match maze layout
    }
    
    get_position() {
        return this.position;
    }

    get_direction(){
        return this.direction;
    }

    move_forward(){
        let next_position = this.position.plus(this.direction);
        this.position = next_position;
    }
    move_backward(){
        let next_position = this.position.minus(this.direction);
        this.position = next_position; 
    }
    turn_left(){
        const angle = -Math.PI / 2; // 90 degrees in radians
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        this.direction = vec3(cos * this.direction[0] - sin * this.direction[2], this.direction[1], sin * this.direction[0] + cos * this.direction[2]);
    }
    
    turn_right(){
        const angle = Math.PI / 2; // -90 degrees in radians
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        this.direction = vec3(cos * this.direction[0] - sin * this.direction[2], this.direction[1], sin * this.direction[0] + cos * this.direction[2]);
    }
    
    display(context, program_state) {
        // Model transform for the player's body
        let body_transform = Mat4.translation(...this.position)
            .times(Mat4.scale(0.3, 0.5, 0.3)) // Make the body thinner
            .times(Mat4.rotation(this.rotation, 0, 1, 0));

        // Draw the player's body
        this.shapes.body.draw(context, program_state, body_transform, this.materials.plastic);

        // Model transform for the player's head
        let head_transform = body_transform
            .times(Mat4.translation(0, 2, 0)) // Position the head on top of the body
            .times(Mat4.scale(0.6, 0.6, 0.6)); // Make the head a bit larger

        // Draw the player's head
        this.shapes.sphere.draw(context, program_state, head_transform, this.materials.head);
    }
}
    // display(context, program_state) {
    //     const model_transform = Mat4.translation(...this.position).times(Mat4.scale(0.5, 0.5, 0.5)).times(Mat4.rotation(this.rotation, 0, 1, 0));
    //     this.shapes.box.draw(context, program_state, model_transform, this.materials.plastic);
    // }
