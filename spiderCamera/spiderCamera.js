let city = [];
let cols = 10;
let rows = 10;
let spacing = 80;
//let camera;
let detail = 20;
let controlPoints = [];
let currentPoint = 0;
let lerping = false;
let lerpAmount = 0.01;
let points = [];
let camPath = 0;
let interpolatedPoints = [];
let camIdx = 0;
let easing = 0.9;
let cam;

function setup() {
  createCanvas(800, 800, WEBGL);
  for (let x = 0; x < cols; x++) {
    for (let z = 0; z < rows; z++) {
      let w = random(-20, -40); // Ancho aleatorio
      let h = random(-50, -300); // Altura aleatoria
      let d = random(-20, -40); // Profundidad aleatoria
      let yPos = h / 2; // Ajustar la posición y según la mitad de la altura

      let xPos = x * spacing - width / 2 + w / 2;
      let zPos = z * spacing - height / 2 + d / 2;

      let r = random(150, 255); // Rojo en tonos pastel
      let g = random(150, 255); // Verde en tonos pastel
      let b = random(150, 255); // Azul en tonos pastel

      city.push(new Box(xPos, yPos, zPos, w, h, d, r, g, b));
      
      let controlX = xPos + 40;
      let controlY = yPos ;
      let controlZ = zPos + 40;
      controlPoints.push(createVector(controlX, controlY, controlZ));
    }
  }
  reOrganize();
  calculateCatmullRom();
  
    cam = createVector(interpolatedPoints[0].x, interpolatedPoints[0].y, interpolatedPoints[0].z);
    lookAtPoint = createVector(interpolatedPoints[1].x, interpolatedPoints[1].y, interpolatedPoints[1].z);

        for (let i = 0; i < 11; i++){
        console.log(`${points[i].x},${points[i].y},${points[i].z}`);
      }
}

function draw() {
  background(220);
  orbitControl(); // Control de la cámara

  for (let b of city) {
    b.display();
  }
  
  for (let p of controlPoints) {
    push();
    translate(p.x, p.y, p.z);
    fill(255, 0, 0); // Color rojo para los puntos de control
    noStroke();
    sphere(5); // Dibuja esferas en los puntos de control
    pop();
  }
  push();
    translate(controlPoints[9].x, controlPoints[9].y, controlPoints[9].z);
    fill(0, 255, 0); // Color rojo para los puntos de control
    noStroke();
    sphere(5); // Dibuja esferas en los puntos de control
  pop();
    push();
    translate(controlPoints[19].x, controlPoints[19].y, controlPoints[19].z);
    fill(0, 255, 0); // Color rojo para los puntos de control
    noStroke();
    sphere(5); // Dibuja esferas en los puntos de control
  pop();
    push();
    translate(controlPoints[controlPoints.length -1].x, controlPoints[controlPoints.length -1].y, controlPoints[controlPoints.length -1].z);
    fill(0, 255, 0); // Color rojo para los puntos de control
    noStroke();
    sphere(5); // Dibuja esferas en los puntos de control
  pop();
  

  for (let p of interpolatedPoints) {
    push();
    translate(p.x, p.y, p.z);
    fill(0, 0, 255); // Color rojo para los puntos de control
    noStroke();
    sphere(2); // Dibuja esferas en los puntos de control
    pop();
  }
    if (camIdx < interpolatedPoints.length - 1) {
    let target = interpolatedPoints[camIdx];
        let nextTarget = interpolatedPoints[camIdx + 1];
    let lerped = p5.Vector.lerp(cam, createVector(target.x, target.y, target.z), easing);
    cam.set(lerped.x, lerped.y, lerped.z);
    let forward = p5.Vector.sub(nextTarget, target).normalize();
    lookAtPoint.set(cam.x + forward.x, cam.y + forward.y, cam.z + forward.z);


    let d = p5.Vector.dist(cam, target);
    if (d < 0.1) {
      camIdx++;
    }
  }

  // Actualizar la vista de la cámara
  camera(cam.x, cam.y, cam.z, lookAtPoint.x, lookAtPoint.y, lookAtPoint.z, 0, 1, 0);

}


class Box {
  constructor(x, y, z, w, h, d, r, g, b) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    this.h = h;
    this.d = d;
    this.r = r;
    this.g = g;
    this.b = b;
  }

  display() {
    push();
    strokeWeight(0.4);
    translate(this.x, this.y, this.z);
    fill(this.r, this.g, this.b); // Color basado en valores r, g, b
    box(this.w, this.h, this.d);
    pop();
  }
}

function reOrganize() {
  for (let i = 0; i < 100; i++) {
    if(i>9 && i<20){
      let j = 20 - (i%10) -1
      points.push(controlPoints[j])
      continue;
    }
    if(i>29 && i<40){
      let j = 40 - (i%10) -1
      points.push(controlPoints[j])
      continue;
    }
    if(i>49 && i<60){
      let j = 60 - (i%10) -1
      points.push(controlPoints[j])
      continue;
    }
    if(i>69 && i<80){
      let j = 80 - (i%10) -1
      points.push(controlPoints[j])
      continue;
    }
    if(i>89 && i<100){
      let j = 100 - (i%10) -1
      points.push(controlPoints[j])
      continue;
    }
    points.push(controlPoints[i])
  }
}

function calculateCatmullRom() {
  interpolatedPoints = [];
  for (let i = 0; i < points.length - 1; i++) {
    for (let j = 0; j < detail; j++) {
    let t = j / detail;

    let  p0 = i === 0 ? points[i] : points[i - 1];
    let  p1 = points[i];
    let  p2 = points[i + 1];
    let  p3 = (i + 2 >= points.length) ? points[i + 1] : points[i + 2];

      let x = 0.5 * (
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t * t * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t * t +
        (-p0.x + p2.x) * t +
        2 * p1.x
      );

      let y = 0.5 * (
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t * t * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t * t +
        (-p0.y + p2.y) * t +
        2 * p1.y
      );

      let z = 0.5 * (
        (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * t * t * t +
        (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * t * t +
        (-p0.z + p2.z) * t +
        2 * p1.z
      );
      interpolatedPoints.push(createVector(x, y, z));
    }
  }
}
