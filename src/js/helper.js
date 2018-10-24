function resize(el) {
  el.width = window.innerWidth;
  el.height = window.innerHeight;
}

function getResizeEl(el){
  window.addEventListener('resize', function(){
    resize(el);
  }, false);
  resize(el);
  return el;
}

function getResponseDist(val) {
  return (val / 375) * window.innerWidth;
}

function px2coord(x, y, width, height) {
  return {
    u: x * 2 / width - 1,
    v: 1 - 2 * y / height
  }
}

export {
  getResizeEl,
  getResponseDist,
  px2coord
};