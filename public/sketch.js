var electrons = [];

var con;  //Condensator Object placeholder
var b1;
var em;

var gs;   //Grid Size

var v1;
var v2;
var mov;

var ex;
var ey;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  frameRate(60);

  gs = width/16;
  con = new Condensator(2, 0, 8, 5);
  b1  = new BField(2, 0, 8, 5);
  em = new Emitter(0, 2);

  v1 = createVector(1,0);
  v2 = createVector(0,0.5);
  mov = createVector();

  ex = width/2;
  ey = height/2;
}

var addA = false;
var addB = false;

function draw() {
  background(255);
  /*
  //Drawing
  drawGrid();
  b1.render();
  con.render();
  con.renderField();
  em.render();
  if (frameCount%10 == 0) {em.emit();}
  for (let i = 0; i < electrons.length; i++) {
    electrons[i].render();
  }

  //Updating
  con.update();
  b1.update();
  for (let i = 0; i < electrons.length; i++) {
    electrons[i].update();
  }
  */

  if (v1.x <= -1) {
    addB = true;
  }
  if (v1.x >= 1) {
    addB = false;
  }
  if (addB) {
    v1.add(0.1, -0.1);
  } else {
    v1.add(-0.1, 0.1);
  }

  if (v2.y <= -0.5) {
    addA = true;
  }
  if (v2.y >= 0.5) {
    addA = false;
  }
  if (addA) {
    v2.add(-0.05, 0.05);
  } else {
    v2.add(0.05, -0.05);
  }

  mov = p5.Vector.add(v1,v2);
  ex += mov.x;
  ey += mov.y;
  ellipse(ex, ey, 10, 10);

}

function drawGrid(){
  stroke(0);
  strokeWeight(2);
  for (let i = 0; i <= 17; i++) {
    for (let j = 0; j <= 10; j++) {
      point(gs*i, gs*j);
    }
  }
}

function Condensator(gX, gY, gWidth, gHeight) {
  this.gX      = gX;
  this.gY      = gY;
  this.gWidth  = gWidth;
  this.gHeight = gHeight;

  this.pWidth = gs/4;     //Plate Width

  this.p1x1 = gX * gs;
  this.p1y1 = gY * gs;
  this.p1x2 = this.p1x1 + gWidth * gs;
  this.p1y2 = this.p1y1 + this.pWidth;

  this.p2x1 = this.p1x1;
  this.p2y1 = this.p1y1 + gHeight * gs - this.pWidth;
  this.p2x2 = this.p2x1 + gWidth  * gs;
  this.p2y2 = this.p2y1 + this.pWidth;

  this.width  = gWidth  * gs;
  this.height = gHeight * gs;

  this.render = function() {
    strokeWeight(1);
    fill('rgb(200, 0, 0)');
    rect(this.p1x1, this.p1y1, this.width, this.pWidth);
    fill('rgb(0, 0, 200)');
    rect(this.p2x1, this.p2y1, this.width, this.pWidth);
  }

  this.renderField = function() {
    stroke(0);
    strokeWeight(1);
    for (let i = 0.5; i < this.gWidth; i++) {
      line(this.p1x1 + gs*i, this.p1y2, this.p2x1 + gs*i, this.p2y1);
      line(this.p1x1 + gs*i - 5, this.p2y1-10, this.p1x1 + gs*i, this.p2y1);
      line(this.p1x1 + gs*i + 5, this.p2y1-10, this.p1x1 + gs*i, this.p2y1);
    }
  }

  this.update = function() {
    for (let i = 0; i < electrons.length; i++) {
      if (electrons[i].x >= this.p1x1) {
        electrons[i].mov.add(0, 0.0001);
      }
    }
  }
}

function BField(gX, gY, gWidth, gHeight) {
  this.gX      = gX;
  this.gY      = gY;
  this.gWidth  = gWidth;
  this.gHeight = gHeight;

  this.x = gX * gs;
  this.y = gY * gs;

  this.render = function() {
    strokeWeight(1);
    for (let i = this.gX; i <= this.gX+this.gWidth; i++) {
        for (let j = this.gY; j <= this.gHeight; j++) {
        line((gs*i)-5, (gs*j)-5, (gs*i)+5, (gs*j)+5);
        line((gs*i)+5, (gs*j)-5, (gs*i)-5, (gs*j)+5);
        point(gs*i, gs*j);
      }
    }
  }

  this.update = function() {
    for (let i = 0; i < electrons.length; i++) {
      if (electrons[i].x >= this.x) {
        electrons[i].mov.add(0, -0.0001);
      }
    }
  }
}

function Emitter(gX, gY) {
  this.gX      = gX;
  this.gY      = gY;

  this.x = this.gX*gs;
  this.y = this.gY*gs;

  this.render = function() {
    strokeWeight(1);
    fill('rgb(145, 145, 145)');
    rect(this.x, this.y, gs, gs);
    strokeWeight(3);
    line(this.x+(gs/2), this.y+(gs/2), this.x+gs, this.y+(gs/2));
  }

  this.emit = function() {
    electrons.push(new Electron(this.x+gs, this.y+(gs/2), 0.03));
  }
}

function Electron(x, y, speed) {
  this.x = x;
  this.y = y;
  this.speed = speed || 0;

  this.mov = createVector(this.speed, 0);

  this.render = function(){
    fill('rgb(0, 14, 200)');
    ellipse(this.x, this.y, 5, 5);
  }

  this.update = function(){
    this.x += this.mov.x*gs;
    this.y += this.mov.y*gs;

    if (this.x > width || this.x < 0 || this.y > height || this.y < 0) {
      this.destroy();
    }

    if (this.y >= con.p2y1) {
      this.destroy();
    }
  }

  this.destroy = function(){
    electrons.splice(electrons.indexOf(this), 1);
  }
}
