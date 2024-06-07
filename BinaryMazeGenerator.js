import { defs, tiny } from './examples/common.js';
const { vec3, Mat4, Shape, Material, Scene, hex_color } = tiny;
const { Cube, Phong_Shader } = defs;
//Source = https://stackoverflow.com/questions/38502/whats-a-good-algorithm-to-generate-a-maze

export class BinaryTreeMaze {
    constructor(mazeWidth, mazeHeight, skewDirection = null) {
        this.mazeWidth = mazeWidth;
        this.mazeHeight = mazeHeight;
        this.mazeGrid = this.createEmptyMazeGrid();
        this.skewDirection = this.determineSkewDirection(skewDirection);
    }

    // Create an empty grid filled with walls
    createEmptyMazeGrid() {
        //console.log("1");
        const grid = [];
        for (let rowIndex = 0; rowIndex < this.mazeHeight; rowIndex++) {
            grid.push([]);
            for (let colIndex = 0; colIndex < this.mazeWidth; colIndex++) {
                grid[rowIndex].push(1); // Initialize all cells as walls
            }
        }
        return grid;
    }

    // Determine the skew direction for the maze
    determineSkewDirection(skewDirection) {
        //console.log("2");
        const skewDirections = {
            "NW": [[1, 0], [0, -1]],
            "NE": [[1, 0], [0, 1]],
            "SW": [[-1, 0], [0, -1]],
            "SE": [[-1, 0], [0, 1]],
        };
        if (skewDirection && skewDirections[skewDirection]) {
            return skewDirections[skewDirection];
        }
        const directionKeys = Object.keys(skewDirections);
        return skewDirections[directionKeys[Math.floor(Math.random() * directionKeys.length)]];
    }

    // Generate the maze using the binary tree algorithm
    generateMaze() {
        //console.log("3");
        for (let row = 1; row < this.mazeHeight; row += 2) {
            for (let col = 1; col < this.mazeWidth; col += 2) {
                this.mazeGrid[row][col] = 0;
                const [neighborRow, neighborCol] = this.findMazeNeighbor(row, col);
                this.mazeGrid[neighborRow][neighborCol] = 0;
            }
        }
        return this.mazeGrid;
    }

    // Find a neighboring cell to connect
    findMazeNeighbor(currentRow, currentCol) {
        //console.log("4");
        const TheFoundneighbors = [];
        for (const [rowOffset, colOffset] of this.skewDirection) {
            const AneighboringColumn = currentCol + colOffset;
            const AneighboringRow = currentRow + rowOffset;
            
            if (AneighboringRow > 0 && AneighboringRow < this.mazeHeight - 1 &&
                AneighboringColumn > 0 && AneighboringColumn< this.mazeWidth - 1) {
                    TheFoundneighbors.push([AneighboringRow, AneighboringColumn]);
            }
        }
        if (TheFoundneighbors.length === 0) {
            return [currentRow, currentCol];
        }
        return TheFoundneighbors[Math.floor(Math.random() * TheFoundneighbors.length)];
    }
}
