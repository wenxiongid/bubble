#ifdef GL_ES
precision mediump float;
#endif

varying vec2 v_texcoord;
uniform sampler2D u_sceneMap;
uniform vec2 u_resolution;

void main(){
  vec4 mapColor = texture2D(u_sceneMap, v_texcoord);
  float d = smoothstep(0.65, 0.70, mapColor.a);
  gl_FragColor = vec4(mapColor.rgb * d, 1.0);
}