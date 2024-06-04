import { defs, tiny } from './examples/common.js';
const { vec3, Mat4, Shape, Texture, Material, Scene } = tiny;
import { BinaryTreeMaze } from './BinaryMazeGenerator.js';

export class Maze {
    constructor() {
        this.shapes = { 
            box: new defs.Cube(), 
            floor: new defs.Square(),
            key_shaft: new defs.Capped_Cylinder(1, 20, [[0, 2], [0, 1]]),
            key_bit: new defs.Cube()
        };
        this.materials = { 
            wall: new Material(new defs.Textured_Phong(), { 
                color: tiny.color(0.0, 0.0, 0.0, 1),
                ambient: 1.0, 
                texture: new Texture("assets/door2.jpg") //Current material for walls is a brick wall
            }),
            tile: new Material(new defs.Textured_Phong(), {
                color: tiny.color(0.0,0.0,0.0,1),
                ambient: 1.0,
                texture: new Texture("assets/floor2.jpg")
            }),
            start: new Material(new defs.Phong_Shader(), { 
                color: tiny.color(0.0, 1.0, 0.0, 1) 
            }), // Green for start
            end: new Material(new defs.Phong_Shader(), { 
                color: tiny.color(1.0, 0.0, 0.0, 1) 
            }),// Red for end
            key: new Material(new defs.Phong_Shader(), {
                color: tiny.color(1.0, 0.84, 0.0, 1)  // Gold color
            })
        };
        this.width = 21; // Must be odd
        this.height = 27; // Must be odd
        this.start_position = vec3(0,1,0);
        this.generateMaze();
        this.placeKey();
        // const mazeGenerator = new BinaryTreeMaze(this.width, this.height);
        // this.maze_layout = mazeGenerator.generate();

        // Define a 20x20 complex maze layout with interconnected pathways and accessible start/end points
        //x is the row
        //z is the column
    //     this.maze_layout = [
    //         [2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    //         [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1],
    //         [1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1],
    //         [1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1],
    //         [1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1],
    //         [1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1],
    //         [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1],
    //         [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1],
    //         [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    //         [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0], 
    //         [1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    //         [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    //         [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0],
    //         [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
    //         [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    //         [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
    //         [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1],
    //         [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    //         [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    //         [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    //         [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1],
    //         [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    //         [1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
    //         [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    //         [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    //         [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3]
    //     ];
     }

     generateMaze() {
     
        const mazeGenerator = new BinaryTreeMaze(this.width, this.height);
        this.maze_layout = mazeGenerator.generate();
         // Set start point at top left (1, 1)
         this.maze_layout[0][0] = 2;
         this.maze_layout[0][1] = 0;
         this.maze_layout[0][2] = 0;

         // Set end point at bottom right
         this.maze_layout[this.height - 1][this.width - 1] = 3;
         this.maze_layout[this.height - 1][this.width - 2] = 0;
        
     }

     placeKey() {
        let placed = false;
        while (!placed) {
            const x = Math.round(Math.random() * (this.width - 2)) + 1;
            const z = Math.round(Math.random() * (this.height - 2)) + 1;
            console.log(x,z, "orignal mazw layout for key");
            if (this.maze_layout[x][z] === 0) { // Ensure the key is placed in an empty cell
                this.key_position = vec3(x , 1, z);
                
                placed = true;
            }
        }
    }

    display(context, program_state) {
        //console.log(this.maze_layout, "he2");
        const wall_height = 5; // Height of the walls
        let model_transform = Mat4.identity().times(Mat4.rotation(Math.PI/2, 1, 0, 0)).times(Mat4.scale(28, 22.5, 1)).times(Mat4.translation(0.93, 0.90, 1));
        this.shapes.floor.arrays.texture_coord.forEach(
            (v, i, l) => {
                v[0] = v[0] * 20;
                v[1] = v[1] * 20;
            }
        );
        this.shapes.floor.draw(context, program_state, model_transform, this.materials.tile);
        //console.log(this.maze_layout, "he");
        for (let i = 0; i < this.maze_layout.length; i++) {
            for (let j = 0; j < this.maze_layout[i].length; j++) {
                model_transform = Mat4.translation(i * 2, wall_height / 2, j * 2).times(Mat4.scale(1, wall_height / 2, 1));
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
            if (this.key_position) {
                // Key head
                let key_transform = Mat4.translation(...this.key_position).times(Mat4.scale(0.5, 0.5, 0.5));
                // Key shaft
                key_transform = key_transform.times(Mat4.translation(0, -1.5, 0)).times(Mat4.scale(0.2, 3, 0.2));
                this.shapes.key_shaft.draw(context, program_state, key_transform, this.materials.key);
                // Key bit
                key_transform = key_transform.times(Mat4.translation(0, -1, 0)).times(Mat4.scale(5, 0.2, 0.5));
                this.shapes.key_bit.draw(context, program_state, key_transform, this.materials.key);
            }
        }
    }

    checkEnd(position) {
        const x = Math.floor(position[0]/2);
        const z = Math.floor(position[2]/2);

        return (x == 26 && z == 20);
    }
}