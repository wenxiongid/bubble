#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
// uniform vec2 u_points[6];

// const int COUNT = 6;

void main(){
  // vec2 st = fract(u_resolution.xy - gl_PointCoord);
  float d = distance(gl_PointCoord, vec2(0.5, 0.5));
  vec4 bgColor = vec4(0.0, 0.0, 0.0, 0.0);
  vec4 pointColor = vec4(1.0, 0.0, 0.0, 1.0);
  float v = smoothstep(0.45, 0.0, d);
  // float v2 = smoothstep(1.0, 0.9, v) - smoothstep(1.0, 0.5, v);
  vec4 color = mix(bgColor, pointColor, v);
  gl_FragColor = vec4(color);
}