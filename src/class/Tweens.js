const easingFct = new Map();

easingFct.set('linear', timeFraction => timeFraction);
easingFct.set('quad', timeFraction => timeFraction ** 2);
easingFct.set('cubic', timeFraction => timeFraction ** 3);
easingFct.set('circ', timeFraction => 1 - Math.sin(Math.acos(timeFraction)));
easingFct.set('back', timeFraction => Math.pow(timeFraction, 2) * (2.5 * timeFraction - 1.5));
easingFct.set('bounce', timeFraction => {
  for (let a = 0, b = 1; 1; a += b, b /= 2) {
    if (timeFraction < (7 - 4 * a) / 11) continue;
    return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2)
  }
});
easingFct.set('elastic', timeFraction => {
  return Math.pow(2, 10 * (timeFraction - 1)) * Math.cos(31.415926535 * timeFraction)
});


export default class Tweens {

  constructor() {
    this.tweens = new Set();
  }

  create({
    duration = 1000,
    from = 100,
    to = 300,
    animate= () => {},
    easing = 'linear',
  }) {
    const theEasingFct = easingFct.get(easing);
    const tween = {duration, time: 0, to, from, animate, easing: theEasingFct};
    this.tweens.add(tween);
  }

  update(dt) {
    for (const tween of this.tweens) {
      tween.time += dt;
      let timeFraction = tween.time / tween.duration;
      if (timeFraction > 1) timeFraction = 1;
      const value = (tween.to - tween.from) * tween.easing(timeFraction) + tween.from;
      tween.animate(value);
      if (timeFraction === 1) this.tweens.delete(tween);
    }
  }

}