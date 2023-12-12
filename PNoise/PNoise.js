let cols, rows;
let flying = 0;
let terrain = [];
let colours = {};
let canvasSun,canvasSky;

function setup() {
  createCanvas(600, 600, WEBGL);
  
  cols = 63;
  rows = 54;
  
  // Inicializar el arreglo del terreno
  for (let i = 0; i < rows; i++) {
    terrain[i] = [];
  }
  
  colours = [
    color(8, 44, 127), // Night blue
    color(0, 255, 248), // Neon blue
    color(255, 0, 253), // Neon pink
    color(0, 29, 95), // Dark blue
    color(224,231,34)
  ];
    canvasSky = drawSky();
    canvasSun = drawSun();
}

function draw() {
  background(220);
  orbitControl();
  push()
    // Output sun
  translate(0, -200, -2000);
  texture(canvasSky);
  plane(3400, 2600);

  fill(0, 0, 0, 0);
  texture(canvasSun);
  plane(1500);
  fill(0, 0, 0, 0);
  texture(canvasSun);
  plane(1500);
  pop()
  push()
  translate(0, 200, 0);
  

  
  flying -= 0.02;
  let yoff = flying;
  
  for (let y = 0; y < cols; y++) {
    let xoff = 0;
    for (let x = 0; x < rows; x++) {
      // Aplicar ruido de Perlin a puntos en una esfera
      let theta = map(x, 0, rows - 1, 0, PI);
      let phi = map(y, 0, cols - 1, 0, TWO_PI);
      let radius = 250;
      
      let noiseVal = noise(xoff, yoff);
      let altitude = map(noiseVal, 0, 1, -50, 100);
      
      let xCoord = radius * cos(theta);
      let yCoord = radius * sin(theta) * cos(phi) + (altitude * 1.5);
      let zCoord = radius * sin(theta) * sin(phi) + (altitude );
      
      terrain[x][y] = createVector(xCoord, yCoord, zCoord);
      
      xoff -= 0.1;
    }
    yoff -= 0.1;
  }
  

  fill(colours[3]);
  stroke(colours[1]);

  for (let y = 0; y < cols - 1; y++) {
    beginShape(TRIANGLE_STRIP);
    for (let x = 0; x < rows; x++) {
      let v1 = terrain[x][y];
      let v2 = terrain[x][y + 1];

      vertex(v1.x, v1.y, v1.z);
      vertex(v2.x, v2.y, v2.z);
    }
    endShape();
  }
  pop()
}

// Draw sun
function drawSky() {
  const horizon = 1000;
  const sky = createGraphics(width, height);

  // Draw gradient sky
  sky.noFill();
  for (let i = 0; i <= horizon; i++) {
    const inter = map(i, 0, horizon, 0, 1);
    const c = lerpColor(colours[0], color(0, 0 ,0), inter);
    sky.stroke(c);
    sky.line(0, i, width, i);
  }

  // Add some stars
  sky.noStroke();
  sky.fill(255, 255, 255, random(100, 255));
  for (let i = 0; i < 100; i++) {
    sky.ellipse(random(0, 1100), random(0, 550), random(1, 5));
  }

  return sky;
}


// Draw gradient sun
function drawSun() {
  const sun = createGraphics(500, 500);
  sun.noFill();

  for (let i = 0; i <= sun.height; i++) {
    // Which colour?
    if (i % 10 >= 0 && i % 10 < 5) {
      sun.stroke(colours[2]);
    } else {
      sun.stroke(colours[3]);
    }

    // Calc colour
    const inter = map(i, 0, sun.height, 0, 1);

    // Calc circle
    const s = i * 2;
    const r = sun.width;
    const lineWidth = Math.sqrt((2 * s * r) - (s * s));
    const offset = (sun.width / 2) - (lineWidth / 2);
    sun.line(offset, i, lineWidth + offset, i);
  }
  return sun;
}
