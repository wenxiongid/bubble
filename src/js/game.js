import Engine from './engine';
import {
  getResponseDist
} from './helper';

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
    _this.ballRadius = getResponseDist(20);

    _this.addStillBall(_this.ballRadius);
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
      _this.shoot(pos, _this.ballRadius);
    }, false);
  }
  createBall(x, y, radius){
    let _this = this;
    _this.engine.createBall({
      x,
      y
    }, radius);
  }
  addStillBall(radius){
    let _this = this;
    _this.engine.addStillBall(_this.birthPos, radius);
  }
  shoot(pos, newBallRadius){
    let _this = this;
    _this.engine.shoot(pos, _this.startV);
    _this.engine.addStillBall(_this.birthPos, newBallRadius);
  }
  update(){
    let _this = this;
    _this.engine.update();
  }
}

export {
  Game as default
};