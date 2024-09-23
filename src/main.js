import Circle from "./class/Circle";
import Keyboard from "./class/Keyboard";
import { TAU, getRandomInt } from "./utils/math";

const ctx = document.querySelector('canvas').getContext('2d');

// set canvas size to match the parent container
ctx.canvas.width = ctx.canvas.clientWidth;
ctx.canvas.height = ctx.canvas.clientHeight;

const keyboard = new Keyboard();

const circles = [];
for (let i = 0; i < 100; i++) {
  const radius = getRandomInt(3, 80);
  circles.push(new Circle({
    x: Math.random() * ctx.canvas.width,
    y: Math.random() * ctx.canvas.height,
    speed: radius / 10 * 20,
    dir: 0,
    radius,
    color: `hsl(${Math.random() * 360}, 75%, 50%)`,
  }));
}

circles.sort((c1, c2) => c1.compareTo(c2));

function tick(timestamp) {
  const dt = timestamp - lastTick;
  lastTick = timestamp;

  // Manage user input
  let angle = false;
  if (keyboard.isKeyDown("KeyW")) {
    angle = TAU * 0.75;
  } else if (keyboard.isKeyDown("KeyS")) {
    angle = TAU * 0.25;
  }
  // Update the world
  if (angle !== false) {
    for (const circle of circles) {
      circle.setDirection(angle);
      circle.move(dt);
    }
  }

  // Render the WORLD
  ctx.canvas.width = ctx.canvas.clientWidth;
  ctx.canvas.height = ctx.canvas.clientHeight;
  for (const circle of circles) circle.draw(ctx);

  // Main animation loop
  requestAnimationFrame(tick);
}

let lastTick = 0;
requestAnimationFrame(tick);