import axios from 'axios';
import Renderer from './renderer';

let canvas = document.getElementById('webgl');
window.renderer;

var stats;

if (window.Stats) {
  stats = new Stats();
  stats.showPanel(0);
  document.body.appendChild(stats.dom);
}

let grid = [];
for(let i = -5; i <= 5; i++){
  for(let j = -5; j <= 5; j++){
    grid.push({
      x: 1 / 5 * i,
      y: 1 / 5 * j
    });
  }
}
let point = {
  x: 0,
  y: 0
};
let startTime,
  t;

Promise.all([
  axios.get("./plugin/v_shader.glsl"),
  axios.get("./plugin/f_shader.glsl"),
  axios.get("./plugin/scene_v_shader.glsl"),
  axios.get("./plugin/scene_f_shader.glsl")]
).then(([resV, resF, resSV, resSF]) => {
  let vShader = resV.data;
  let fShader = resF.data;
  let sceneVShader = resSV.data;
  let sceneFShader = resSF.data;
  window.renderer = new Renderer(canvas, vShader, fShader, sceneVShader, sceneFShader);
  startTime = (new Date()).getTime();
  animate();
});

function animate(){
  stats && stats.begin();
  t = ((new Date()).getTime() - startTime) / 1000;
  point = {
    x: Math.cos(t),
    y: Math.sin(t)
  };
  point.x *= canvas.width / canvas.height;
  point.y *= canvas.width / canvas.height;
  point.x /= canvas.width / canvas.height;
  let gridArray = [];
  for(let i = 0; i < grid.length; i++){
    gridArray.push(grid[i].x / (canvas.width / canvas.height));
    gridArray.push(grid[i].y);
  }
  let dataArray = new Float32Array(gridArray.concat([point.x, point.y]));
  window.renderer.setAttribute(window.renderer.pointProgram, "a_position", dataArray, 2, "FLOAT");
  window.renderer.update(grid.length + 1);
  requestAnimationFrame(animate);
  stats && stats.end();
}