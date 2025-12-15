
/*

- make flow fields different
 - change over time so the particles don't bunch?
 - change random seed / perturb flow field per particle?
 - multiple layers of particles (lower alpha for front layer(s))
 - particle age?

- make particles look more like flowing water
 - particle lifetime?
 - multi-shape 
 - put filter with more stuff over the top?
 - change noise scale based on local map, to change flow speed?

*/

let particles = [];
let particleVelocity = [];
let particleLifespan = [];
let particleAge = [];
let particleSize = [];
const pcount = 1000;
const noiseScale = 0.01;
const defaultLifespan = 100;

prevSeed = 0;
currSeed = 0;
seedLifeCounter = 0;
const seedLife = 60;

function setup() {
  createCanvas(1920, 1080);
  
  // create particles w/ randomized x,y coordinates
  for(let i = 0; i < pcount; i++) {
    let zVal = max(0, randomGaussian(0.5, 0.5));
    particles.push(createVector(random(width), random(height), zVal));
    particleVelocity.push(createVector(0, 0));
    //particleLifespan.push(createVector(defaultLifespan + random(-10, 10)));
    particleLifespan.push(defaultLifespan + random(-10, 10));
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
    let prevAngle = TAU * prevNoiseVal;
    velocity.x = cos(prevAngle);
    velocity.y = sin(prevAngle);
  }
  

  noiseSeed(currSeed);
  for (let i = 0; i < pcount; i++) {
    let particle = particles[i];
    let velocity = particleVelocity[i];
    let age = particleAge[i];
    let lifespan = particleLifespan[i];
    
    // update position
    let currNoiseVal = noise(particle.x * noiseScale, particle.y * noiseScale);
    let currAngle = TAU * currNoiseVal;
    velocity.x = particle.z * 2 * ((velocity.x + cos(currAngle)) / 2);
    velocity.y = particle.z * 2 * ((velocity.y + sin(currAngle)) / 2);
    particle.x += velocity.x;
    particle.y += velocity.y;

    // refresh particles based on age / position
    age += 1;
    print(age);
    if (age >= lifespan) {
      print('particle lifespan reached');
    }
    if ((age >= lifespan) | (!onScreen(particle))) {
      particle.x = width;//random(width);
      particle.y = random(height);
      particle.z = max(0, randomGaussian(0.5, 0.5));
      age = 0;
      lifespan = defaultLifespan + random(-10, 10);
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

function onScreen(point) {
  return point.x >= 0 && point.x <= width && point.y >= 0 && point.y <= height;
}