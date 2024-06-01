import { defs, tiny } from './examples/common.js';
const { vec3, Mat4, Shape, Material, Scene, hex_color } = tiny;
const { Cube, Phong_Shader } = defs;
//Source = https://stackoverflow.com/questions/38502/whats-a-good-algorithm-to-generate-a-maze

export class BinaryTreeMaze {
    constructor(width, height, skew = null) {
        this.width = width;
        this.height = height;
        this.grid = this.createEmptyGrid();
        this.skew = this.getSkewDirection(skew);
    }

    createEmptyGrid() {
        console.log("1");
        const grid = [];
        for (let i = 0; i < this.height; i++) {
            grid.push([]);
            for (let j = 0; j < this.width; j++) {
                grid[i].push(1); // Initialize all cells as walls
            }
        }
        return grid;
    }

    getSkewDirection(skew) {
        console.log("2");
        const skewes = {
            "NW": [[1, 0], [0, -1]],
            "NE": [[1, 0], [0, 1]],
            "SW": [[-1, 0], [0, -1]],
            "SE": [[-1, 0], [0, 1]],
        };
        if (skew && skewes[skew]) {
            return skewes[skew];
        }
        const keys = Object.keys(skewes);
        return skewes[keys[Math.floor(Math.random() * keys.length)]];
    }

    generate() {
        console.log("3");
        for (let row = 1; row < this.height; row += 2) {
            for (let col = 1; col < this.width; col += 2) {
                this.grid[row][col] = 0;
                const [neighborRow, neighborCol] = this.findNeighbor(row, col);
                this.grid[neighborRow][neighborCol] = 0;
            }
        }
        return this.grid;
    }

    findNeighbor(currentRow, currentCol) {
        console.log("4");
        const neighbors = [];
        for (const [bRow, bCol] of this.skew) {
            const neighborRow = currentRow + bRow;
            const neighborCol = currentCol + bCol;
            if (neighborRow > 0 && neighborRow < this.height - 1 &&
                neighborCol > 0 && neighborCol < this.width - 1) {
                neighbors.push([neighborRow, neighborCol]);
            }
        }
        if (neighbors.length === 0) {
            return [currentRow, currentCol];
        }
        return neighbors[Math.floor(Math.random() * neighbors.length)];
    }
}
