//Bättre sudd icon

const gameWidth = 495;
const cellSize = 55;
var xoffset = 100;
var yoffset = 100;
var pointer;

//Game
var grid = [];
var noteGrid = [];
var selectedNumber = 1;
var selectedNote = true;
var noteMode = false;
var cellMode = false;
var highlightMode = true;
var selectedCell = { x: null, y: null };

function preload() {
	pointer = loadImage('/pointer.png');
}

function setup() {
	document.addEventListener('contextmenu', (event) => event.preventDefault());
	for (let x = 0; x < 9; x++) {
		grid[x] = [];
		for (let y = 0; y < 9; y++) {
			grid[x][y] = null;
		}
	}
	for (let i = 0; i < 9; i++) {
		noteGrid[i] = [];
		for (let j = 0; j < 9; j++) {
			noteGrid[i][j] = [];
			for (let k = 0; k < 9; k++) {
				noteGrid[i][j][k] = false;
			}
		}
	}
	createCanvas(900, 700);
}

function draw() {
	background(248, 248, 255);

	if (inRange(mouseX, xoffset, gameWidth + xoffset - 1)) {
		if (inRange(mouseY, yoffset, gameWidth + yoffset - 1)) {
			let cellX = floor((mouseX - xoffset) / cellSize);
			let cellY = floor((mouseY - yoffset) / cellSize);
			noStroke();
			fill(100, 149, 247, 100);
			rect(cellX * cellSize + xoffset, cellY * cellSize + yoffset, cellSize, cellSize);

			if (mouseIsPressed && !cellMode) {
				if (!noteMode) {
					if (mouseButton === LEFT) {
						grid[cellX][cellY] = selectedNumber;
						clearNote(cellX, cellY);
					} else if (mouseButton === RIGHT) {
						grid[cellX][cellY] = null;
						clearNote(cellX, cellY);
					} else if (mouseButton === CENTER) {
						noteGrid[cellX][cellY][selectedNumber - 1] = selectedNote;
						grid[cellX][cellY] = null;
					}
				} else {
					if (mouseButton === LEFT) {
						if (selectedNumber !== null) {
							noteGrid[cellX][cellY][selectedNumber - 1] = selectedNote;
						} else {
							clearNote(cellX, cellY);
						}
						grid[cellX][cellY] = null;
					} else if (mouseButton === RIGHT) {
						grid[cellX][cellY] = null;
						clearNote(cellX, cellY);
					} else if (mouseButton === CENTER) {
						grid[cellX][cellY] = selectedNumber;
						clearNote(cellX, cellY);
					}
				}
			}
		}
	}

	drawGrid();

	drawInfo();
}

function drawGrid() {
	//Ritar den valda rutan
	if (selectedCell.x !== null) {
		noStroke();
		fill(100, 149, 247, 150);
		rect(selectedCell.x * cellSize + xoffset, selectedCell.y * cellSize + yoffset, cellSize, cellSize);
	}
	//Ritar alla highlightade rutor
	if (highlightMode) {
		drawHighlight(selectedCell.x, selectedCell.y);
	}

	//Ritar rutnätet
	stroke(150);
	strokeWeight(1);
	noFill();
	for (let x = 1; x < 9; x++) {
		if (x % 3 != 0) {
			line(x * cellSize + xoffset, yoffset, x * cellSize + xoffset, yoffset + gameWidth);
		}
	}
	for (let y = 1; y < 9; y++) {
		if (y % 3 != 0) {
			line(xoffset, y * cellSize + yoffset, xoffset + gameWidth, y * cellSize + yoffset);
		}
	}
	for (let k = 0; k < 9; k++) {
		stroke(120);
		strokeWeight(2);
		rect((k % 3) * cellSize * 3 + xoffset, floor(k / 3) * cellSize * 3 + yoffset, cellSize * 3, cellSize * 3);
	}
	stroke(110);
	strokeWeight(3);
	rect(xoffset, yoffset, cellSize * 9, cellSize * 9);

	//Rittar siffrorna
	textAlign(CENTER, CENTER);
	textSize(33);
	noStroke();
	fill(110);
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			let txt = grid[i][j] === null ? '' : grid[i][j];
			text(txt, i * cellSize + cellSize / 2 + xoffset, j * cellSize + 30 + yoffset);
		}
	}

	//Ritar noteringssiffor
	textSize(10);
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			for (let k = 0; k < 9; k++) {
				if (noteGrid[i][j][k]) {
					let space = cellSize / 4;
					let x = k % 3;
					let y = floor(k / 3);
					text(k + 1, xoffset + cellSize * i + (x + 1) * space, yoffset + cellSize * j + (y + 1) * space);
				}
			}
		}
	}

	//Ritar ut siffror om de är fel
	for (let i = 0; i < 9; i++) {
		if (i !== selectedCell.x) {
			//Vertikala
		}
		if (i !== selectedCell.y) {
			//Horizontella
		}
		let x = 3 * floor(cellX / 3) + i % 3;
		let y = 3 * floor(cellY / 3) + floor(i / 3);
		if (x !== selectedCell.x && y !== selectedCell.y) {
			//I rutan
		}
	}
}

function drawInfo() {
	textAlign(CENTER, CENTER);
	textSize(33);
	strokeWeight(1);
	let startX = xoffset + gameWidth + cellSize;
	//Ritar den valda siffran
	for (let i = 0; i < 9; i++) {
		let x = i % 3;
		let y = floor(i / 3);
		noFill();
		stroke(110);
		rect(startX + cellSize * x, yoffset + cellSize * y, cellSize, cellSize);
		noStroke();
		fill(110);
		text(i + 1, startX + cellSize * x + cellSize / 2, yoffset + cellSize * y + 30);
	}
	strokeWeight(3);
	noFill();
	stroke(110);
	rect(startX, yoffset, cellSize * 3, cellSize * 3);

	//Meny
	let menuY = yoffset + cellSize * 4;
	//Ritar noterings läget
	noFill();
	stroke(110);
	rect(startX, menuY, cellSize, cellSize);
	noStroke();
	fill(110);
	text('🖉', xoffset + gameWidth + 1.5 * cellSize, menuY + 30);

	//Ritar cell läget
	noFill();
	stroke(110);
	rect(startX + cellSize, menuY, cellSize, cellSize);
	noStroke();
	image(pointer, startX + cellSize, menuY);

	//Ritar sudd läget
	noFill();
	stroke(110);
	rect(startX + cellSize * 2, menuY, cellSize, cellSize);
	noStroke();
	fill(110);
	text('\u232B', startX + 2.5 * cellSize, menuY + 30);

	noFill();
	stroke(10, 200, 10);
	if (noteMode) {
		rect(startX, menuY, cellSize, cellSize);
	}
	if (cellMode) {
		rect(startX + cellSize, menuY, cellSize, cellSize);
	}
	if (selectedNumber == null) {
		rect(startX + cellSize * 2, menuY, cellSize, cellSize);
	} else {
		rect(
			startX + cellSize * ((selectedNumber - 1) % 3),
			yoffset + cellSize * floor((selectedNumber - 1) / 3),
			cellSize,
			cellSize
		);
	}
}

function keyPressed() {
	if (inRange(keyCode, 49, 57) || inRange(keyCode, 97, 105)) {
		let nr = keyCode < 60 ? keyCode - 48 : keyCode - 96;
		if (!noteMode) {
			grid[selectedCell.x][selectedCell.y] = nr;
			clearNote(selectedCell.x, selectedCell.y);
			selectedNumber = nr;
		} else {
			if (!cellMode) {
				selectedNumber = nr;
			}
			noteGrid[selectedCell.x][selectedCell.y][nr - 1] = !noteGrid[selectedCell.x][selectedCell.y][nr - 1];
			grid[selectedCell.x][selectedCell.y] = null;
		}
	} else if (keyCode == 46 || keyCode == 48 || keyCode == 96 || keyCode == 8) {
		//0 eller del är ta bort
		selectedNumber = null;
		grid[selectedCell.x][selectedCell.y] = null;
		clearNote(selectedCell.x, selectedCell.y);
	} else if (keyCode == 32 || keyCode == 13) {
		//Space eller enter
		grid[selectedCell.x][selectedCell.y] = selectedNumber;
	} else {
		console.log('Keycode is: ' + keyCode);
	}
}

function mouseReleased() {
	if (inGameWindow()) {
		let cellX = floor((mouseX - xoffset) / cellSize);
		let cellY = floor((mouseY - yoffset) / cellSize);
		if (cellX == selectedCell.x && cellY == selectedCell.y) {
			if (cellMode) {
				if (!noteMode) {
					grid[cellX][cellY] = selectedNumber;
				} else if (selectedNumber !== null) {
					noteGrid[cellX][cellY][selectedNumber - 1] = selcetedNote;
				}
			}
		}
		selectedCell.x = cellX;
		selectedCell.y = cellY;
	} else if (inNumberSelection()) {
		let cellY = floor((mouseY - yoffset) / cellSize);
		let cellX = floor((mouseX - xoffset - cellSize * 10) / cellSize);

		selectedNumber = 1 + cellX + 3 * cellY;
	} else if (inSettings) {
		let cellX = floor((mouseX - xoffset - cellSize * 10) / cellSize);
		let cellY = floor((mouseY - yoffset) / cellSize);
		if (cellX == 0) {
			noteMode = !noteMode;
		} else if (cellX == 1) {
			cellMode = !cellMode;
		} else if (cellX == 2) {
			selectedNumber = null;
		}
	}
}

function mousePressed() {
	if (inRange(mouseX, xoffset, gameWidth + xoffset - 1)) {
		if (inRange(mouseY, yoffset, gameWidth + yoffset - 1)) {
			let cellX = floor((mouseX - xoffset) / cellSize);
			let cellY = floor((mouseY - yoffset) / cellSize);
			selectedNote = !noteGrid[cellX][cellY][selectedNumber - 1];
		}
	}
}

function mouseWheel(e) {
	let idx = selectedNumber;
	if (e.delta > 0) {
		idx++;
	} else {
		idx--;
	}
	if (idx > 9) {
		idx = 1;
	} else if (idx < 1) {
		idx = 9;
	}
	selectedNumber = idx;
}

function clearNote(cellX, cellY) {
	for (let i = 0; i < 9; i++) {
		noteGrid[cellX][cellY][i] = false;
	}
}

function inRange(val, min, max) {
	return val >= min ? (val <= max ? true : false) : false;
}

function inGameWindow() {
	if (inRange(mouseX, xoffset, gameWidth + xoffset - 1)) {
		if (inRange(mouseY, yoffset, gameWidth + yoffset - 1)) {
			return true;
		}
	}
	return false;
}

function inNumberSelection() {
	if (inRange(mouseX, xoffset + 10 * cellSize, xoffset + 13 * cellSize)) {
		if (inRange(mouseY, yoffset, yoffset + 3 * cellSize)) {
			return true;
		}
	}
	return false;
}

function drawHighlight(cellX, cellY) {
	fill(190, 190, 196, 120);
	noStroke();
	for (let i = 0; i < 9; i++) {
		if (i !== cellX) {
			rect(xoffset + i * cellSize, yoffset + cellY * cellSize, cellSize, cellSize);
		}
		if (i !== cellY) {
			rect(xoffset + cellX * cellSize, yoffset + i * cellSize, cellSize, cellSize);
		}
		let x = 3 * floor(cellX / 3) + i % 3;
		let y = 3 * floor(cellY / 3) + floor(i / 3);
		if (x !== cellX && y !== cellY) {
			rect(xoffset + x * cellSize, yoffset + y * cellSize, cellSize, cellSize);
		}
	}
}

function inSettings() {
	if (inRange(mouseX, xoffset + 10 * cellSize, xoffset + 13 * cellSize)) {
		if (inRange(mouseY, yoffset + 4 * cellSize, yoffset + 5 * cellSize)) {
			return true;
		}
	}
	return false;
}
