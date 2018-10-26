import Renderer from "./renderer";
import Physics from "./physics";
import {
  px2coord
} from './helper';

class Engine {
  constructor(canvas, wallWidth, updateRender) {
    let _this = this;
    _this.canvas = canvas;
    _this.updateRender = updateRender;
    _this.sceneSize = {
      width: canvas.width,
      height: canvas.height
    };
    _this.initPromise = new Promise((resolve, reject) => {
      _this.renderer = new Renderer(canvas);
      let debugWrapper = document.getElementById('debugWrapper');
      _this.physics = new Physics(debugWrapper, _this.sceneSize, wallWidth);
      _this.renderer.initPromise.then(() => {
        resolve();
      });
    });
  }
  createBall(pos, radius, level){
    let _this = this;
    _this.physics.createBall(pos.x, pos.y, radius, level);
    _this.updateRendererData();
  }
  addStillBall(pos, radius, level){
    let _this = this;
    _this.physics.createBall(pos.x, pos.y, radius, level, true);
    _this.updateRendererData();
  }
  shoot(pos, startV){
    let _this = this;
    _this.physics.shoot(pos, startV);
  }
  updateRendererData(){
    let _this = this;
    let posList = [];
    let levelList = [];
    let sizeList = [];
    _this.physics.getAllBall().forEach(ball => {
      let coord = px2coord(ball.position.x, ball.position.y, _this.sceneSize.width, _this.sceneSize.height);
      posList.push(coord.u);
      posList.push(coord.v);
      levelList.push(ball.level);
      sizeList.push(ball.circleRadius * 4);
    });
    _this.renderer.updateData(posList, levelList, sizeList);
  }
  update() {
    let _this = this;
    _this.updateRendererData();
    _this.renderer.draw();
    if(_this.updateRender){
      _this.updateRender();
    }
  }
}

export {
  Engine as default
};