let phongShader, gouradShader, alpha = 32;

function setup() {
  createCanvas(640, 480, WEBGL);
  phongShader = createShader(vert, frag);
  gouradShader = createShader(vert2, frag2);
  
  noStroke();
}

function draw() {
  background(51); 
  orbitControl();

  createSphere(-150, 0, 0, 100, color(56, 105, 147));
  createSphere2(150, 0, 0, 100, color(56, 105, 147));
  
  describe("Alpha: " + alpha, LABEL);
}

function createSphere(x, y, z, radius, col) {
  push();
  translate(x, y, z);
  
  const lightX = map(mouseX, 0, width, -1.0, 1.0);
  const lightY = map(mouseY, 0, height, -1.0, 1.0);
  
  phongShader.setUniform("uColor", [red(col)/255, green(col)/255, blue(col)/255]);
  phongShader.setUniform("uLightDirection", [lightX, lightY, 1.0]);
  phongShader.setUniform("uAlpha", alpha);
  
  shader(phongShader);
  
  sphere(radius);
  pop();
}
function createSphere2(x, y, z, radius, col) {
  push();
  translate(x, y, z);
  
  const lightX = map(mouseX, 0, width, -1.0, 1.0);
  const lightY = map(mouseY, 0, height, -1.0, 1.0);
  
  gouradShader.setUniform("uColor", [red(col)/255, green(col)/255, blue(col)/255]);
  gouradShader.setUniform("uLightDirection", [lightX, lightY, 1.0]);
  gouradShader.setUniform("uAlpha", alpha);
  
  
  shader(gouradShader);
  
  sphere(radius);
  pop();
}

function keyPressed(){
  if (key === '+'){
    alpha *= 2;
  } else if (key === '-'){
    alpha /= 2;
  }
}

const vert = `
precision mediump float;

attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;
uniform mat3 uNormalMatrix;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vNormal = normalize(uNormalMatrix * aNormal);
  vPosition = (uModelViewMatrix * vec4(aPosition, 1.0)).xyz;
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
}
`;

const frag = `
precision mediump float;

varying vec3 vNormal;
varying vec3 vPosition;

uniform vec3 uColor;
uniform vec3 uLightDirection;
uniform float uAlpha;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 eyeDirection = normalize(-vPosition);
  vec3 lightDirection = normalize(uLightDirection);

  vec3 ambient = vec3(0.2, 0.2, 0.2);
  
  vec3 diffuse = uColor * max(0.0, dot(normal, lightDirection));
  
  vec3 reflectionDirection = reflect(-lightDirection, normal);
  vec3 specular = pow(max(dot(reflectionDirection, eyeDirection), 0.0), uAlpha) 
                  * vec3(1.0, 1.0, 1.0);

  gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
}
`;

const vert2 = `
precision mediump float;

attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;
uniform mat3 uNormalMatrix;

uniform vec3 uLightDirection;
uniform vec3 uColor;
uniform float uAlpha;

varying vec4 vColor;

void main() {
  vec3 normal = normalize(uNormalMatrix * aNormal);
  vec3 lightDirection = normalize(uLightDirection);

  vec3 ambient = vec3(0.2, 0.2, 0.2);
  vec3 diffuse = uColor * max(0.0, dot(normal, lightDirection));
  
  vec3 eyeDirection = normalize(-aPosition);
  vec3 reflectionDirection = reflect(-lightDirection, normal);
  vec3 specular = pow(max(dot(reflectionDirection, eyeDirection), 0.0), uAlpha) 
                  * vec3(1.0, 1.0, 1.0);

  vColor = vec4(ambient + diffuse + specular, 1.0);
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
}
`;

const frag2 = `
precision mediump float;

varying vec4 vColor;

void main() {
  gl_FragColor = vColor;
}
`;
