import axios from "axios";
import GLRenderer from './gl_renderer';

const vShader = `
uniform int group;
attribute vec2 a_Position;
attribute float a_Level;
attribute float a_PointSize;
varying vec4 v_Color;

void main() {
  gl_Position = vec4(a_Position, 0.0, 1.0);
  gl_PointSize = a_PointSize;
  if(group == 0){
    if(a_Level == 1.0){
      v_Color = vec4(1.0, 0.0, 0.0, 1.0);
    }
    if(a_Level == 2.0){
      v_Color = vec4(0.0, 1.0, 0.0, 1.0);
    }
    if(a_Level == 3.0){
      v_Color = vec4(0.0, 0.0, 1.0, 1.0);
    }
  }
  if(group == 1){
    if(a_Level == 4.0){
      v_Color = vec4(1.0, 0.0, 0.0, 1.0);
    }
    if(a_Level == 5.0){
      v_Color = vec4(0.0, 1.0, 0.0, 1.0);
    }
    if(a_Level == 6.0){
      v_Color = vec4(0.0, 0.0, 1.0, 1.0);
    }
  }
  if(group == 2){
    if(a_Level == 7.0){
      v_Color = vec4(1.0, 0.0, 0.0, 1.0);
    }
    if(a_Level == 8.0){
      v_Color = vec4(0.0, 1.0, 0.0, 1.0);
    }
    if(a_Level == 9.0){
      v_Color = vec4(0.0, 0.0, 1.0, 1.0);
    }
  }
}
`;

const fShader = `
#ifdef GL_ES
precision mediump float;
#endif

varying vec4 v_Color;

void main(){
  float d = length(gl_PointCoord - vec2(0.5, 0.5));
  float c = smoothstep(0.40, 0.20, d);
  c *= mix(0.82, 1.0, smoothstep(0.198, 0.28, d));
  gl_FragColor = v_Color * c;
}
`;

const sceneVShader = `
attribute vec2 a_Position;
attribute vec2 a_texcoord;
varying vec2 v_texcoord;

void main() {
  gl_Position = vec4(a_Position, 0.0, 1.0);
  v_texcoord = a_texcoord;
}
`;

const sceneFShader = `
#ifdef GL_ES
precision mediump float;
#endif

varying vec2 v_texcoord;
uniform sampler2D u_sceneMap;
uniform vec2 u_resolution;
uniform int group;

void main(){
  vec4 mapColor = texture2D(u_sceneMap, v_texcoord);
  float d = 0.0;
  vec4 color = vec4(0.0);
  if(group == 0){
    if(mapColor.r > 0.0){
      d = smoothstep(0.6, 0.7, mapColor.r);
      color += vec4(0.86, 0.20, 0.18, 1.0) * d;
    }
    if(mapColor.g > 0.0){
      d = smoothstep(0.6, 0.7, mapColor.g);
      color += vec4(0.80, 0.29, 0.09, 1.0) * d;
    }
    if(mapColor.b > 0.0){
      d = smoothstep(0.6, 0.7, mapColor.b);
      color += vec4(0.71, 0.54, 0.00, 1.0) * d;
    }
  }
  if(group == 1){
    if(mapColor.r > 0.0){
      d = smoothstep(0.6, 0.7, mapColor.r);
      color += vec4(0.52, 0.60, 0.00, 1.0) * d;
    }
    if(mapColor.g > 0.0){
      d = smoothstep(0.6, 0.7, mapColor.g);
      color += vec4(0.16, 0.63, 0.60, 1.0) * d;
    }
    if(mapColor.b > 0.0){
      d = smoothstep(0.6, 0.7, mapColor.b);
      color += vec4(0.15, 0.55, 0.82, 1.0) * d;
    }
  }
  if(group == 2){
    if(mapColor.r > 0.0){
      d = smoothstep(0.6, 0.7, mapColor.r);
      color += vec4(0.42, 0.44, 0.77, 1.0) * d;
    }
    if(mapColor.g > 0.0){
      d = smoothstep(0.6, 0.7, mapColor.g);
      color += vec4(0.83, 0.21, 0.51, 1.0) * d;
    }
    if(mapColor.b > 0.0){
      d = smoothstep(0.6, 0.7, mapColor.b);
      color += vec4(1.0, 1.0, 1.0, 1.0) * d;
    }
  }
  gl_FragColor = color;
  // gl_FragColor = mapColor;
}
`;

class Renderer{
  constructor(canvas){
    let _this = this;
    _this.dataArray = new Float32Array([]);
    _this.isInit = false;
    _this.initPromise = new Promise((resolve, reject) => {
      // Promise.all([
      //   axios.get("./plugin/v_shader.glsl"),
      //   axios.get("./plugin/f_shader.glsl"),
      //   axios.get("./plugin/scene_v_shader.glsl"),
      //   axios.get("./plugin/scene_f_shader.glsl")
      // ]).then(([resV, resF, resSV, resSF]) => {
        // let vShader = resV.data;
        // let fShader = resF.data;
        // let sceneVShader = resSV.data;
        // let sceneFShader = resSF.data;
        _this.glRenderer = new GLRenderer(canvas, vShader, fShader, sceneVShader, sceneFShader);
        _this.isInit = true;
        resolve();
      // });
    });
  }
  updateData(posData, levelData, sizeData){
    let _this = this;
    _this.posDataArray = new Float32Array(posData);
    _this.levelDataArray = new Float32Array(levelData);
    _this.sizeDataArray = new Float32Array(sizeData);
  }
  draw(){
    let _this = this;
    if(_this.isInit){
      _this.glRenderer.setPointData(_this.posDataArray, _this.levelDataArray, _this.sizeDataArray);
      _this.glRenderer.update(_this.levelDataArray.length);
    }
  }
}

export {
  Renderer as default
};