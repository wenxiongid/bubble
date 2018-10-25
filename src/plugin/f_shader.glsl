#ifdef GL_ES
precision mediump float;
#endif

varying vec4 v_Inner;

void main(){
  float d = length(gl_PointCoord - vec2(0.5, 0.5));
  float l = smoothstep(v_Inner.x, v_Inner.y, d) - smoothstep(v_Inner.z, v_Inner.w, d);
  gl_FragColor = vec4(l);
}