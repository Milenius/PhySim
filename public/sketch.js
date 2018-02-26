var eCharge = 1.60217646e-19;
var eMass   = 9.10938188e-31;
var speedMod = 0.0000001;
var forceMod = 1000000000000000000;

var electrons = [];

var con;  //Condensator Object placeholder
var b1;
var em;
var pl;

var gs;   //Grid Size

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  frameRate(60);

  gs = width/16;
  con = new Condensator(2, 0, 8, 5);
  b1  = new BField(2, 0, 8, 5);
  em = new Emitter(0, 2);
  pl = new Plate(11);
}

var addA = false;
var addB = false;

function draw() {
  background(255);

  //Drawing
  drawGrid();
  if (frameCount%10 == 0) {em.emit();}
  for (let i = 0; i < electrons.length; i++) {
    electrons[i].render();
  }
  b1.render();
  con.render();
  con.renderField();
  em.render();
  pl.render();

  //Updating
  con.update();
  b1.update();
  pl.update();
  for (let i = 0; i < electrons.length; i++) {
    electrons[i].update();
  }
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

  this.inp = createInput('1750');
  this.inp.position(50, height/2 + 100);

  this.d = this.gHeight*0.01;
  this.U = this.inp.value();
  this.E = this.U / this.d;
  this.Fel = this.E * eCharge;

  this.render = function() {
    strokeWeight(1);
    fill('rgb(0, 0, 200)');
    rect(this.p1x1, this.p1y1, this.width, this.pWidth);
    fill('rgb(200, 0, 0)');
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
    this.updateParams();

    for (let i = 0; i < electrons.length; i++) {
      if (electrons[i].y >= this.p2y1 || electrons[i].y <= this.p1y2) {
        electrons[i].destroy();
      }

      if (electrons[i].x >= this.p1x1) {
        electrons[i].mov.add(0, -this.Fel);
      }
    }
  }

  this.updateParams = function(){
    this.U = this.inp.value();
    this.E = this.U / this.d;
    this.Fel = this.E * eCharge;
  }
}

function BField(gX, gY, gWidth, gHeight) {
  this.gX      = gX;
  this.gY      = gY;
  this.gWidth  = gWidth;
  this.gHeight = gHeight;

  this.x = gX * gs;
  this.y = gY * gs;

  this.inp = createInput('0.12964');
  this.inp.position(50, height/2 + 150);
  this.B = this.inp.value();
  this.Fl;

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
    this.updateParams();
    for (let i = 0; i < electrons.length; i++) {
      if (electrons[i].x >= this.x) {
        this.Fl = this.B*electrons[i].v*eCharge
        electrons[i].mov.add(0, this.Fl);
      }
    }
  }

  this.updateParams = function(){
    this.B = this.inp.value();
  }
}

function Emitter(gX, gY) {
  this.gX      = gX;
  this.gY      = gY;

  this.x = this.gX*gs;
  this.y = this.gY*gs;

  this.inp = createInput('0.20725');
  this.inp.position(50, height/2 + 50);


  this.U = this.inp.value();
  this.eVel = sqrt((2*this.U*eCharge)/eMass);


  this.render = function() {
    strokeWeight(1);
    fill('rgb(145, 145, 145)');
    rect(this.x, this.y, gs, gs);
    strokeWeight(3);
    line(this.x+(gs/2), this.y+(gs/2), this.x+gs, this.y+(gs/2));
  }

  this.emit = function() {
    this.updateParams();
    electrons.push(new Electron(this.x+gs, this.y+(gs/2), createVector(this.eVel, 0)));
  }

  this.updateParams = function(){
    this.U = float(this.inp.value());
    //this.U += random(-1, 1)*0.0005;
    this.eVel = sqrt((2*this.U*eCharge)/eMass);
    console.log(this.eVel);

  }
}

function Electron(x, y, mov) {
  this.x = x;
  this.y = y;

  this.mov = mov;
  this.v = this.mov.x;

  this.render = function(){
    fill('rgb(0, 14, 200)');
    ellipse(this.x, this.y, 5, 5);
  }

  this.update = function(){
    this.x += this.mov.x*gs*speedMod;
    this.y += this.mov.y*gs*1e12;
    if (this.x > width || this.x < 0 || this.y > height || this.y < 0) {
      this.destroy();
    }
  }

  this.destroy = function(){
    electrons.splice(electrons.indexOf(this), 1);
  }


}

function Plate(gX) {
  this.gX = gX;
  this.x = this.gX*gs;

  this.render = function(){
    rect(this.x-gs/8, 0, gs/8, gs*2.45);
    rect(this.x-gs/8, gs*2.6, gs/8, height-gs*2.55);
  }

  this.update = function(){
    for (let i = 0; i < electrons.length; i++) {
      if ((electrons[i].y >= gs*2.55 || electrons[i].y <= gs*2.45) && electrons[i].x >= this.x-gs/8 && electrons[i].x <= this.x) {
        electrons[i].destroy();
      }
    }
  }
}
