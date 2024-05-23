import { defs, tiny } from './examples/common.js';
const { vec3, Mat4, Shape, Material, Scene } = tiny;

export class Player {
    constructor() {
        this.position = vec3(0, 1, 0); // Ensure the player is within the camera's view
        this.rotation = 0;
        this.speed = 0.1;
        this.shapes = { box: new defs.Cube() }; // Shape for the player
        this.materials = { plastic: new Material(new defs.Phong_Shader(), { color: tiny.color(0.9, 0.5, 0.5, 1) }) }; // Material for the player
    }

    move_forward(maze) {
        nextPosition = this.position;
        nextPosition[2] -= this.speed * Math.cos(this.rotation);
        nextPosition[0] -= this.speed * Math.sin(this.rotation);

        if (!this.checkCollision(nextPosition, maze)) {
            this.position = nextPosition;
        }
    }

    move_backward(maze) {
        nextPosition = this.position;
        nextPosition[2] += this.speed * Math.cos(this.rotation);
        nextPosition[0] += this.speed * Math.sin(this.rotation);

        if (!this.checkCollision(nextPosition, maze)) {
            this.position = nextPosition;
        }
    }

    turn_left() {
        this.rotation += Math.PI / 16;
    }

    turn_right() {
        this.rotation -= Math.PI / 16;
    }

    checkCollision(nextPosition, maze) {
        const x = Math.floor(nextPosition[0] / 2);
        const z = Math.floor(nextPosition[2] / 2);

        // Check bounds
        if (x < 0 || x >= maze.maze_layout.length || z < 0 || z >= maze.maze_layout[0].length) {
            return true;
        }

        // Check collision with walls
        return maze.maze_layout[x][z] === 1;
    }

    display(context, program_state) {
        const model_transform = Mat4.translation(...this.position).times(Mat4.rotation(this.rotation, 0, 1, 0));
        this.shapes.box.draw(context, program_state, model_transform, this.materials.plastic);
    }

    getTransform() {
        return Mat4.translation(this.position[0], this.position[1], this.position[2]);
    }
}
