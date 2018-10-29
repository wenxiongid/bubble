uniform int group;
attribute vec2 a_Position;
attribute float a_Level;
attribute float a_PointSize;
// varying vec4 v_Inner;
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