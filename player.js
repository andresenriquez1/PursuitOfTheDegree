import { defs, tiny } from './examples/common.js';
const { vec3, Mat4, Shape, Material, Scene, hex_color, Texture } = tiny;
const {Cube,Textured_Phong, Subdivision_Sphere,Cylindrical_Tube} = defs;
import { Maze } from './maze.js'

export class Player {
    constructor(){
        this.position = vec3(0, 1, 0);
        this.direction = vec3(0, 0, 1);
        this.rotation = 0.0;
        this.target_rotation = 0.0;
        this.rotation_speed = Math.PI / 40; // Rotation speed (1 degree per frame)
        this.speed = 2;
        this.maze = new Maze();
        this.has_key = false; //if true can open a door and u win 
        this.shapes = {
            head: new Subdivision_Sphere(4), // Use a subdivision sphere for a smoother, more realistic shape
            body: new Cube(), // Use a cube for the body to provide a different texture
            arm: new Cylindrical_Tube(1, 10), // Use a cylinder for the arms
            leg: new Cylindrical_Tube(1, 10), // Use a cylinder for the legs
            
        };
        this.materials = {
            plastic: new Material(new Textured_Phong(), {
                color: hex_color("#ffffff"), ambient: 0.5, diffusivity: 0.5, specularity: 0.5,
                //texture: new Texture("assets/player_texture.jpg") // Add texture for more realism
            }),
            head: new Material(new Textured_Phong(), {
                color: hex_color("#ffcc99"), ambient: 0.5, diffusivity: 0.5, specularity: 0.5,
                texture: new Texture("assets/andres.jpg") // Texture for the head
            }),
            body: new Material(new Textured_Phong(), {
                color: hex_color("#0000ff"), ambient: 0.5, diffusivity: 0.5, specularity: 0.5,
                //texture: new Texture("assets/player_body_texture.jpg") // Add texture for the body
            }),
            limb: new Material(new Textured_Phong(), {
                color: hex_color("#ffcc99"), ambient: 0.5, diffusivity: 0.5, specularity: 0.5,
                //texture: new Texture("assets/player_limb_texture.jpg") // Add texture for the limbs
            }),
        };

        // Bounding box dimensions
        this.boundingBox = {
            width: 0.8,
            height: 2.0,
            depth: 0.6
        };
    }

    checkCollision(nextPosition, maze, move) {
        const halfWidth = this.boundingBox.width / 2;
        const halfDepth = this.boundingBox.depth / 2;
        const corners = [
            nextPosition.plus(vec3(halfWidth, 0, halfDepth)),
            nextPosition.plus(vec3(halfWidth, 0, -halfDepth)),
            nextPosition.plus(vec3(-halfWidth, 0, halfDepth)),
            nextPosition.plus(vec3(-halfWidth, 0, -halfDepth))
        ];

        console.log(corners);
    
        for (let corner of corners) {
            console.log(corner);
            let x = Math.round(corner[0] / 2);
            let z = Math.round(corner[2] / 2);
    
            // Clamp x and z to stay within maze bounds
            x = Math.max(0, Math.min(x, maze.maze_layout.length - 1));
            z = Math.max(0, Math.min(z, maze.maze_layout[0].length - 1));
    
            if (maze.maze_layout[x][z] === 1) {
                console.log(`Collision detected at: x=${x}, z=${z}`);
                return true;
            }
        }
        return false;
    }
    checkForKey() {
    
            const key_x = Math.floor(this.maze.key_position[0] / 2);
            const key_z = Math.floor(this.maze.key_position[2] / 2);
            const player_x = Math.floor(this.position[0] / 2);
            const player_z = Math.floor(this.position[2] / 2);

            console.log(key_x,key_z, "keysss");
            console.log(player_x,player_x, "plasy");
            

            if (key_x === player_x && key_z === player_z) {
                this.has_key = true;
                this.position = vec3(25, 1, 18); // Move player to the end of the maze (25, 18)
                //this.maze.key_position = null; // Remove key from the maze
                console.log("Key collected!");
            }
        
    }
    
    
    get_position() {
        return this.position;
    }

    get_direction(){
        return this.direction;
    }
    
    // Pass the maze, so it can use the updated maze
    move_forward(maze) {
        console.log(`Current position: ${this.position}`)

        let next_position = this.position.plus(this.direction.times(this.speed));
        if (!this.checkCollision(next_position, maze, 'f')) {
            console.log(`Moving forward to: ${next_position}`);
            this.position = next_position;
            this.checkForKey();

        }
    }
    
    // Pass the maze, so it can use the updated maze
    move_backward(maze) {
        console.log(`Current position: ${this.position}`)
        let next_position = this.position.minus(this.direction.times(this.speed));
        if (!this.checkCollision(next_position, maze, 'b')) {
            console.log(`Moving backward to: ${next_position}`);

            this.position = next_position;
            this.checkForKey();
        }
    }

    turn_left() {
        const angle = -Math.PI / 2; // 90 degrees in radians
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const [x, y, z] = this.direction;
        this.direction = vec3(
            cos * x - sin * z, 
            y, 
            sin * x + cos * z
        );

        this.target_rotation -= angle;
    }

    turn_right() {
        const angle = Math.PI / 2; // -90 degrees in radians
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const [x, y, z] = this.direction;
        this.direction = vec3(
            cos * x - sin * z, 
            y, 
            sin * x + cos * z
        );

        this.target_rotation -= angle;
    }

    update_rotation() {
        if (this.rotation !== this.target_rotation) {
            const rotation_diff = this.target_rotation - this.rotation;
            const rotation_step = Math.sign(rotation_diff) * Math.min(Math.abs(rotation_diff), this.rotation_speed);
            this.rotation += rotation_step;
        }
    }
    
    display(context, program_state) {

        this.update_rotation();

        // Model transform for the player's body
        let body_transform = Mat4.translation(...this.position)
            .times(Mat4.rotation(this.rotation, 0, 1, 0)) // Apply the rotation
            .times(Mat4.scale(0.4, 0.6, 0.3)); // Make the body thinner and taller

        // Model transform for the player's head
        let head_transform = Mat4.translation(...this.position)
            .times(Mat4.rotation(this.rotation, 0, 1, 0)) // Apply the rotation
            .times(Mat4.translation(0, 1.1, 0)) // Position the head on top of the body
            .times(Mat4.scale(0.5, 0.5, 0.5)); // Make the head a bit larger

        // Model transform for the player's arms
        let left_arm_transform = Mat4.translation(...this.position)
            .times(Mat4.rotation(this.rotation, 0, 1, 0)) // Apply the rotation
            .times(Mat4.translation(-0.6, 0.5, 0)) // Position the left arm
            .times(Mat4.scale(0.1, 0.6, 0.1)); // Scale to make the arm thin and long
        let right_arm_transform = Mat4.translation(...this.position)
            .times(Mat4.rotation(this.rotation, 0, 1, 0)) // Apply the rotation
            .times(Mat4.translation(0.6, 0.5, 0)) // Position the right arm
            .times(Mat4.scale(0.1, 0.6, 0.1)); // Scale to make the arm thin and long

        // Model transform for the player's legs
        let left_leg_transform = Mat4.translation(...this.position)
            .times(Mat4.rotation(this.rotation, 0, 1, 0)) // Apply the rotation
            .times(Mat4.translation(-0.2, -0.6, 0)) // Position the left leg
            .times(Mat4.scale(0.1, 0.6, 0.1)); // Scale to make the leg thin and long
        let right_leg_transform = Mat4.translation(...this.position)
            .times(Mat4.rotation(this.rotation, 0, 1, 0)) // Apply the rotation
            .times(Mat4.translation(0.2, -0.6, 0)) // Position the right leg
            .times(Mat4.scale(0.1, 0.6, 0.1)); // Scale to make the leg thin and long

        
        // Draw the player's body
        this.shapes.body.draw(context, program_state, body_transform, this.materials.body);

        // Draw the player's head
        this.shapes.head.draw(context, program_state, head_transform, this.materials.head);

        // Draw the player's arms
        this.shapes.arm.draw(context, program_state, left_arm_transform, this.materials.limb);
        this.shapes.arm.draw(context, program_state, right_arm_transform, this.materials.limb);

        // Draw the player's legs
        this.shapes.leg.draw(context, program_state, left_leg_transform, this.materials.limb);
        this.shapes.leg.draw(context, program_state, right_leg_transform, this.materials.limb);
    }
    /*
    update_timer_and_health(program_state) {
        if (!this.start_time) {
            this.start_time = program_state.animation_time / 1000;
        }
        const elapsed_time = program_state.animation_time / 1000 - this.start_time;
        this.time_remaining = 180 - Math.floor(elapsed_time);
        if (this.time_remaining <= 0) {
            this.time_remaining = 0;
        }
        // Decrement health every 45 seconds
        if (elapsed_time >= 45 * (this.max_health - this.health + 1) && this.health > 0) {
            this.health -= 1;
        }
    }

    display_health_bar(context, program_state) {
        const bar_width = 1;
        const bar_height = 0.2;
        for (let i = 0; i < this.max_health; i++) {
            const bar_transform = Mat4.translation(this.position[0] - 2 + i * bar_width, this.position[1] + 2, this.position[2])
                .times(Mat4.scale(bar_width / 2, bar_height / 2, 0.1));
            const material = (i < this.health) ? this.materials.health_bar_green : this.materials.health_bar_red;
            this.shapes.health_bar.draw(context, program_state, bar_transform, material);
        }
    }
    */
}
