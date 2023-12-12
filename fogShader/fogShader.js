let shaderTexture;
let noiseseed;
let slider
let fogShader;


function preload(){
  fogShader = new p5.Shader(this._renderer, vert, frag);
  noiseseed = random(100, 200);
  angleMode(DEGREES);
  txtr = loadImage("https://webglfundamentals.org/webgl/resources/f-texture.png");
}

 function setup() {
   createCanvas(windowWidth, windowHeight -50, WEBGL);
   //noStroke();
   perspective(83, width / height);
   img = createImage(1, 200);
   slider = createSlider(0, 120, 40); // Valores mínimo, máximo y valor inicial
   slider.position(10, windowHeight -40)
   let sliderLabel = createDiv('Fog Near'); // Crear un elemento para el nombre
    sliderLabel.position(10, windowHeight -25);
 }

 function draw() {
   orbitControl();
   noStroke();
   background(125, 138, 150);
        
   translate(-150,0,470)
   fill(255);
   shader(fogShader);
    push()
     for(let j = 0; j<20; j++) {
       translate(70, 0, -80);
       push();
       rotateX(frameCount/2)
       rotateY(frameCount/2)
       box(50);
       pop();
     }
    pop()

   if(true) {
     fogShader.setUniform("noiseSeed", noiseseed);
     fogShader.setUniform("points", img);
     fogShader.setUniform("fogNear", parseFloat(slider.value()));
     fogShader.setUniform("uTexture", txtr);
   }
 }
 
const frag = `
precision mediump float;
varying vec2 vTexCoord;
varying vec3 vNormal; 
uniform sampler2D uTexture;
varying vec3 pos;
uniform float noiseSeed;
uniform sampler2D points;
uniform float fogNear;
varying vec4 cameraPos;
varying vec4 Position;


float rand(vec2 n) { 
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * noiseSeed);
}

float noise(vec2 p){
  vec2 ip = floor(p);
  vec2 u = fract(p);
  u = u*u*(3.0-2.0*u);
  
  float res = mix(
    mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
    mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
  return res*res;
}

float layernoise(vec2 p) {
  float t = 0.0;
  t += noise(p*0.6)*0.3;
  t += noise(p)*0.2;
  t += noise(p*3.0)*0.15;
  t += noise(p*5.0)*0.15;
  t += noise(p*8.0)*0.1;
  t += noise(p*12.0)*0.05;
  t += noise(p*28.0)*0.03;
  t += noise(p*41.0)*0.02;
  return t;
}

float dist(vec3 v1, vec3 v2) {
  vec3 offsetv = v2-v1;
  return sqrt((offsetv.x*offsetv.x)+(offsetv.y*offsetv.y)+(offsetv.z*offsetv.z));
}

vec3 tr(vec3 inp) {
  return(inp*1.0);
}

float loopableWorleyNoise(vec3 p) {
  float mindist = 0.0;
  float d;
  for(int i = 0; i <= 199; i++) {
    d = 1.0-(dist(p, tr(texture2D(points, vec2(0.0, float(i)/200.0)).xyz))*3.0);
    if(d>mindist){
      mindist = d;
    }
  }
  return(mindist);
}


void main(){
    vec4 color = texture2D(uTexture, vTexCoord);
    vec4 fogColor = vec4(128.0/255.0, 135.0/255.0, 150.0/255.0, 1.0);
    float fogDistance = length(Position.xyz)/fogNear;
    float Log2 = 1.442695;
    float fogAmount = 1.0-exp2(-0.092 * 0.092 * fogDistance * fogDistance * Log2);
    gl_FragColor = mix(color, fogColor, fogAmount);
}
  `;
  
const vert = `
    // Get the position attribute of the geometry
attribute vec3 aPosition;

// Get the texture coordinate attribute from the geometry
attribute vec2 aTexCoord;

// Get the vertex normal attribute from the geometry
attribute vec3 aNormal;

// When we use 3d geometry, we need to also use some builtin variables that p5 provides
// Most 3d engines will provide these variables for you. They are 4x4 matrices that define
// the camera position / rotation, and the geometry position / rotation / scale
// There are actually 3 matrices, but two of them have already been combined into a single one
// This pre combination is an optimization trick so that the vertex shader doesn't have to do as much work

// uProjectionMatrix is used to convert the 3d world coordinates into screen coordinates 
uniform mat4 uProjectionMatrix;


// uModelViewMatrix is a combination of the model matrix and the view matrix
// The model matrix defines the object position / rotation / scale
// Multiplying uModelMatrix * vec4(aPosition, 1.0) would move the object into it's world position

// The view matrix defines attributes about the camera, such as focal length and camera position
// Multiplying uModelViewMatrix * vec4(aPosition, 1.0) would move the object into its world position in front of the camera
uniform mat4 uModelViewMatrix;

// Get the framecount uniform
uniform float uFrameCount;

varying vec2 vTexCoord;
varying vec3 vNormal;
varying vec3 pos;
varying vec4 cameraPos;
varying vec4 Position;


void main() {

  // copy the position data into a vec4, using 1.0 as the w component
  vec4 positionVec4 = vec4(aPosition, 1.0);
  

  // Send the normal to the fragment shader
  vNormal = aNormal;


  pos = positionVec4.xyz+0.5;
  cameraPos = uModelViewMatrix * vec4(aPosition, 1.0);

  // Move our vertex positions into screen space
  // The order of multiplication is always projection * view * model * position
  // In this case model and view have been combined so we just do projection * modelView * position
  gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
  Position = gl_Position;

  // Send the texture coordinates to the fragment shader
  vTexCoord = aTexCoord;
}
  `;
