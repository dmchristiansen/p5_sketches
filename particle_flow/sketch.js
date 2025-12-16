
/*

- make flow fields different
 - change over time so the particles don't bunch?
 - change random seed / perturb flow field per particle?
 - multiple layers of particles (lower alpha for front layer(s))
 - particle age?

- make particles look more like flowing water
 x particle lifetime?
 - multi-shape 
 - put filter with more stuff over the top?
 - change noise scale based on local map, to change flow speed?

*/

let flowField = [];
let particles = [];
let particleVelocity = [];
let particleLifespan = [];
let particleAge = [];
let particleSize = [];
const pcount = 1000;
const noiseScale = 0.01;
const defaultLifespan = 2000;
const lifespanSpread = 200;

prevSeed = 0;
currSeed = 0;
seedLifeCounter = 0;
const seedLife = 120;

function setup() {
  createCanvas(2200, 1080);
  
  // create particles w/ randomized x,y coordinates
  for(let i = 0; i < pcount; i++) {
    let zVal = min(max(0.05, randomGaussian(0.5, 0.5)), 0.9);
    particles.push(createVector(random(width), random(height), zVal));
    particleVelocity.push(createVector(0, 0));
    //particleLifespan.push(createVector(defaultLifespan + random(-10, 10)));
    particleLifespan.push(defaultLifespan + random(-lifespanSpread, lifespanSpread));
    //particleAge.push(createVector(0));
    particleAge.push(0);
    particleSize.push(createVector(0));
  }
  
  prevSeed = millis();
  currSeed = millis();

  colorMode(HSB, 360, 100, 100, 100);
  background(0, 0, 0);

  print('hello world');

}

function draw() {
  
  // track seed changing
  seedLifeCounter++;
  if(seedLifeCounter >= seedLife) {
    seedLifeCounter = 0;
    prevSeed = currSeed;
    currSeed = millis();
  }

  //background(128, 200, 255, 10);
  background(0, 0, 0, 10);

  noiseSeed(prevSeed);
  for (let i = 0; i < pcount; i++) {
    let particle = particles[i];
    let velocity = particleVelocity[i];

    let prevNoiseVal = noise(particle.x * noiseScale, particle.y * noiseScale);
    //let prevNoiseVal = noise(particle.x, particle.y);
    let prevAngle = TAU * prevNoiseVal;
    velocity.x = cos(prevAngle);
    velocity.y = sin(prevAngle);
  }
  

  noiseSeed(currSeed);
  for (let i = 0; i < pcount; i++) {
    let particle = particles[i];
    let velocity = particleVelocity[i];
    
    // update position
    let currNoiseVal = noise(particle.x * noiseScale, particle.y * noiseScale);
    //let currNoiseVal = noise(particle.x, particle.y);
    let currAngle = TAU * currNoiseVal;
    //let localSpeed = findLocalSpeed(particle.x, particle.y);
    let localSpeed = 2;
    let localAngle = findLocalAngle(particle.x, particle.y);
    velocity.x = localSpeed * max(0.25, particle.z) * 2 * (((velocity.x + cos(currAngle)) / 2) + cos(localAngle));
    velocity.y = localSpeed * max(0.25, particle.z) * 2 * (((velocity.y + sin(currAngle)) / 2) + sin(localAngle));
    particle.x += velocity.x;
    particle.y += velocity.y;

    // refresh particles based on age / position
    //particleAge[i] += 1.0;
    //if ((particleAge[i] >= particleLifespan[i]) | (!onScreen(particle))) {
    if (!onScreen(particle)) {
      particle.x = width;//random(width);
      particle.y = random(height);
      particle.z = min(max(0.05, randomGaussian(0.5, 0.5)), 0.9);
      particleAge[i] = 0;
      particleLifespan[i] = defaultLifespan + random(-10, 10);
    }

  }


  for (let i = 0; i < pcount; i++) {
    let particle = particles[i];
    let hue = 180 + 60 * particle.z;
    
    stroke(hue, 100, 100 * (1 - particle.z), 100 * (1 - particle.z));
    fill(hue, 100, 100 * (1 - particle.z), 100 * (1 - particle.z));
    circle(particle.x, particle.y, 100 * particle.z);
  }

  /*
  push();
  for (let i = 0; i < pcount/2; i++) {
    let particle = particles[i];
    stroke(50, 50, 200, 50);
    fill(50, 50, 200, 50);
    circle(particle.x, particle.y, random(10, 15));
  }
  //filter(BLUR, 2);
  pop();  
  
  for (let i = pcount/2; i < pcount; i++) {
    let particle = particles[i];
    stroke(100, 225, 255, 7);
    fill(50, 175, 255, 5);
    circle(particle.x, particle.y, random(40, 45));
  }
  */

  filter(BLUR, 2);
}

function findLocalSpeed(x, y) {
  if (x >= (width - 500)) {
    return 2.5;
  }
  if (x >= 500) {
    return 1.0;
  }
  return 1.0;
}

function findLocalAngle(x, y) {
  if (x >= 800) {
    return TAU * 0.5;  
  }
  if (x >= 600) {
    return TAU * 0.6;
  }
  if (x >= 400) {
    return TAU * 0.7;
  }
  return TAU * 0.75;
}

function onScreen(point) {
  return point.x >= 0 && point.x <= width && point.y >= 0 && point.y <= height;
}

function initFlowField() {
  flowField = [];
}