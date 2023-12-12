let w;
let columns;
let rows;
let board;
let next;
let slider;
let sliderLabel;
let startButton;
let isRunning = false;

function setup() {
  createCanvas(720, 400);
  w = 20;
  columns = floor(width / w);
  rows = floor(height / w);
  board = new Array(columns);

  for (let i = 0; i < columns; i++) {
    board[i] = new Array(rows);
  }
  next = new Array(columns);

  for (i = 0; i < columns; i++) {
    next[i] = new Array(rows);
  }
  sliderLabel = createP('Ajusta la velocidad:');
  sliderLabel.position(10, height + 10);
  slider = createSlider(1, 60, 30);
  slider.position(10, height + 50);
  slider.style('width', '200px');


  startButton = createButton('Start');
  startButton.position(10, height + 80);
  startButton.mousePressed(startGame);

  clearButton = createButton('Clear');
  clearButton.position(80, height + 80);
  clearButton.mousePressed(clearBoard);


  clearButton = createButton('Restart');
  clearButton.position(80 + 70, height + 80);
  clearButton.mousePressed(init);
  init();
}

function draw() {
  let fps = slider.value();
  frameRate(fps);
  background(255);

  if (isRunning) {
    generate();
  }
  for ( let i = 0; i < columns;i++) {
    for ( let j = 0; j < rows;j++) {
      if ((board[i][j] == 1)) fill(0);
      else fill(255);
      stroke(0);
      rect(i * w, j * w, w - 1, w - 1);
    }
  }

}

// se puede cambiar el estado de las celdas haciendo click
function mousePressed() {
  let i = floor(mouseX / w);
  let j = floor(mouseY / w);
  
  if (i > 0 && i < columns - 1 && j > 0 && j < rows - 1) {
    if (board[i][j] == 1) board[i][j] = 0;
    else
    board[i][j] = 1;
  }
}
// cargar patrones
function keyPressed() {
  if (key === '1') {
    clearBoard(); 
    board[18][10] = 1;
    board[18][9] = 1;
    board[18][8] = 1;
    board[17][9] = 1;
    board[19][9] = 1;
  }

  if (key === '2') {
    clearBoard(); 
    board[15][5] = 1;
    board[15][6] = 1;
    board[15][7] = 1;
    board[15][11] = 1;
    board[15][12] = 1;
    board[15][13] = 1;
    board[17][3] = 1;
    board[17][8] = 1;
    board[17][10] = 1;
    board[17][15] = 1;
    board[18][3] = 1;
    board[18][8] = 1;
    board[18][10] = 1;
    board[18][15] = 1;
    board[19][3] = 1;
    board[19][8] = 1;
    board[19][10] = 1;
    board[19][15] = 1;
    board[20][5] = 1;
    board[20][6] = 1;
    board[20][7] = 1;
    board[20][11] = 1;
    board[20][12] = 1;
    board[20][13] = 1;
    board[22][5] = 1;
    board[22][6] = 1;
    board[22][7] = 1;
    board[22][11] = 1;
    board[22][12] = 1;
    board[22][13] = 1;
  }
  
  if (key === '3') {
    clearBoard(); 
    board[16][8] = 1;
    board[16][9] = 1;
    board[17][8] = 1;
    board[18][11] = 1;
    board[19][10] = 1;
    board[19][11] = 1;

  }

  if (key === '4') {
    clearBoard(); 
    board[16][8] = 1;
    board[16][9] = 1;
    board[16][12] = 1;
    board[16][13] = 1;
    board[17][7] = 1;
    board[17][13] = 1;
    board[18][8] = 1;
    board[18][9] = 1;
    board[18][10] = 1;
    board[18][11] = 1;
    board[18][12] = 1;

  }

  if (key === '5') {
    clearBoard();
    board[12][6] = 1;
    board[12][7] = 1;
    board[12][8] = 1;
    board[12][12] = 1;
    board[12][13] = 1;
    board[12][14] = 1;
    board[14][4] = 1;
    board[14][9] = 1;
    board[14][11] = 1;
    board[14][16] = 1;
    board[15][4] = 1;
    board[15][9] = 1;
    board[15][11] = 1;
    board[15][16] = 1;
    board[16][4] = 1;
    board[16][9] = 1;
    board[16][11] = 1;
    board[16][16] = 1;
    board[17][6] = 1;
    board[17][7] = 1;
    board[17][8] = 1;
    board[17][12] = 1;
    board[17][13] = 1;
    board[17][14] = 1;
    board[19][6] = 1;
    board[19][7] = 1;
    board[19][8] = 1;
    board[19][12] = 1;
    board[19][13] = 1;
    board[19][14] = 1;
    board[20][4] = 1;
    board[20][9] = 1;
    board[20][11] = 1;
    board[20][16] = 1;
    board[21][4] = 1;
    board[21][9] = 1;
    board[21][11] = 1;
    board[21][16] = 1;
    board[22][4] = 1;
    board[22][9] = 1;
    board[22][11] = 1;
    board[22][16] = 1;
    board[24][6] = 1;
    board[24][7] = 1;
    board[24][8] = 1;
    board[24][12] = 1;
    board[24][13] = 1;
    board[24][14] = 1;
  }
}

function init() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      board[i][j] = 0;
      next[i][j] = 0;
    }
  }
  board[18][10] = 1;
  board[18][9] = 1;
  board[18][8] = 1;
  board[19][8] = 1;
  board[17][9] = 1;
}

function clearBoard() {
  isRunning = false;
  startButton.html('Start'); 

  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      board[i][j] = 0;
      next[i][j] = 0;
    }
  }
}

function generate() {

  for (let x = 1; x < columns - 1; x++) {
    for (let y = 1; y < rows - 1; y++) {

      let neighbors = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          neighbors += board[x+i][y+j];
        }
      }

      neighbors -= board[x][y];

      if      ((board[x][y] == 1) && (neighbors <  2)) next[x][y] = 0;           
      else if ((board[x][y] == 1) && (neighbors >  3)) next[x][y] = 0;           
      else if ((board[x][y] == 0) && (neighbors == 3)) next[x][y] = 1;           
      else                                             next[x][y] = board[x][y];
    }
  }

  let temp = board;
  board = next;
  next = temp;
}

function startGame() {
  isRunning = !isRunning;

  if (isRunning) {
    startButton.html('Stop'); 
  } else {
    startButton.html('Start'); 
  }
}
