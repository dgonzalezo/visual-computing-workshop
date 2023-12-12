let grid;
let nextGrid;
let cols, rows;
let da = 1.5;
let db = 0.5;
let feed = 0.055;
let kill = 0.062;
let dt = 1;
let myModel;

function preload(){
  myModel = loadModel('zebra.obj', true)  
}

function setup() {
  createCanvas(800, 600, WEBGL);

  cols = 100;
  rows = 100;

  grid = new Array(cols).fill(null).map(() => new Array(rows).fill(0));
  nextGrid = new Array(cols).fill(null).map(() => new Array(rows).fill(0));


  daslider = createSlider(0, 2, 1.3, 0.1);
  daslider.position(850, 20);
  dasliderLabel = createP('Cambia da');
  dasliderLabel.position(850, -10);
  
  dbslider = createSlider(0, 2, 0.5, 0.1);
  dbslider.position(850, 70);
  dbsliderLabel = createP('Cambia db');
  dbsliderLabel.position(850, 40);
  
  feedslider = createSlider(0, 0.5, 0.055, 0.01);
  feedslider.position(850, 120);
  feedsliderLabel = createP('Cambia feed');
  feedsliderLabel.position(850, 90);
  
  killslider = createSlider(0, 0.5, 0.062, 0.01);
  killslider.position(850, 170);
  killsliderLabel = createP('Cambia kill');
  killsliderLabel.position(850, 140);
  
  dtslider = createSlider(0, 2, 1, 0.1);
  dtslider.position(850, 220);
  dtsliderLabel = createP('Cambia dt');
  dtsliderLabel.position(850, 190);
  
}

function draw() {
  da = daslider.value(); 
  db = dbslider.value();
  feed = feedslider.value();
  kill = killslider.value();
  dt = dtslider.value();
  background(255);
  orbitControl()
  reaction();
  [grid, nextGrid] = [nextGrid, grid];

  let img = createTexture(cols, rows);

  strokeWeight(0.2)
  texture(img);
  scale(3);
  rotateX(PI/2);
  rotateZ(3*PI/4);
  model(myModel);
}

function laplaceA(x, y) {
  let sumA = 0;
  sumA += grid[x][y] * -1;
  sumA += grid[x + 1][y] * 0.2;
  sumA += grid[x - 1][y] * 0.2;
  sumA += grid[x][y + 1] * 0.2;
  sumA += grid[x][y - 1] * 0.2;
  sumA += grid[x + 1][y + 1] * 0.05;
  sumA += grid[x - 1][y - 1] * 0.05;
  sumA += grid[x - 1][y + 1] * 0.05;
  sumA += grid[x + 1][y - 1] * 0.05;
  return sumA;
}

function laplaceB(x, y) {
  let sumB = 0;
  sumB += grid[x][y] * -1;
  sumB += grid[x + 1][y] * 0.2;
  sumB += grid[x - 1][y] * 0.2;
  sumB += grid[x][y + 1] * 0.2;
  sumB += grid[x][y - 1] * 0.2;
  sumB += grid[x + 1][y + 1] * 0.05;
  sumB += grid[x - 1][y - 1] * 0.05;
  sumB += grid[x - 1][y + 1] * 0.05;
  sumB += grid[x + 1][y - 1] * 0.05;
  return sumB;
}
function reaction(){
  for (let i = 1; i < cols - 1; i++) {
    for (let j = 1; j < rows - 1; j++) {
      let a = grid[i][j];
      let b = 1 - grid[i][j];

      let laplaceAval = laplaceA(i, j);

      nextGrid[i][j] = a + (da * laplaceAval - a * b * b + feed * (1 - a)) * dt;
      nextGrid[i][j] = constrain(nextGrid[i][j], 0, 1);
    }
  }
}

function createTexture() {
  let img = createImage(cols, rows);
  img.loadPixels();
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let val = floor(grid[i][j] * 255);
      img.set(i, j, color(val, val, val));
    }
  }
  img.updatePixels();
  return img;
}
