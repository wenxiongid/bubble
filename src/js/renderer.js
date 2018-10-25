import axios from "axios";
import GLRenderer from './gl_renderer';

class Renderer{
  constructor(canvas){
    let _this = this;
    _this.dataArray = new Float32Array([]);
    _this.isInit = false;
    _this.initPromise = new Promise((resolve, reject) => {
      Promise.all([
        axios.get("./plugin/v_shader.glsl"),
        axios.get("./plugin/f_shader.glsl"),
        axios.get("./plugin/scene_v_shader.glsl"),
        axios.get("./plugin/scene_f_shader.glsl")
      ]).then(([resV, resF, resSV, resSF]) => {
        let vShader = resV.data;
        let fShader = resF.data;
        let sceneVShader = resSV.data;
        let sceneFShader = resSF.data;
        _this.glRenderer = new GLRenderer(canvas, vShader, fShader, sceneVShader, sceneFShader);
        _this.isInit = true;
        resolve();
      });
    });
  }
  updateData(posData, levelData){
    let _this = this;
    _this.posDataArray = new Float32Array(posData);
    _this.levelDataArray = new Float32Array(levelData);
  }
  draw(){
    let _this = this;
    if(_this.isInit){
      _this.glRenderer.setAttribute(_this.glRenderer.pointProgram, "a_Position", _this.posDataArray, 2, "FLOAT");
      _this.glRenderer.setAttribute(_this.glRenderer.pointProgram, "a_Level", _this.levelDataArray, 1, "FLOAT");
      _this.glRenderer.update(_this.levelDataArray.length);
    }
  }
}

export {
  Renderer as default
};