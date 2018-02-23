var electrons = [];

var con;  //Condensator Object placeholder
var b1;
var em;

var gs;   //Grid Size


function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  frameRate(2);

  gs = width/16;
  con = new Condensator(2, 0, 8, 5);
  b1  = new BField(2, 0, 8, 5);
  em = new Emitter(0, 2);
}

function draw() {
  background(255);
  drawGrid();
  b1.render();
  con.render();
  con.renderField();
  em.render();
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
}

function BField(gX, gY, gWidth, gHeight) {
  this.gX      = gX;
  this.gY      = gY;
  this.gWidth  = gWidth;
  this.gHeight = gHeight;

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
    electrons.append(new Electron(this.x+gs, this.y+(gs/2), 1));
  }
}

function Electron(x, y, speed) {
  this.x = x;
  this.y = y;
  this.speed = speed || 0;
}
