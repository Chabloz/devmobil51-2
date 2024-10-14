import Circle from "./class/CircleVerlet";
import { TAU, getRandomInt } from "./utils/math";
import MainLoop from "./utils/mainloop";
import Link from "./class/LinkVerlet";
import Tweens from "./class/Tweens";

const ctx = document.querySelector('canvas').getContext('2d');
ctx.canvas.width = ctx.canvas.clientWidth;
ctx.canvas.height = ctx.canvas.clientHeight;

const tweens = new Tweens();
tweens.create({
  duration: 5000,
  from: 100,
  to: ctx.canvas.width/2,
  easing: 'quad',
  animate: (progress) => {
    circle.x = progress;
  }
});

const circles = [];
for (let i = 0; i < 5; i++) {
  const radius = getRandomInt(5, 30);
  circles.push(new Circle({
    x: Math.random() * ctx.canvas.width,
    y: Math.random() * ctx.canvas.height,
    radius,
    color: `hsl(${Math.random() * 360}, 75%, 50%)`,
  }));
}
const circle = new Circle({
  x: ctx.canvas.width / 2,
  y: ctx.canvas.height / 2,
  radius: 50,
  color: "tomato",
  sticky: true,
});

//make first circle sticky
circles[0].x = ctx.canvas.width / 2;
circles[0].y = ctx.canvas.height / 2;
circles[0].sticky = true;

const links = [];
for (let i = 0; i < circles.length - 1; i++) {
  links.push(new Link({
    obj1: circles[i],
    obj2: circles[i+1],
    distance: 100,
    color: 'tomato',
  }));
}

MainLoop.setSimulationTimestep(1000 / 120);
MainLoop.setUpdate((dt) => {
  for (const circle of circles) {
    circle.applyForceY(0.003);
    circle.move(dt);
    circle.constraintBox(ctx.canvas.width, ctx.canvas.height);
  }

  // solve collision detection
  for (let i = 0; i < circles.length; i++) {
    const circle = circles[i];
    for (let j = i + 1; j < circles.length; j++) {
      const otherCircle = circles[j];
      circle.collisionCircle(otherCircle);
    }
  }
  for (const link of links) link.update(dt);
  tweens.update(dt);
});
MainLoop.setDraw((dt) => {
  ctx.canvas.width = ctx.canvas.clientWidth;
  ctx.canvas.height = ctx.canvas.clientHeight;
  for (const circle of circles) circle.draw(ctx);
  for (const link of links) link.draw(ctx);
  circle.draw(ctx);
});
MainLoop.setEnd((fps, panic) => {
  if (!panic) return;
  console.error('panic!');
  MainLoop.resetFrameDelta();
});
MainLoop.start();