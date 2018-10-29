#ifdef GL_ES
precision mediump float;
#endif

varying vec2 v_texcoord;
uniform sampler2D u_sceneMap;
uniform vec2 u_resolution;

void main(){
  vec4 mapColor = texture2D(u_sceneMap, v_texcoord);
  float d = 0.0;
  vec4 color = vec4(0.0);
  if(mapColor.r > 0.0){
    d = smoothstep(0.65, 0.7, mapColor.r);
    color += vec4(1.0, 0.0, 0.0, 1.0) * d;
  }
  if(mapColor.g > 0.0){
    d = smoothstep(0.65, 0.7, mapColor.g);
    color += vec4(0.0, 1.0, 0.0, 1.0) * d;
  }
  if(mapColor.b > 0.0){
    d = smoothstep(0.65, 0.7, mapColor.b);
    color += vec4(0.0, 0.0, 1.0, 1.0) * d;
  }
  gl_FragColor = color;
  // gl_FragColor = mapColor;
}