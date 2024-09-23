import { TAU } from "../utils/math.js";

export default class Circle {

  constructor({
    radius = 100,
    color = "tomato",
    x = 0,
    y = 0,
    speed = 100,
    dir = 0,
  } = {}) {
    this.radius = radius;
    this.color = color;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.dir = dir;
  }

  setDirection(angle) {
    this.dir = angle;
  }

  compareTo(other) {
    return this.radius - other.radius;
  }

  move(dt) {
    const dx = Math.cos(this.dir) * this.speed * dt / 1000;
    const dy = Math.sin(this.dir) * this.speed * dt / 1000;
    this.x += dx;
    this.y += dy;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, TAU);
    ctx.fill();
    ctx.closePath();
  }

}