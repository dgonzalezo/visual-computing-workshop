
let len;
let angle;
let sentence;
let lineWeight;
let generations, axiom;


let rules;

function generate(axiom, generations) {
  let result = axiom;
  for (let i = 0; i < generations; i++) {
    let nextResult = "";
    for (let j = 0; j < result.length; j++) {
      let current = result.charAt(j);
      if (rules[current]) {
        nextResult += rules[current];
      } else {
        nextResult += current;
      }
    }
    result = nextResult;
  }
  return result;
}
function turtle() {
  translate(0, height/2 -100, 0);
  rotateX(-90)
    let weight = lineWeight
    let lenLine = len
    for (let i = 0; i < sentence.length; i++) {
    let current = sentence.charAt(i);

    if (current === "F") {
      strokeWeight(map(lenLine, 10, 100, 0.5, 5))
        //stroke(random(0,255),random(0,255),random(0,255));
        stroke(0, 0, 0)
        //strokeWeight(weight)
        line(0, 0, 0, 0, 0, -lenLine);
      translate(0, 0, -lenLine);
    } else if (current === "\\") {
      rotateZ(angle);
    } else if (current === "/") {
      rotateZ(-angle);
    } else if (current === "&") {
      //console.log("rotateY")
      rotateY(angle);
    } else if (current === "^") {
      rotateY(-angle);
    } else if (current === "+") {
      rotateX(-angle);
    } else if (current === "-") {
      rotateX(angle);
    } else if (current === "[") {
      push();
    } else if (current === "]") {
      pop();
    } else if (current === "!") {
      weight = weight*0.7
    } else if (current === "*") {
      lenLine = lenLine * 0.9
    } else if (current === "H" ) {
      push()
      rotateY(45)
      translate(10,0,0)
        let r = 80 + random(-20, 20)
        let g = 120 + random(-20, 20)
        let b = 40 + random(-20, 20)
        fill(r, g, b, 200)
        noStroke();
      beginShape();
      for (let i=45; i<135; i++) {
        let rad = 20
          let x = rad * cos(i);
        let y = rad * sin(-i) + 15;
        vertex(x, y)
      }
      endShape();
      beginShape();
      for (let i=45; i<135; i++) {
        let rad = 20
          let x = rad * cos(-i);
        let y = rad * sin(i)- 15;
        vertex(x, y)
      }
      endShape();
      pop()
    }
    else if(current === "R" ){
      push()
      noStroke()
      fill(190, 37, 77, 200)
      sphere(5)
      pop()
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);
  three1();
}

function draw() {
  background(200);
  rotateY(frameCount)
  randomSeed(1);
  rotateY(90);
  turtle();
  orbitControl();
}

function keyPressed() {
  if (key === "1") {
    three1();
  }
  if (key === "2") {
    three2();
  }
  if (key === "3") {
    three3();
  }
}

function three1() {

  rules = {
    //"F": "FF*",
  "X":
  "F&[[X]/X]/F[/*FX]&X/F[/*FX]&X",
  "Y":
  "F[&Y][-Y][^Y]+F[-F][+F]",
    //"F": "FF[+F][-F][&F][^F]",
    //"F": "FF++F++F+F++F-F",
  "R":
  "[&&&&L][//////&&&&L][///&&&&L][\\\&&&&L]",
  "A":
  "[B]////[B]////[B]",
  "B":
  "&FFFA[///&&&&H][\\\\\\&&&&H][//////&&&&H]"
}
len = 30;
angle=28;
sentence = "";
lineWeight = 5;
axiom = "FFFA";
generations = 8;
sentence = generate(axiom, generations);
}

function three2() {
  rules = {
  "A":
  "[B]////[B]////[B]",
  "B":
  "&FFFA[///&&&&HR][\\\\\\&&&&H][//////&&&&H]"
}
len = 30;
angle=28;
sentence = "";
lineWeight = 5;
axiom = "FFFA";
generations = 8;
sentence = generate(axiom, generations);
}

function three3() {
  rules = {
      "A": "X+[A+]−−////[−−H]X[++H]−[A]++AR",
      "X": "FY[//&&H]FY",
      "Y": "YFY",
    }
    len = 10;
  angle=18;
  sentence = "";
  lineWeight = 5;
  axiom = "A";
  generations = 5;
  sentence = generate(axiom, generations);
}
