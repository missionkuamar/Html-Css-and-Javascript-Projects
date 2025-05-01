document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('maze-canvas');
    const ctx = canvas.getContext('2d');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const algorithmSelect = document.getElementById('algorithm');
    const generateBtn = document.getElementById('generate-btn');
    const solveBtn = document.getElementById('solve-btn');
    const clearBtn = document.getElementById('clear-btn');
    const genTimeDisplay = document.getElementById('gen-time');
    const solveTimeDisplay = document.getElementById('solve-time');
    const pathLengthDisplay = document.getElementById('path-length');
    
    // Maze variables
    let maze = [];
    let cellSize = 20;
    let start = { x: 0, y: 0 };
    let end = { x: 0, y: 0 };
    let solutionPath = [];
    
    // Initialize the maze
    function initMaze() {
        const width = parseInt(widthInput.value);
        const height = parseInt(heightInput.value);
        
        // Set canvas size
        canvas.width = width * cellSize;
        canvas.height = height * cellSize;
        
        // Initialize maze grid
        maze = new Array(height);
        for (let y = 0; y < height; y++) {
            maze[y] = new Array(width).fill(1); // 1 = wall, 0 = path
        }
        
        // Set start and end points
        start = { x: 0, y: 0 };
        end = { x: width - 1, y: height - 1 };
        maze[start.y][start.x] = 0;
        maze[end.y][end.x] = 0;
        
        solutionPath = [];
        drawMaze();
    }
    
    // Generate maze using Depth-First Search
    async function generateMaze() {
        const width = parseInt(widthInput.value);
        const height = parseInt(heightInput.value);
        
        initMaze();
        generateBtn.disabled = true;
        
        const startTime = performance.now();
        
        // Stack for DFS
        const stack = [];
        const visited = new Set();
        
        // Start from the start position
        stack.push(start);
        visited.add(`${start.x},${start.y}`);
        
        // Directions: up, right, down, left
        const directions = [
            { dx: 0, dy: -1 }, // up
            { dx: 1, dy: 0 },  // right
            { dx: 0, dy: 1 },  // down
            { dx: -1, dy: 0 }  // left
        ];
        
        while (stack.length > 0) {
            const current = stack.pop();
            
            // Shuffle directions
            const shuffledDirections = [...directions].sort(() => Math.random() - 0.5);
            
            for (const dir of shuffledDirections) {
                const nx = current.x + dir.dx * 2;
                const ny = current.y + dir.dy * 2;
                
                if (nx >= 0 && nx < width && ny >= 0 && ny < height && !visited.has(`${nx},${ny}`)) {
                    // Carve path
                    maze[current.y + dir.dy][current.x + dir.dx] = 0;
                    maze[ny][nx] = 0;
                    
                    visited.add(`${nx},${ny}`);
                    stack.push({ x: nx, y: ny });
                    
                    // Visual update
                    if (width * height < 1000) { // Only animate for smaller mazes
                        drawMaze();
                        await new Promise(resolve => setTimeout(resolve, 10));
                    }
                }
            }
        }
        
        const endTime = performance.now();
        genTimeDisplay.textContent = Math.round(endTime - startTime);
        
        drawMaze();
        generateBtn.disabled = false;
    }
    
    // Solve maze using selected algorithm
    async function solveMaze() {
        const algorithm = algorithmSelect.value;
        solveBtn.disabled = true;
        clearBtn.disabled = true;
        
        const startTime = performance.now();
        
        switch (algorithm) {
            case 'dfs':
                await solveWithDFS();
                break;
            case 'bfs':
                await solveWithBFS();
                break;
            case 'astar':
                await solveWithAStar();
                break;
        }
        
        const endTime = performance.now();
        solveTimeDisplay.textContent = Math.round(endTime - startTime);
        pathLengthDisplay.textContent = solutionPath.length;
        
        solveBtn.disabled = false;
        clearBtn.disabled = false;
    }
    
    // Depth-First Search solver
    async function solveWithDFS() {
        const width = parseInt(widthInput.value);
        const height = parseInt(heightInput.value);
        
        const stack = [];
        const visited = new Set();
        const parent = {};
        
        stack.push(start);
        visited.add(`${start.x},${start.y}`);
        
        const directions = [
            { dx: 0, dy: -1 }, // up
            { dx: 1, dy: 0 },  // right
            { dx: 0, dy: 1 },  // down
            { dx: -1, dy: 0 }  // left
        ];
        
        let found = false;
        
        while (stack.length > 0 && !found) {
            const current = stack.pop();
            
            // Check if we've reached the end
            if (current.x === end.x && current.y === end.y) {
                found = true;
                break;
            }
            
            for (const dir of directions) {
                const nx = current.x + dir.dx;
                const ny = current.y + dir.dy;
                
                if (nx >= 0 && nx < width && ny >= 0 && ny < height && 
                    maze[ny][nx] === 0 && !visited.has(`${nx},${ny}`)) {
                    
                    stack.push({ x: nx, y: ny });
                    visited.add(`${nx},${ny}`);
                    parent[`${nx},${ny}`] = current;
                    
                    // Visual update
                    drawMazeWithVisited(visited);
                    await new Promise(resolve => setTimeout(resolve, 10));
                }
            }
        }
        
        // Reconstruct path if found
        if (found) {
            solutionPath = [];
            let current = end;
            
            while (current.x !== start.x || current.y !== start.y) {
                solutionPath.unshift(current);
                current = parent[`${current.x},${current.y}`];
            }
            solutionPath.unshift(start);
            
            drawMazeWithSolution();
        }
    }
    
    // Breadth-First Search solver
    async function solveWithBFS() {
        const width = parseInt(widthInput.value);
        const height = parseInt(heightInput.value);
        
        const queue = [];
        const visited = new Set();
        const parent = {};
        
        queue.push(start);
        visited.add(`${start.x},${start.y}`);
        
        const directions = [
            { dx: 0, dy: -1 }, // up
            { dx: 1, dy: 0 },  // right
            { dx: 0, dy: 1 },  // down
            { dx: -1, dy: 0 }  // left
        ];
        
        let found = false;
        
        while (queue.length > 0 && !found) {
            const current = queue.shift();
            
            // Check if we've reached the end
            if (current.x === end.x && current.y === end.y) {
                found = true;
                break;
            }
            
            for (const dir of directions) {
                const nx = current.x + dir.dx;
                const ny = current.y + dir.dy;
                
                if (nx >= 0 && nx < width && ny >= 0 && ny < height && 
                    maze[ny][nx] === 0 && !visited.has(`${nx},${ny}`)) {
                    
                    queue.push({ x: nx, y: ny });
                    visited.add(`${nx},${ny}`);
                    parent[`${nx},${ny}`] = current;
                    
                    // Visual update
                    drawMazeWithVisited(visited);
                    await new Promise(resolve => setTimeout(resolve, 10));
                }
            }
        }
        
        // Reconstruct path if found
        if (found) {
            solutionPath = [];
            let current = end;
            
            while (current.x !== start.x || current.y !== start.y) {
                solutionPath.unshift(current);
                current = parent[`${current.x},${current.y}`];
            }
            solutionPath.unshift(start);
            
            drawMazeWithSolution();
        }
    }
    
    // A* Search solver
    async function solveWithAStar() {
        const width = parseInt(widthInput.value);
        const height = parseInt(heightInput.value);
        
        const openSet = new Set([`${start.x},${start.y}`]);
        const closedSet = new Set();
        const gScore = {};
        const fScore = {};
        const parent = {};
        
        // Initialize scores
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                gScore[`${x},${y}`] = Infinity;
                fScore[`${x},${y}`] = Infinity;
            }
        }
        
        gScore[`${start.x},${start.y}`] = 0;
        fScore[`${start.x},${start.y}`] = heuristic(start, end);
        
        const directions = [
            { dx: 0, dy: -1 }, // up
            { dx: 1, dy: 0 },  // right
            { dx: 0, dy: 1 },  // down
            { dx: -1, dy: 0 }  // left
        ];
        
        let found = false;
        
        while (openSet.size > 0 && !found) {
            // Find node in openSet with lowest fScore
            let current = null;
            let lowestFScore = Infinity;
            
            for (const coord of openSet) {
                if (fScore[coord] < lowestFScore) {
                    lowestFScore = fScore[coord];
                    current = coord;
                }
            }
            
            const [x, y] = current.split(',').map(Number);
            
            // Check if we've reached the end
            if (x === end.x && y === end.y) {
                found = true;
                break;
            }
            
            openSet.delete(current);
            closedSet.add(current);
            
            for (const dir of directions) {
                const nx = x + dir.dx;
                const ny = y + dir.dy;
                const neighbor = `${nx},${ny}`;
                
                if (nx >= 0 && nx < width && ny >= 0 && ny < height && 
                    maze[ny][nx] === 0 && !closedSet.has(neighbor)) {
                    
                    const tentativeGScore = gScore[current] + 1;
                    
                    if (!openSet.has(neighbor)) {
                        openSet.add(neighbor);
                    } else if (tentativeGScore >= gScore[neighbor]) {
                        continue;
                    }
                    
                    parent[neighbor] = { x, y };
                    gScore[neighbor] = tentativeGScore;
                    fScore[neighbor] = gScore[neighbor] + heuristic({ x: nx, y: ny }, end);
                    
                    // Visual update
                    drawMazeWithVisited(closedSet);
                    await new Promise(resolve => setTimeout(resolve, 10));
                }
            }
        }
        
        // Reconstruct path if found
        if (found) {
            solutionPath = [];
            let current = end;
            
            while (current.x !== start.x || current.y !== start.y) {
                solutionPath.unshift(current);
                current = parent[`${current.x},${current.y}`];
            }
            solutionPath.unshift(start);
            
            drawMazeWithSolution();
        }
    }
    
    // Heuristic function for A* (Manhattan distance)
    function heuristic(a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }
    
    // Draw the maze
    function drawMaze() {
        const width = parseInt(widthInput.value);
        const height = parseInt(heightInput.value);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw walls and paths
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (maze[y][x] === 1) {
                    ctx.fillStyle = '#333';
                } else {
                    ctx.fillStyle = '#fff';
                }
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                ctx.strokeStyle = '#ddd';
                ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
        
        // Draw start and end points
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(start.x * cellSize, start.y * cellSize, cellSize, cellSize);
        ctx.fillStyle = '#F44336';
        ctx.fillRect(end.x * cellSize, end.y * cellSize, cellSize, cellSize);
    }
    
    // Draw maze with visited nodes
    function drawMazeWithVisited(visited) {
        drawMaze();
        
        ctx.fillStyle = 'rgba(100, 200, 255, 0.3)';
        for (const coord of visited) {
            const [x, y] = coord.split(',').map(Number);
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
    
    // Draw maze with solution path
    function drawMazeWithSolution() {
        drawMaze();
        
        ctx.strokeStyle = '#FFC107';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        for (let i = 0; i < solutionPath.length; i++) {
            const cell = solutionPath[i];
            const centerX = cell.x * cellSize + cellSize / 2;
            const centerY = cell.y * cellSize + cellSize / 2;
            
            if (i === 0) {
                ctx.moveTo(centerX, centerY);
            } else {
                ctx.lineTo(centerX, centerY);
            }
        }
        
        ctx.stroke();
    }
    
    // Clear solution
    function clearSolution() {
        solutionPath = [];
        drawMaze();
        solveTimeDisplay.textContent = '0';
        pathLengthDisplay.textContent = '0';
    }
    
    // Event listeners
    generateBtn.addEventListener('click', generateMaze);
    solveBtn.addEventListener('click', solveMaze);
    clearBtn.addEventListener('click', clearSolution);
    
    // Initialize with a small maze
    initMaze();
});