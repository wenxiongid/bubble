import Engine from './engine';
import {
  getResponseDist
} from './helper';

import BallRadiusMap from './game_param';

function randomLevel(){
  // return 1;
  return Math.ceil(Math.random() * 3);
}

class Game{
  constructor(canvas){
    let _this = this;
    let sceneSize = {
      width: canvas.width,
      height: canvas.height
    };
    let wallWidth = getResponseDist(10);
    _this.engine = new Engine(canvas, wallWidth);
    // test
    _this.startV = 14;
    _this.birthPos = {
      x: getResponseDist(375 / 2),
      y: sceneSize.height * 0.8
    };

    _this.addStillBall(randomLevel());
    // test end
    document.addEventListener('touchend', function (e) {
      let pos = {};
      if (e.pageX) {
        pos = {
          x: e.pageX,
          y: e.pageY
        };
      }
      if (e.changedTouches.length) {
        pos = {
          x: e.changedTouches[0].pageX,
          y: e.changedTouches[0].pageY
        };
      }
      _this.shoot(pos, randomLevel());
    }, false);
  }
  createBall(x, y, radius, level){
    let _this = this;
    _this.engine.createBall({
      x,
      y
    }, radius, level);
  }
  addStillBall(level){
    let _this = this;
    let radius = BallRadiusMap[level];
    _this.engine.addStillBall(_this.birthPos, radius, level);
    console.log('still level:', level);
  }
  shoot(pos, newBallLevel){
    let _this = this;
    _this.engine.shoot(pos, _this.startV);
    _this.addStillBall(newBallLevel);
  }
  update(){
    let _this = this;
    _this.engine.update();
  }
}

export {
  Game as default
};