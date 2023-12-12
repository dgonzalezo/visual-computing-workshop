class Bird {
  constructor(x, y, img, r = 25) {
    this.body = Matter.Bodies.circle(
      x, y, r, {
    restitution:
      0.5,
      collisionFilter:
      {
      category:
        2
      }
    }
    );
    Matter.World.add(world, this.body);
    Matter.Body.set(this.body, 10);
    this.img = img;
    this.shouldRemove = false;
    this.collisionTime = 0;
    this.RemovalTime = 0;
    this.Duration = 3000;
    this.currentState = 'slingshot';
  }

  show() {
    if (!this.shouldRemove) {
      push();
      translate(this.body.position.x, this.body.position.y);
      rotate(this.body.angle);
      imageMode(CENTER);

      if (this.currentState === 'slingshot') {
        image(this.img[0], 0, 0, this.body.circleRadius * 2, this.body.circleRadius * 2);
      } else if (this.currentState === 'flying') {
        image(this.img[1], 0, 0, this.body.circleRadius * 2, this.body.circleRadius * 2);
      } else if (this.currentState === 'collided') {
        image(this.img[2], 0, 0, this.body.circleRadius * 2, this.body.circleRadius * 2);
      }
      //image(this.img, 0, 0, this.body.circleRadius * 2, this.body.circleRadius * 2);
      pop();
    } else {
      const currentTime = millis();
      if (currentTime >= this.RemovalTime) {
        World.remove(world, this.body);
      } else {
        push();
        translate(this.body.position.x, this.body.position.y);
        rotate(this.body.angle);
        // Opcional: Podrías mostrar una imagen diferente, un efecto de desvanecimiento, etc.
        // Por ejemplo, podrías cambiar la opacidad para simular que desaparece gradualmente
        tint(255, map(currentTime, this.collisionTime, this.RemovalTime, 255, 0));
        imageMode(CENTER);
        if (this.currentState === 'slingshot') {
          image(this.img[0], 0, 0, this.body.circleRadius * 2, this.body.circleRadius * 2);
        } else if (this.currentState === 'flying') {
          image(this.img[1], 0, 0, this.body.circleRadius * 2, this.body.circleRadius * 2);
        } else if (this.currentState === 'collided') {
          image(this.img[2], 0, 0, this.body.circleRadius * 2, this.body.circleRadius * 2);
        }
        //image(this.img, 0, 0, this.body.circleRadius * 2, this.body.circleRadius * 2);
        pop();
      }
    }
  }

  markForRemoval() {
    if (!this.shouldRemove) {
      this.shouldRemove = true;
      this.collisionTime = millis();
      this.RemovalTime = this.collisionTime + this.Duration;
    }
  }
}

class Pig {
  constructor(x, y, img, r=25) {
    this.body = Matter.Bodies.circle(
      x, y, r, {
    restitution:
      0.5,
      collisionFilter:
      {
      category:
        2
      }
    }
    );
    Matter.World.add(world, this.body);
    Matter.Body.set(this.body, 10);
    this.img = img;
    this.shouldRemove = false;
    this.collisionTime = 0;
    this.RemovalTime = 0;
    this.Duration = 2000;
    this.lives = 3;
    this.puntajeInfo = {
      x: 0,
      y:0,
      opacity:255
    }
  }

  show() {
    if (!this.shouldRemove) {
      push();
      translate(this.body.position.x, this.body.position.y);
      rotate(this.body.angle);
      imageMode(CENTER);
      let imgNumber = this.lives <= 1 ? 2: (3-this.lives)%3;
      image(this.img[imgNumber], 0, 0, this.body.circleRadius * 2, this.body.circleRadius * 2);
      pop();
    } else {
      const currentTime = millis();
      if (currentTime >= this.RemovalTime) {
        World.remove(world, this.body);
      } else {
        push();
        translate(this.body.position.x, this.body.position.y);
        rotate(this.body.angle);
        // Opcional: Podrías mostrar una imagen diferente, un efecto de desvanecimiento, etc.
        // Por ejemplo, podrías cambiar la opacidad para simular que desaparece gradualmente
        tint(255, map(currentTime, this.collisionTime, this.RemovalTime, 255, 0));
        imageMode(CENTER);
        let imgNumber = this.lives <= 1 ? 2: (3-this.lives)%3;
        image(this.img[imgNumber], 0, 0, this.body.circleRadius * 2, this.body.circleRadius * 2);
        pop();
      }
    }
  }

  markForRemoval() {
    if (!this.shouldRemove) {
      this.shouldRemove = true;
      this.collisionTime = millis();
      this.RemovalTime = this.collisionTime + this. Duration;
    }
  }

  reduceLife() {
    if (this.lives > 0) {
      this.lives--; // Reducir una vida
    }
    if (this.lives <= 0) {
      this.markForRemoval(); // Marcar para eliminación si las vidas llegan a cero
    }
  }
}
class Box {
  constructor(x, y, w, h, img, options = {}, lives){
      this.body = Matter.Bodies.rectangle(
      x, y, w, h, options
      );
  Matter.World.add(world, this.body);
  this.w = w;
  this.h = h;
  this.img = img;
  this.shouldRemove = false;
  this.lives = lives;
}
show() {
  
  if(!this.shouldRemove){
  
  push();
  translate(this.body.position.x, this.body.position.y);
  rotate(this.body.angle);
  if (this.img) {
    imageMode(CENTER);
    image(this.img, 0, 0, this.w, this.h)
  } else {
    rectMode(CENTER);
    fill(50, 200, 0);
    rect(0, 0, this.w, this.h)
  }
  pop();
  }else{
     World.remove(world, this.body);
  }
}

  markForRemoval() {
    if (!this.shouldRemove) {
      this.shouldRemove = true;
    }
  }

  reduceLife() {
    if (this.lives > 0) {
      this.lives--; // Reducir una vida
    }
    if (this.lives <= 0) {
      this.markForRemoval(); // Marcar para eliminación si las vidas llegan a cero
    }
  }
}

class Ground extends Box {
  constructor(x, y, w, h) {
    super(x, y, w, h, null, {
    isStatic:
      true
    }
    )
  }
}

class SlingShot {
  constructor(body, img) {
    this.sling = Matter.Constraint.create( {
    pointA:
      {
      x:
      body.position.x, y:
        body.position.y
      }
      ,
      bodyB :
      body,
      length:
      5,
      stiffness:
      0.05
    }
    );
    Matter.World.add(world, this.sling);
    this.img = img;
  }
  hasBird() {
    return this.sling.bodyB != null
  }
  show() {

    if (this.img) {
      push();
      imageMode(CENTER);
      image(this.img, this.sling.pointA.x, this.sling.pointA.y+30, 50, 100)
        pop();
    }

    if (this.hasBird()) {
      push();
      stroke(0);
      strokeWeight(3);
      line(this.sling.pointA.x,
        this.sling.pointA.y,
        this.sling.bodyB.position.x,
        this.sling.bodyB.position.y);
      pop();
    }
  }

  fly(mConstraint) {
    if (this.hasBird() &&
      mConstraint.mouse.button === -1 &&
      this.sling.bodyB.position.x >
      this.sling.pointA.x + 20
      ) {
      this.sling.bodyB.collisionFilter.category = 1;
      this.sling.bodyB = null;
    }
  }
  attach(body) {
    this.sling.bodyB = body;
  }
}
