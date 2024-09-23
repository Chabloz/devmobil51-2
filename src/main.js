import Circle from "./class/Circle";
import { TAU } from "./utils/math";

const ctx = document.querySelector('canvas').getContext('2d');

// set canvas size to match the parent container
ctx.canvas.width = ctx.canvas.clientWidth;
ctx.canvas.height = ctx.canvas.clientHeight;

const circles = [];
for (let i = 0; i < 10; i++) {
  circles.push(new Circle({
    x: Math.random() * ctx.canvas.width,
    y: Math.random() * ctx.canvas.height,
    speed: Math.random() * 100,
    dir: Math.random() * TAU,
    color: `hsl(${Math.random() * 360}, 100%, 50%)`,
  }));
}

// raf loop
function tick(timestamp) {
  const dt = timestamp - lastTick;
  lastTick = timestamp;
  ctx.canvas.width = ctx.canvas.clientWidth;
  ctx.canvas.height = ctx.canvas.clientHeight;

  for (const circle of circles) {
    circle.move(dt);
    circle.draw(ctx);
  }

  requestAnimationFrame(tick);
}
let lastTick = 0;
requestAnimationFrame(tick);