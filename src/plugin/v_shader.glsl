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
    v_Color = vec3(181.0 / 255.0, 137.0 / 255.0, 0.0);
  }
  if(a_Level == 2.0){
    // gl_PointSize = 120.0;
    v_Inner = vec4(0.3, 0.24, 0.235, 0.23);
    v_Color = vec3(203.0 / 255.0, 75.0 / 255.0, 22.0 / 255.0);
  }
  if(a_Level == 3.0){
    // gl_PointSize = 160.0;
    v_Inner = vec4(0.31, 0.24, 0.235, 0.23);
    v_Color = vec3(211.0 / 255.0, 54.0 / 255.0, 130.0 / 255.0);
  }
  if(a_Level == 4.0){
    // gl_PointSize = 200.0;
    v_Inner = vec4(0.315, 0.235, 0.23, 0.225);
    v_Color = vec3(108.0 / 255.0, 113.0 / 255.0, 196.0 / 255.0);
  }
  if(a_Level == 5.0){
    // gl_PointSize = 240.0;
    v_Inner = vec4(0.316, 0.235, 0.23, 0.225);
    v_Color = vec3(38.0 / 255.0, 139.0 / 255.0, 210.0 / 255.0);
  }
  if(a_Level == 6.0){
    // gl_PointSize = 280.0;
    v_Inner = vec4(0.32, 0.24, 0.235, 0.23);
    v_Color = vec3(42.0 / 255.0, 161.0 / 255.0, 152.0 / 255.0);
  }
  if(a_Level == 7.0){
    // gl_PointSize = 320.0;
    v_Inner = vec4(0.32, 0.24, 0.235, 0.23);
    v_Color = vec3(133.0 / 255.0, 153.0 / 255.0, 0.0 / 255.0);
  }
}