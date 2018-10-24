#ifdef GL_ES
precision mediump float;
#endif

varying vec2 v_texcoord;
uniform sampler2D u_sceneMap;

void main(){
  vec4 mapColor = texture2D(u_sceneMap, v_texcoord);
  vec4 color = vec4(1.0, 0.0, 0.0, 1.0) * smoothstep(0.7, 0.9, mapColor.r);
  gl_FragColor = color;
}