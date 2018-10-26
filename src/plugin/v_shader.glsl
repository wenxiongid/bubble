attribute vec2 a_Position;
attribute float a_Level;
attribute float a_PointSize;
varying vec4 v_Inner;
varying vec3 v_Color;

void main() {
  gl_Position = vec4(a_Position, 0.0, 1.0);
  gl_PointSize = a_PointSize;
  if(a_Level == 1.0){
    // gl_PointSize = 80.0;
    v_Inner = vec4(0.3, 0.25, 0.245, 0.24);
    v_Color = vec3(214.0 / 255.0, 187.0 / 255.0, 104.0 / 255.0);
  }
  if(a_Level == 2.0){
    // gl_PointSize = 120.0;
    v_Inner = vec4(0.3, 0.24, 0.235, 0.23);
    v_Color = vec3(226.0 / 255.0, 153.0 / 255.0, 116.0 / 255.0);
  }
  if(a_Level == 3.0){
    // gl_PointSize = 160.0;
    v_Inner = vec4(0.31, 0.24, 0.235, 0.23);
    v_Color = vec3(230.0 / 255.0, 142.0 / 255.0, 175.0 / 255.0);
  }
  if(a_Level == 4.0){
    // gl_PointSize = 200.0;
    v_Inner = vec4(0.315, 0.235, 0.23, 0.225);
    v_Color = vec3(175.0 / 255.0, 174.0 / 255.0, 210.0 / 255.0);
  }
  if(a_Level == 5.0){
    // gl_PointSize = 240.0;
    v_Inner = vec4(0.316, 0.235, 0.23, 0.225);
    v_Color = vec3(137.0 / 255.0, 188.0 / 255.0, 218.0 / 255.0);
  }
  if(a_Level == 6.0){
    // gl_PointSize = 280.0;
    v_Inner = vec4(0.32, 0.24, 0.235, 0.23);
    v_Color = vec3(139.0 / 255.0, 200.0 / 255.0, 186.0 / 255.0);
  }
  if(a_Level == 7.0){
    // gl_PointSize = 320.0;
    v_Inner = vec4(0.32, 0.24, 0.235, 0.23);
    v_Color = vec3(188.0 / 255.0, 196.0 / 255.0, 104.0 / 255.0);
  }
}