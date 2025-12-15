
let particles = [];
let particleVelocity = [];
let particleLifespan = [];
let particleAge = [];
let particleSize = [];
let wave = [];

const particleCount = 36;
const noiseScale = 0.01;
const defaultLifespan = 10;

prevSeed = 0; currSeed = 0;
seedLifeCounter = 0;
const seedLife = 60;

function setup() {
  createCanvas(600, 600);
  angleMode(DEGREES);
  stroke(255);
  strokeWeight(10);

  for (let i = 0; i < particleCount; i++) {
    particles[i] = createVector(random(width), random(height));
  }




}

function draw() {
  background(0);

  // randomly move points


  loadPixels();

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let distances = [];
      for (let i = 0; i < particleCount; i++) {
        //distances[i] = dist(x, y, points[i].x, points[i].y);
        distances[i] = (x-particles[i].x)**2 + (y-particles[i].y)**2;
      }
      let sorted = sort(distances);
      let noise = Math.sqrt(sorted[0]);
      let index = (y * width + x) * 4;
      /*
      wave[index]   = waveColor(noise, 14.5, 44, 2.5);
      wave[index+1] = waveColor(noise, 21, 169, 2.5);
      wave[index+2] = waveColor(noise, 40, 225, 3.0);
      */
      wave[index]   = waveColor(noise, 40, 32, 2.2);
      wave[index+1] = waveColor(noise, 30, 55, 3.34);
      wave[index+2] = waveColor(noise, 30, 68, 3.55);
      wave[index+3] = 255;
    }
  }
  
  for (i = 0; i < wave.length; i++) {
    pixels[i] = wave[i];
  }
  updatePixels();

  /*
  beginShape(POINTS);
  for (let i = 0; i < points.length; i++) {
    vertex(points[i].x, points[i].y);
  }
  endShape();
  */
}

function waveColor(x, a, b, e) {
  if (x < 0) return b;
  else return Math.pow(x / a, e) + b;
}
