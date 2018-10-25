attribute vec2 a_Position;
attribute float a_Level;
varying vec4 v_Inner;

void main() {
  gl_Position = vec4(a_Position, 0.0, 1.0);
  if(a_Level == 1.0){
    gl_PointSize = 80.0;
    v_Inner = vec4(0.30, 0.25, 0.25, 0.0);
  }
  if(a_Level == 2.0){
    gl_PointSize = 120.0;
    v_Inner = vec4(0.30, 0.25, 0.27, 0.0);
  }
  if(a_Level == 3.0){
    gl_PointSize = 160.0;
    v_Inner = vec4(0.30, 0.25, 0.285, 0.0);
  }
  if(a_Level == 4.0){
    gl_PointSize = 200.0;
    v_Inner = vec4(0.30, 0.25, 0.29, 0.0);
  }
  if(a_Level == 5.0){
    gl_PointSize = 240.0;
    v_Inner = vec4(0.30, 0.25, 0.3, 0.0);
  }
  if(a_Level == 6.0){
    gl_PointSize = 280.0;
    v_Inner = vec4(0.3, 0.25, 0.3, 0.0);
  }
  if(a_Level == 7.0){
    gl_PointSize = 320.0;
    v_Inner = vec4(0.3, 0.25, 0.30, 0.0);
  }
}