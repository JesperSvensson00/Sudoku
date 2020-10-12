/**
 *	Bättre sudd icon
 *  Undo funktion
 * 	Snyggare knappar
 *  Bugg testa
 * 	Snygga upp koden
 * 
 */

var gameWidth = 522;
var cellSize = gameWidth / 9;
var xoffset = cellSize * 1.5;
var yoffset = cellSize * 1.5;
var pointer;

let background_col = [ 248, 248, 255 ];
let digit_col = [ 65, 111, 191 ];
let solid_digit_col = [ 51, 51, 51 ];
let wrong_digit_col = [ 220, 20, 60 ];
let line_col = [ 110, 110, 110 ];
let highlight_col = [ 230, 230, 236 ];
let wrong_highlight_col = [ 247, 207, 214 ];
let same_highlight_col = [ 200, 200, 205 ];
let selected_cell_col = [ 80, 167, 255 ];
let hover_col = [ 110, 177, 255 ];
let selected_info_col = [ 10, 200, 10 ];

//Game
var grid = [];
var selectedNumber = 1;
var prevSelectedNumber = 1;
var selectedNote = true;
var noteMode = false;
var cellMode = false;
var highlightMode = true;
var showWrong = true;
var selectedCell = { x: null, y: null };
var lastCell = { x: null, y: null };
var numberOfNumbers = [];

var gameWon = false;

var difficulty_sel;
var restart_btn;
var newGame_btn;

var phoneMode = true;

var dataLoaded = false;

function setup() {
	frameRate(5);
	pointer = loadImage('/pointer.png', () => {
		dataLoaded = true;
	});
	document.addEventListener('contextmenu', (event) => event.preventDefault());
	for (let x = 0; x < 9; x++) {
		grid[x] = [];
		for (let y = 0; y < 9; y++) {
			grid[x][y] = {
				value: null,
				notes: [ false, false, false, false, false, false, false, false, false ],
				solid: false,
				wrong: false
			};
		}
	}
	var cnv = createCanvas(xoffset * 2 + cellSize * 13, yoffset * 2 + cellSize * 9);
	cnv.parent('sketchHolder');
	textAlign(CENTER, CENTER);

	difficulty_sel = createSelect();
	difficulty_sel.position(xoffset + gameWidth + cellSize, yoffset + cellSize * 8);
	difficulty_sel.size(cellSize * 1.5, cellSize / 2);
	difficulty_sel.option('Easy');
	difficulty_sel.option('Medium');
	difficulty_sel.option('Hard');
	difficulty_sel.option('Very Hard');
	difficulty_sel.option('Insane');
	difficulty_sel.option('Inhuman');
	difficulty_sel.selected('Medium');
	difficulty_sel.parent('sketchHolder');

	newGame_btn = createButton('New Game');
	newGame_btn.mousePressed(restart);
	newGame_btn.position(xoffset + gameWidth + cellSize, yoffset + cellSize * 7);
	newGame_btn.size(cellSize * 1.5, cellSize);
	newGame_btn.parent('sketchHolder');

	restart_btn = createButton('Restart');
	restart_btn.mousePressed(clearGrid);
	restart_btn.position(xoffset + gameWidth + cellSize * 2.5, yoffset + cellSize * 7);
	restart_btn.size(cellSize * 1.5, cellSize);
	restart_btn.parent('sketchHolder');

	restart(true, difficulty_sel.value().toLowerCase());
	windowResized();
}

function sliderResize() {
	updateSize(sliderSize.value() - sliderSize.value() % 9);
}

function updateSize() {
	if (phoneMode) {
		xoffset = 4;
		cellSize = floor((displayWidth - xoffset * 2) / 9);
		xoffset = (displayWidth - cellSize * 9) / 2;
		gameWidth = cellSize * 9;
		yoffset = 5;
		resizeCanvas(xoffset * 2 + gameWidth, yoffset * 2 + cellSize * 14);

		difficulty_sel.position(xoffset + cellSize * 4, yoffset + cellSize * 13);
		difficulty_sel.size(cellSize * 2, cellSize / 2);

		newGame_btn.position(xoffset + cellSize * 4, yoffset + cellSize * 12);
		newGame_btn.size(cellSize * 2, cellSize);

		restart_btn.position(xoffset + cellSize * 7, yoffset + cellSize * 12);
		restart_btn.size(cellSize * 2, cellSize);
		document.getElementById('sketchHolder').style.width = '100%';
		document.getElementById('sketchHolder').style.height = '100%';
		document.getElementById('sketchHolder').style.background = 'rgb(248, 248, 255)';
		document.getElementById('sketchHolder').style.marginTop = 'none';
		document.getElementsByTagName('canvas')[0].style.borderRadius = 'none';
		document.getElementsByTagName('canvas')[0].style.boxShadow = 'none';
		cellMode = true;
	} else {
		let w = floor(windowWidth / 2.2);
		gameWidth = floor(w) - floor(w) % 9;
		cellSize = gameWidth / 9;
		xoffset = cellSize * 1.5;
		yoffset = cellSize * 1.5;
		resizeCanvas(xoffset * 2 + cellSize * 13, yoffset * 2 + cellSize * 9);

		difficulty_sel.position(xoffset + gameWidth + cellSize, yoffset + cellSize * 8);
		difficulty_sel.size(cellSize * 1.5, cellSize / 2);

		newGame_btn.position(xoffset + gameWidth + cellSize, yoffset + cellSize * 7);
		newGame_btn.size(cellSize * 1.5, cellSize);

		restart_btn.position(xoffset + gameWidth + cellSize * 2.5, yoffset + cellSize * 7);
		restart_btn.size(cellSize * 1.5, cellSize);
		document.getElementById('sketchHolder').style.width = width + 'px';
		document.getElementById('sketchHolder').style.height = height + 'px';
		document.getElementById('sketchHolder').style.backgroundColor = 'none';
		document.getElementById('sketchHolder').style.marginTop = '3%';
		document.getElementsByTagName('canvas')[0].style.borderRadius = '10px';
		document.getElementsByTagName('canvas')[0].style.boxShadow = '0px 0px 11px 5px rgba(0,0,0,0.23)';
	}
}

function windowResized() {
	if (windowWidth / windowHeight < 1) {
		console.log('Phone');
		phoneMode = true;
	} else {
		phoneMode = false;
	}
	updateSize();
}

function draw() {
	background(background_col);
	if (gameWon) {
		noFill();
		stroke(line_col);
		strokeWeight(3);
		rect(xoffset, yoffset, gameWidth, gameWidth);
		noStroke();
		fill(line_col);
		textSize(40);
		text('Du klarade det!', xoffset + gameWidth / 2, yoffset - 50);
	} else {
		if (inGameWindow()) {
			let cellX = floor((mouseX - xoffset) / cellSize);
			let cellY = floor((mouseY - yoffset) / cellSize);
			let cell = grid[cellX][cellY];

			if (cellX !== selectedCell.x || cellY !== selectedCell.y) {
				noStroke();
				fill(hover_col);
				rect(cellX * cellSize + xoffset, cellY * cellSize + yoffset, cellSize, cellSize);
			}
			if (mouseIsPressed && !cellMode && !cell.solid) {
				if (!noteMode) {
					if (mouseButton === LEFT) {
						cell.value = selectedNumber;
						lastCell = { x: cellX, y: cellY };
					} else if (mouseButton === CENTER) {
						cell.notes[selectedNumber - 1] = selectedNote;
						cell.value = null;
						lastCell = { x: cellX, y: cellY };
					}
				} else {
					if (mouseButton === LEFT) {
						if (selectedNumber !== null) {
							cell.notes[selectedNumber - 1] = selectedNote;
						} else {
							cell.value = selectedNumber;
						}
						cell.value = null;
						lastCell = { x: cellX, y: cellY };
					} else if (mouseButton === CENTER) {
						cell.value = selectedNumber;
						clearNote(cellX, cellY);
						lastCell = { x: cellX, y: cellY };
					}
				}
				if (mouseButton === RIGHT) {
					cell.value = null;
					clearNote(cellX, cellY);
					lastCell = { x: cellX, y: cellY };
					selectedCell = { x: cellX, y: cellY };
				}
				checkGrid();
			}
		}
		//Ritar den valda rutan
		if (selectedCell.x !== null) {
			//Ritar den valda rutan
			noStroke();
			fill(selected_cell_col);
			rect(selectedCell.x * cellSize + xoffset, selectedCell.y * cellSize + yoffset, cellSize, cellSize);

			//Ritar alla highlightade rutor
			if (highlightMode) {
				drawHighlight(selectedCell.x, selectedCell.y);
			}
		}
		//Ritar alla fel
		if (showWrong) {
			noStroke();
			for (let x = 0; x < 9; x++) {
				for (let y = 0; y < 9; y++) {
					if (grid[x][y].wrong) {
						if (x !== lastCell.x || y !== lastCell.y) {
							fill(wrong_highlight_col);
							rect(xoffset + x * cellSize, yoffset + y * cellSize, cellSize, cellSize);
						}
					} else if (selectedCell.x !== null && grid[x][y].value !== null) {
						if (grid[x][y].value == grid[selectedCell.x][selectedCell.y].value) {
							if (x !== selectedCell.x || y !== selectedCell.y) {
								fill(same_highlight_col);
								rect(xoffset + x * cellSize, yoffset + y * cellSize, cellSize, cellSize);
							}
						}
					}
				}
			}
		}
	}

	drawGrid();
	drawNumbers();
	phoneMode ? drawInfoPhone() : drawInfo();

	//Chages the framerate
	if (!phoneMode) {
		if (inGameWindow() || inNumberSelection() || inSettings()) {
			frameRate(30);
		} else {
			frameRate(5);
		}
	} else {
		frameRate(20);
	}
}

function drawGrid() {
	//Ritar rutnätet
	stroke(line_col);
	strokeWeight(1);
	noFill();
	for (let i = 1; i < 9; i++) {
		if (i % 3 != 0) {
			line(i * cellSize + xoffset, yoffset, i * cellSize + xoffset, yoffset + gameWidth);
			line(xoffset, i * cellSize + yoffset, xoffset + gameWidth, i * cellSize + yoffset);
		}
	}
	strokeWeight(2);
	for (let k = 0; k < 9; k++) {
		rect((k % 3) * cellSize * 3 + xoffset, floor(k / 3) * cellSize * 3 + yoffset, cellSize * 3, cellSize * 3);
	}

	if (!phoneMode) {
		strokeWeight(2);
		rect(xoffset, yoffset, cellSize * 9, cellSize * 9);
	}
}

function drawNumbers() {
	noStroke();

	//Kollar om spelet är av klarat och räknar hur många det är av varje siffra
	let won = true;
	numberOfNumbers = [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
	for (let x = 0; x < 9; x++) {
		for (let y = 0; y < 9; y++) {
			let cell = grid[x][y];
			if (cell.value !== null) {
				numberOfNumbers[cell.value - 1]++;
				textSize(cellSize * 0.6);
				if (!cell.solid) {
					if (cell.wrong && showWrong) {
						fill(wrong_digit_col);
					} else {
						fill(digit_col);
					}
				} else {
					fill(solid_digit_col);
				}
				text(cell.value, x * cellSize + cellSize / 2 + xoffset, y * cellSize + cellSize / 2 + 3 + yoffset);
				if (cell.wrong) {
					won = false;
				}
			} else {
				//Ritar notering siffrorna om det inte finns ett värde
				textSize(cellSize * 0.18);
				fill(line_col);
				for (let k = 0; k < 9; k++) {
					if (grid[x][y].notes[k]) {
						let space = cellSize / 4;
						let small_x = k % 3 + 1;
						let small_y = floor(k / 3) + 1;
						text(k + 1, xoffset + cellSize * x + small_x * space, yoffset + cellSize * y + small_y * space);
					}
				}
				won = false;
			}
		}
	}
	if (won && !gameWon) {
		gameWon = true;
	}
}

function drawInfo() {
	textSize(cellSize * 0.6);
	let startX = xoffset + gameWidth + cellSize;
	let menuY = yoffset + cellSize * 4;

	noStroke();
	fill(highlight_col);
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
	if (showWrong) {
		rect(startX, menuY + cellSize, cellSize, cellSize);
	}
	if (highlightMode) {
		rect(startX + cellSize, menuY + cellSize, cellSize, cellSize);
	}

	//Ritar siffer menyn
	for (let i = 0; i < 9; i++) {
		let x = i % 3;
		let y = floor(i / 3);
		noFill();
		stroke(line_col);
		strokeWeight(2);
		rect(startX + cellSize * x, yoffset + cellSize * y, cellSize, cellSize);
		noStroke();
		fill(line_col);
		text(i + 1, startX + cellSize * x + cellSize / 2, yoffset + cellSize * y + cellSize / 2 + 3);
		textSize(cellSize * 0.22);
		textAlign(RIGHT);
		let number = numberOfNumbers[i] <= 9 ? 9 - numberOfNumbers[i] : 0;
		text(number, startX + cellSize * x + cellSize / 1.1, yoffset + cellSize * y + cellSize / 1.3 + 3);
		textAlign(CENTER);
		textSize(cellSize * 0.6);
	}

	//Meny
	//Ritar ramarna
	noFill();
	stroke(line_col);
	for (let i = 0; i < 6; i++) {
		rect(startX + cellSize * (i % 3), menuY + cellSize * floor(i / 3), cellSize, cellSize);
	}

	fill(wrong_highlight_col);
	stroke(line_col);
	strokeWeight(2);
	rectMode(CENTER);
	rect(startX + cellSize / 2, menuY + 1.5 * cellSize, cellSize * 0.7, cellSize * 0.7);
	rectMode(CORNER);

	fill(wrong_digit_col);
	noStroke();
	textSize(cellSize * 0.6 * 0.7);
	text('1', startX + 0.5 * cellSize, menuY + 1.5 * cellSize + 1); //Show wrong
	textSize(cellSize * 0.6);

	if (dataLoaded) {
		image(pointer, startX + cellSize, menuY, cellSize, cellSize); //Ritar cell icon
	}
	fill(line_col);
	text('🖉', xoffset + gameWidth + 1.5 * cellSize, menuY + cellSize / 2 + 3); //Ritar noterings icon
	text('\uD83D\uDCA1', startX + 1.5 * cellSize, menuY + 1.5 * cellSize + 3); //Ritar sudd icon
	text('\u232B', startX + 2.5 * cellSize, menuY + cellSize / 2 + 3); //Ritar sudd icon
	text('\u27F2', startX + 2.5 * cellSize, menuY + 1.5 * cellSize + 3); //Ångra icon // ⟲ ↺ ⤺
}

function drawInfoPhone() {
	textSize(cellSize * 0.6);
	let startX = xoffset;
	let menuY = yoffset + gameWidth + cellSize * 3;

	noStroke();
	fill(highlight_col);
	if (noteMode) {
		rect(startX, menuY, cellSize, cellSize);
	}
	if (cellMode) {
		rect(startX + cellSize, menuY, cellSize, cellSize);
	}

	if (showWrong) {
		rect(startX, menuY + cellSize, cellSize, cellSize);
	}
	if (highlightMode) {
		rect(startX + cellSize, menuY + cellSize, cellSize, cellSize);
	}

	//Ritar siffer menyn
	if (selectedNumber == null) {
		rect(startX + cellSize * 2, menuY, cellSize, cellSize);
	} else {
		rect(startX + cellSize * (selectedNumber - 1), menuY - cellSize * 2, cellSize, cellSize);
	}

	for (let x = 0; x < 9; x++) {
		let y = menuY - cellSize * 2;
		noFill();
		stroke(line_col);
		rect(startX + cellSize * x, y, cellSize, cellSize);
		noStroke();
		fill(line_col);
		textSize(floor(cellSize * 0.7));
		text(x + 1, startX + cellSize * x + cellSize / 2, y + cellSize / 2 + 1);
		textAlign(RIGHT);
		textSize(cellSize * 0.22);
		let number = numberOfNumbers[x] <= 9 ? 9 - numberOfNumbers[x] : 0;
		text(number, startX + cellSize * x + cellSize / 1.1, y + cellSize / 1.3 + 3);
		textAlign(CENTER);
	}
	textSize(cellSize * 0.6);

	//Ritar ramarna för menyn
	for (let i = 0; i < 6; i++) {
		noFill();
		stroke(line_col);
		rect(startX + cellSize * (i % 3), menuY + cellSize * floor(i / 3), cellSize, cellSize);
		noStroke();
		fill(line_col);
		switch (i) {
			case 0:
				text('🖉', startX + 0.5 * cellSize, menuY + cellSize / 2 + 3); //Ritar noterings icon
				break;
			case 1:
				image(pointer, startX + cellSize, menuY, cellSize, cellSize); //Ritar cell icon
				break;
			case 2:
				text('\u232B', startX + 2.5 * cellSize, menuY + cellSize / 2 + 3); //Ritar sudd icon
				break;
			case 3:
				text('\uD83D\uDCA1', startX + 1.5 * cellSize, menuY + 1.5 * cellSize + 3); //Ritar sudd icon
				break;
			case 4:
				fill(wrong_highlight_col);
				stroke(line_col);
				strokeWeight(2);
				rectMode(CENTER);
				rect(startX + cellSize / 2, menuY + 1.5 * cellSize, cellSize * 0.7, cellSize * 0.7);
				rectMode(CORNER);

				fill(wrong_digit_col);
				noStroke();
				textSize(cellSize * 0.6 * 0.7);
				text('1', startX + 0.5 * cellSize, menuY + 1.5 * cellSize + 1); //Show wrong
				textSize(cellSize * 0.6);
				break;
			case 5:
				text('\u27F2', startX + 2.5 * cellSize, menuY + 1.5 * cellSize + 3); //Ångra icon // ⟲ ↺ ⤺
				break;
		}
	}
}

function drawHighlight(cellX, cellY) {
	noStroke();
	fill(highlight_col);
	for (let i = 0; i < 9; i++) {
		if (i !== cellX) {
			if (!grid[i][cellY].wrong) {
				rect(xoffset + i * cellSize, yoffset + cellY * cellSize, cellSize, cellSize);
			}
		}
		if (i !== cellY) {
			if (!grid[cellX][i].wrong) {
				rect(xoffset + cellX * cellSize, yoffset + i * cellSize, cellSize, cellSize);
			}
		}
		let x = 3 * floor(cellX / 3) + i % 3;
		let y = 3 * floor(cellY / 3) + floor(i / 3);
		if (x !== cellX && y !== cellY) {
			if (!grid[x][y].wrong) {
				rect(xoffset + x * cellSize, yoffset + y * cellSize, cellSize, cellSize);
			}
		}
	}
}

function keyPressed() {
	if (inRange(keyCode, 49, 57) || inRange(keyCode, 97, 105)) {
		let nr = keyCode < 60 ? keyCode - 48 : keyCode - 96;
		if (!noteMode) {
			grid[selectedCell.x][selectedCell.y].value = nr;
			clearNote(selectedCell.x, selectedCell.y);
			selectedNumber = nr;
		} else {
			if (!cellMode) {
				selectedNumber = nr;
			}
			grid[selectedCell.x][selectedCell.y].notes[nr - 1] = !grid[selectedCell.x][selectedCell.y].notes[nr - 1];
			grid[selectedCell.x][selectedCell.y].value = null;
		}
		checkGrid();
	} else if (keyCode == 46 || keyCode == 48 || keyCode == 96 || keyCode == 8) {
		//0 eller del är ta bort
		prevSelectedNumber = selectedNumber;
		selectedNumber = null;
		if (selectedCell.x !== null) {
			grid[selectedCell.x][selectedCell.y].value = null;
			clearNote(selectedCell.x, selectedCell.y);
			checkGrid();
		}
	} else if (keyCode == 32 || keyCode == 13) {
		//Space eller enter
		if (selectedCell.x !== null) {
			grid[selectedCell.x][selectedCell.y].value = selectedNumber;
			checkGrid();
		}
	} else if (keyCode == 78) {
		frameRate(20);
		noteMode = !noteMode;
	} else if (keyCode == 222) {
		phoneMode = !phoneMode;
	} else {
		console.log('Keycode is: ' + keyCode);
	}
}

function touchEnded() {
	if (inGameWindow()) {
		let cellX = floor((mouseX - xoffset) / cellSize);
		let cellY = floor((mouseY - yoffset) / cellSize);
		let cell = grid[cellX][cellY];
		if (cellX == selectedCell.x && cellY == selectedCell.y) {
			if (cellMode) {
				if (!noteMode) {
					if (mouseButton === LEFT) {
						cell.value = selectedNumber;
						lastCell = { x: cellX, y: cellY };
					} else if (mouseButton === CENTER) {
						cell.notes[selectedNumber - 1] = selectedNote;
						cell.value = null;
						lastCell = { x: cellX, y: cellY };
					}
				} else {
					if (mouseButton === LEFT) {
						if (selectedNumber !== null) {
							cell.notes[selectedNumber - 1] = selectedNote;
						} else {
							cell.value = selectedNumber;
						}
						cell.value = null;
						lastCell = { x: cellX, y: cellY };
					} else if (mouseButton === CENTER) {
						cell.value = selectedNumber;
						clearNote(cellX, cellY);
						lastCell = { x: cellX, y: cellY };
					}
				}
				if (mouseButton === RIGHT) {
					cell.value = null;
					clearNote(cellX, cellY);
				}
			}
		}
		lastCell = { x: cellX, y: cellY };
		selectedCell = { x: cellX, y: cellY };
		checkGrid();
	} else if (inNumberSelection()) {
		let cellX = null;
		let cellY = null;
		if (phoneMode) {
			cellX = floor((mouseX - xoffset) / cellSize);
			cellY = 0;
		} else {
			cellX = floor((mouseX - xoffset - cellSize * 10) / cellSize);
			cellY = floor((mouseY - yoffset) / cellSize);
		}

		selectedNumber = 1 + cellX + 3 * cellY;
		if (selectedCell.x !== null) {
			let cell = grid[selectedCell.x][selectedCell.y];
			if (cellMode) {
				cell.value = selectedNumber;
				clearNote(cellX, cellY);
			}
			if (noteMode) {
				cell.notes[selectedNumber] = cell.notes[selectedNumber];
				cell.value = null;
			}
		}
		lastCell = { x: null, y: null };
		checkGrid();
	} else if (inSettings()) {
		let cellX = null;
		let cellY = null;
		if (phoneMode) {
			cellX = floor((mouseX - xoffset) / cellSize);
			cellY = floor((mouseY - yoffset - cellSize * 8) / cellSize) - 4;
		} else {
			cellX = floor((mouseX - xoffset - cellSize * 10) / cellSize);
			cellY = floor((mouseY - yoffset) / cellSize) - 4;
		}
		if (cellY == 0) {
			switch (cellX) {
				case 0:
					noteMode = !noteMode;
					break;
				case 1:
					cellMode = !cellMode;
					break;
				case 2:
					if (selectedNumber === null) {
						selectedNumber = prevSelectedNumber;
					} else {
						prevSelectedNumber = selectedNumber;
						selectedNumber = null;
					}
					break;
			}
		} else if (cellY == 1) {
			switch (cellX) {
				case 0:
					showWrong = !showWrong;
					break;
				case 1:
					highlightMode = !highlightMode;
					break;
				case 2:
					//Undo
					break;
			}
		}

		lastCell = { x: null, y: null };
	} else {
		selectedCell = { x: null, y: null };
		lastCell = { x: null, y: null };
		checkGrid();
	}
}

function touchStarted() {
	if (inGameWindow()) {
		let cellX = floor((mouseX - xoffset) / cellSize);
		let cellY = floor((mouseY - yoffset) / cellSize);
		selectedNote = !grid[cellX][cellY].notes[selectedNumber - 1];
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
	frameRate(20);
}

function clearNote(cellX, cellY) {
	for (let i = 0; i < 9; i++) {
		grid[cellX][cellY].notes[i] = false;
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
	if (phoneMode) {
		if (inRange(mouseX, xoffset, xoffset + 9 * cellSize)) {
			if (inRange(mouseY, yoffset + cellSize * 10, yoffset + 11 * cellSize)) {
				return true;
			}
		}
	} else {
		if (inRange(mouseX, xoffset + 10 * cellSize, xoffset + 13 * cellSize)) {
			if (inRange(mouseY, yoffset, yoffset + 3 * cellSize)) {
				return true;
			}
		}
	}

	return false;
}

function inSettings() {
	if (phoneMode) {
		if (inRange(mouseX, xoffset, xoffset + 3 * cellSize)) {
			if (inRange(mouseY, yoffset + 12 * cellSize, yoffset + 14 * cellSize)) {
				return true;
			}
		}
	} else {
		if (inRange(mouseX, xoffset + 10 * cellSize, xoffset + 13 * cellSize)) {
			if (inRange(mouseY, yoffset + 4 * cellSize, yoffset + 6 * cellSize)) {
				return true;
			}
		}
	}

	return false;
}

function checkGrid() {
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			grid[i][j].wrong = false;
		}
	}
	for (let i = 0; i < 9; i++) {
		let col = getWrongIdx(grid[i]);
		for (let y of col) {
			grid[i][y].wrong = true;
		}
		let row = getWrongIdx(getRowData(i));
		for (let x of row) {
			grid[x][i].wrong = true;
		}
		let group = getWrongIdx(getHouseData(i));
		for (let k of group) {
			let x = (i % 3) * 3 + k % 3;
			let y = floor(i / 3) * 3 + floor(k / 3);
			grid[x][y].wrong = true;
		}
	}
}

function getWrongIdx(arr) {
	let idxArr = [];
	let wrongIdx = {};
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].value !== null) {
			wrongIdx[arr[i].value] = wrongIdx[arr[i].value] || [];
			wrongIdx[arr[i].value].push(i);
		}
	}
	for (var val in wrongIdx) {
		if (wrongIdx[val].length > 1) {
			idxArr = idxArr.concat(wrongIdx[val]);
		}
	}
	return idxArr;
}

function getRowData(y) {
	let arr = [];
	for (let x = 0; x < 9; x++) {
		arr.push(grid[x][y]);
	}
	return arr;
}

function getHouseData(k) {
	let arr = [];
	let gX = k % 3;
	let gY = floor(k / 3);
	for (let h = 0; h < 9; h++) {
		let x = 3 * gX + h % 3;
		let y = 3 * gY + floor(h / 3);
		arr.push(grid[x][y]);
	}
	return arr;
}

function setGrid(arr) {
	for (let i = 0; i < 81; i++) {
		if (arr[i] === undefined || arr[i] === null) {
			grid[i % 9][floor(i / 9)].value = null;
			grid[i % 9][floor(i / 9)].solid = false;
		} else {
			grid[i % 9][floor(i / 9)].value = arr[i];
			grid[i % 9][floor(i / 9)].solid = true;
		}
		grid[i % 9][floor(i / 9)].wrong = false;
		grid[i % 9][floor(i / 9)].notes = [ false, false, false, false, false, false, false, false, false ];
	}
}

function TwoDArrayToOneD(twoDArr) {
	let arr = [];
	for (let i = 0; i < 81; i++) {
		arr.push(twoDArr[i % 9][floor(i / 9)]);
	}
	return arr;
}

function stringToArray(str) {
	let arr = [];
	for (let i = 0; i < 81; i++) {
		if (str[i] == '.') {
			arr.push(null);
		} else {
			arr.push(str[i]);
		}
	}
	return arr;
}

function fusk() {
	let arr = [];
	for (let i = 0; i < 9; i++) {
		arr[i] = [];
		for (let j = 0; j < 9; j++) {
			let y;
			if (i < 3) {
				y = j + i * 3;
			} else if (i < 6) {
				y = j + (i - 3) * 3 + 1;
			} else {
				y = j + (i - 6) * 3 + 2;
			}
			y %= 9;
			arr[i][y] = j + 1;
		}
	}
	return arr;
}

function setFusk() {
	setGrid(TwoDArrayToOneD(fusk()));
}

function clearGrid() {
	gameWon = false;
	selectedCell = { x: null, y: null };
	lastCell = { x: null, y: null };
	selectedNote = true;
	selectedNumber = 1;
	noteMode = false;
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			if (!grid[i][j].solid) {
				grid[i][j].value = null;
				grid[i][j].wrong = false;
				grid[i][j].notes = [ false, false, false, false, false, false, false, false, false ];
			}
		}
	}
	checkGrid();
}

function setEmpty() {
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			grid[i][j] = {
				value: null,
				notes: [ false, false, false, false, false, false, false, false, false ],
				solid: false,
				wrong: false
			};
		}
	}
}

function restart() {
	gameWon = false;
	selectedCell = { x: null, y: null };
	lastCell = { x: null, y: null };
	selectedNote = true;
	selectedNumber = 1;
	noteMode = false;
	setGrid(stringToArray(sudoku.generate(difficulty_sel.value().toLowerCase())));
}
