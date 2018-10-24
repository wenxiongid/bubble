import decomp from "poly-decomp";
window.decomp = decomp;
import Matter from 'matter-js';

import Physics from './physics';

let sceneSize = {
  width: window.innerWidth,
  height: window.innerHeight
};

let startV = 14;

let birthPos = {
  x: getResponseDist(375 / 2),
  y: sceneSize.height * 0.8
};

function getResponseDist(val){
  return val / 375 * sceneSize.width;
}

let wallWidth = getResponseDist(10);

let physics = new Physics(document.body, sceneSize, wallWidth, birthPos, startV);

// 创建刚体
let radius = getResponseDist(20);
for(let i = 0; i < 20; i++){
  let x = wallWidth + radius + Math.random() * sceneSize.width - 2 * wallWidth - 2 * radius;
  let y = sceneSize.height / 2 + (Math.random() * sceneSize.height) / 2;
  physics.createball(x, y, radius);
}

physics.addStillBall(radius);

document.addEventListener('touchend', function(e){
  let pos = {};
  if(e.pageX){
    pos = {
      x: e.pageX,
      y: e.pageY
    };
  }
  if(e.changedTouches.length){
    pos = {
      x: e.changedTouches[0].pageX,
      y: e.changedTouches[0].pageY
    };
  }
  physics.shoot(pos, radius);
}, false);