#ifdef GL_ES
precision mediump float;
#endif

void main(){
  float d = 1.0 - smoothstep(0.2, 0.45, length(gl_PointCoord - vec2(0.5, 0.5)));
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0) * d;
}