const {
  Engine, Mouse, MouseConstraint, World, Events, Body
}
= Matter;
let engine, world, bird, redImg, ground, boxes = [], boxImg, boxImg2,
  chuckImg, slingshot, slingshotImg, pigImgLife3, pigImgLife2, pigImgLife1,
  pigs, pigImg, backgroundImg, puntajeImg, puntajeLabel, clearButton, mConstraint, mouse, canvas;

let puntajeCount = 0;


function preload() {
  
  backgroundImg = loadImage('./assets/volcano.png');

  redImg1 = loadImage('./assets/red.png');
  redImg2 = loadImage('./assets/red2.png');
  redImg3 = loadImage('./assets/red3.png');
  redImg = [redImg1, redImg2, redImg3];

  chuckImg1 = loadImage('./assets/chuck.png');
  chuckImg2 = loadImage('./assets/chuck2.png');
  chuckImg3 = loadImage('./assets/chuck3.png');
  chuckImg = [chuckImg1, chuckImg2, chuckImg3];


  boxImg = loadImage('box.png');
  boxImg2 = loadImage('stone.jpg');

  slingshotImg = loadImage('./assets/slingshot.png');
  pigImgLife3 = loadImage('./assets/piglife3.png');
  pigImgLife2 = loadImage('./assets/piglife2.png');
  pigImgLife1 = loadImage('./assets/piglife1.png');
  pigImg=[pigImgLife3, pigImgLife2, pigImgLife1];

  puntajeImg = loadImage('./assets/puntaje.png');
}

function setup() {
  canvas = createCanvas(1100, 480);
  noStroke();

  init();
  puntajeLabel = createP('Puntaje: ' + puntajeCount);
  puntajeLabel.position(10, height);
  instructionLabel = createP('Presiona espacio para recargar');
  instructionLabel.position(10, height + 60);
   
  clearButton = createButton('Restart');
  clearButton.position(10, height + 50);
  clearButton.mousePressed(init);


    // Agregar evento para detectar colisión entre el bird y el pig

}
function mouseReleased() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    if (slingshot.hasBird()) {
      bird.currentState = 'flying';
    }
  }
}

function draw() {
  image(backgroundImg, 0, 0, 1100, 480);
  Engine.update(engine);
  slingshot.show();
  bird.show();
  //pig.show();
  puntaje();

  ground.show();
  for (const box of boxes) {
    box.show();
  }
  for (const pig of pigs){
    pig.show()
  }
  
  puntajeLabel.html('Puntaje: ' + puntajeCount);
  
  
   win();

}
function keyPressed() {
  if (key === ' ') {
    const image = random(0, 1) < 0.5 ? redImg :chuckImg;
    World.remove(world, bird.body);
    bird = new Bird(150, height -100, image);
    slingshot.attach(bird.body);
  }
}
function init() {
  engine = Engine.create();
  world = engine.world;
  
  mouse = Mouse.create(canvas.elt);
  mouse.pixelRatio = pixelDensity();

  mConstraint = MouseConstraint.create(
    engine, {
  mouse:
    mouse,
    collisionFilter:
    {
    mask:
      2
    }
  }
  );
  World.add(world, mConstraint);
  pigs = []
  boxes = []
  bird = new Bird(150, height -100, redImg);
  slingshot = new SlingShot(bird.body, slingshotImg);

    ground = new Ground(width/2, height-10, width, 20);

  for (let i=0; i<3; i++) {
    const box = new Box(width /2, 50*i, 50, 50, i%2==0 ? boxImg: boxImg2, {
    }, 2);
    boxes.push(box);
  }
  for (let i=0; i<3; i++) {
    const box = new Box(width /2 + 150, 50*i, 50, 50, i%2==1 ? boxImg: boxImg2, {
    }, 2);
    boxes.push(box);
  }
  for (let i=0; i<3; i++) {
    const box = new Box(width /2 + 150*2, 50*i, 50, 50, i%2==0 ? boxImg: boxImg2, {
    }, 2);
    boxes.push(box);
  }
  for (let i=0; i<3; i++) {
    const box = new Box(width /2 + 150*3, 50*i, 50, 50, i%2==1 ? boxImg: boxImg2, {
    }, 2);
    boxes.push(box);
  }
  pig1 = new Pig(width/2 - 75, height -50, pigImg)
  pig2 = new Pig(width/2 + 75, height -50, pigImg)
  pig3 = new Pig(width/2 + 75*3, height -50, pigImg)
  pig4 = new Pig(width/2 + 75*5, height -50, pigImg)
  pigs = [pig1, pig2, pig3, pig4];
  
  Events.on(engine, "afterUpdate",
    () => slingshot.fly(mConstraint))
    
        Events.on(engine, 'collisionStart', function(event) {
    let pairs = event.pairs;
    for (let i = 0; i < pairs.length; i++) {
      let pair = pairs[i];
     for (let i = 0; i < pigs.length; i++) {
      if ((pair.bodyA === bird.body && pair.bodyB === pigs[i].body) ||
        (pair.bodyA === pigs[i].body && pair.bodyB === bird.body)) {
        bird.markForRemoval();
        pigs[i].reduceLife();
        bird.currentState = 'collided';
        //pig.markForRemoval();
      }
     }
      if ((pair.bodyA === bird.body && pair.bodyB === ground.body) ||
        (pair.bodyA === ground.body && pair.bodyB === bird.body)) {
        if (bird.currentState !== 'slingshot') {
          bird.markForRemoval();
          bird.currentState = 'collided'
        }

        // Resto del código de colisión con el suelo...
      }
      for (let j = 0; j < boxes.length; j++) {
        if ((pair.bodyA === bird.body && pair.bodyB === boxes[j].body) ||
          (pair.bodyA === boxes[j].body && pair.bodyB === bird.body)) {
          bird.markForRemoval();
          boxes[j].reduceLife();
          bird.currentState = 'collided';
          // Resto del código de colisión con la caja (box)...
          break; // Terminar el bucle, ya que se encontró la colisión con la caja
        }
      }
      for (let j = 0; j < boxes.length; j++) {
        for (let i = 0; i < pigs.length; i++) {
        if ((pair.bodyA === pigs[i].body && pair.bodyB === boxes[j].body) ||
          (pair.bodyA === boxes[j].body && pair.bodyB === pigs[i].body)) {
          //pig.markForRemoval();
          boxes[j].reduceLife();
          pigs[i].reduceLife();
          // Resto del código de colisión con la caja (box)...
          break; // Terminar el bucle, ya que se encontró la colisión con la caja
        }
        }
      }
    }
  }
  );
}

function win(){
  if (puntajeCount >= pigs.length * 5000) {
    // Reiniciar el juego
    puntajeLabel.html('Puntaje: ' + puntajeCount + '  Ganaste!!! Renicia el Juego');
    //init();
  }
}

function puntaje() {
  puntajeCount = pigs.filter(pig => pig.shouldRemove === true).length * 5000;
  
  for(const pig of pigs){
  if (pig.lives === 0) {


    if (pig.puntajeInfo.x === 0 && pig.puntajeInfo.y === 0) {
      pig.puntajeInfo.x = pig.body.position.x - 40;
      pig.puntajeInfo.y = pig.body.position.y - 80;
    }
    // Si la nueva posición de puntajeInfo es menor que la actual, actualiza la posición y la opacidad
    push();
    // Dibuja la imagen de puntaje
    tint(255, pig.puntajeInfo.opacity);
    image(puntajeImg, pig.puntajeInfo.x, pig.puntajeInfo.y);
    pop();
    // Ajusta gradualmente la opacidad y el desplazamiento hacia arriba
    pig.puntajeInfo.y -= 1; // Modifica la velocidad de desplazamiento cambiando este valor
    pig.puntajeInfo.opacity -= 2; // Modifica la velocidad de difuminado cambiando este valor

    // Restringe el rango de valores para evitar problemas al desvanecerse completamente
    pig.puntajeInfo.y = constrain(pig.puntajeInfo.y, -height, height); // Límite superior e inferior del desplazamiento
    pig.puntajeInfo.opacity = constrain(pig.puntajeInfo.opacity, 0, 255);
  }
  }
}
