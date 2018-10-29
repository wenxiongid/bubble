import { getResizeEl } from "./helper";
import Game from './game';

var stats;

if (window.Stats) {
  stats = new Stats();
  stats.showPanel(0);
  document.body.appendChild(stats.dom);
}
let canvas = getResizeEl(document.getElementById("webgl"));
let myGame = new Game(canvas);
animate();

function animate(){
  stats && stats.begin();
  myGame.update();
  requestAnimationFrame(animate);
  stats && stats.end();
}