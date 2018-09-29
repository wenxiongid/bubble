#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform sampler2D u_Sampler;
varying vec2 v_texcoord;

void main(){
  vec4 color = texture2D(u_Sampler, v_texcoord);
  color = vec4(smoothstep(0.5, 0.6, color.r));
  gl_FragColor = vec4(color);
}