import { defs, tiny } from './examples/common.js';
const { vec3, Mat4, Shape, Texture, Material, Scene } = tiny;

export class Maze {
    constructor() {
        this.shapes = { box: new defs.Cube() };
        this.materials = { 
            wall: new Material(new defs.Textured_Phong(), { 
                color: tiny.color(0.0, 0.0, 0.0, 1),
                ambient: 1.0, 
                texture: new Texture("assets/wall.png") //Current material for walls is a brick wall
            }),
            start: new Material(new defs.Phong_Shader(), { 
                color: tiny.color(0.0, 1.0, 0.0, 1) 
            }), // Green for start
            end: new Material(new defs.Phong_Shader(), { 
                color: tiny.color(1.0, 0.0, 0.0, 1) 
            }) // Red for end
        };

        this.start_position = vec3(0,1,0);

        // Define a 20x20 complex maze layout with interconnected pathways and accessible start/end points
        this.maze_layout = [
            [2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1],
            [1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0], 
            [1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
            [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0],
            [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
            [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
            [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3]
        ];
    }

    is_collision(position) {
        const x = Math.floor(position[0] / 2);
        const z = Math.floor(position[2] / 2);
        return this.maze_layout[z] && this.maze_layout[z][x] === 1;
    }

    display(context, program_state) {
        const wall_height = 2; // Height of the walls
        for (let i = 0; i < this.maze_layout.length; i++) {
            for (let j = 0; j < this.maze_layout[i].length; j++) {
                let model_transform = Mat4.translation(i * 2, wall_height / 2, j * 2).times(Mat4.scale(1, wall_height / 2, 1));
                if (this.maze_layout[i][j] === 1) {
                    this.shapes.box.draw(context, program_state, model_transform, this.materials.wall);
                } else if (this.maze_layout[i][j] === 2) {
                    let start_transform = Mat4.translation(i * 2, 0, j * 2).times(Mat4.scale(1, 0.1, 1));
                    this.shapes.box.draw(context, program_state, start_transform, this.materials.start);
                } else if (this.maze_layout[i][j] === 3) {
                    let end_transform = Mat4.translation(i * 2, 0, j * 2).times(Mat4.scale(1, 0.1, 1));
                    this.shapes.box.draw(context, program_state, end_transform, this.materials.end);
                }
            }
        }
    }

    checkEnd(position) {
        const x = Math.floor(position[0]/2);
        const z = Math.floor(position[2]/2);

        return (x == 25 && z == 18);
    }
}