#ifdef GL_ES
precision mediump float;
#endif

varying vec4 v_Inner;
varying vec3 v_Color;

void main(){
  float d = length(gl_PointCoord - vec2(0.5, 0.5));
  float fill = smoothstep(v_Inner.z + 0.01, v_Inner.w, d);
  float l = smoothstep(v_Inner.x, v_Inner.y, d) - smoothstep(v_Inner.z, v_Inner.w, d);
  gl_FragColor = mix(vec4(v_Color, 0.9), vec4(0.863, 0.196, 0.184, 1.0) * l, 1.0 - fill);
  // gl_FragColor = vec4(0.863, 0.196, 0.184, 1.0) * l;
  // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}