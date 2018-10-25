const MAPSIZE = 1024;

class GLRenderer {
  constructor(canvas, vshader, fshader, sceneVShader, sceneFShader) {
    this.canvas = canvas;
    this.gl = getWebGLContext(canvas);
    if (!this.gl) {
      console.log("Failed to get the rendering context for WebGL");
      return;
    }
    // this.attributeLocation = {};
    // this.uniformLocation = {};
    this.pointProgram = createProgram(this.gl, vshader, fshader);
    this.pointProgram.attributeLocation = {};
    this.pointProgram.uniformLocation = {};

    this.sceneProgram = createProgram(this.gl, sceneVShader, sceneFShader);
    this.sceneProgram.attributeLocation = {};
    this.sceneProgram.uniformLocation = {};

    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);
    this.gl.enable(this.gl.BLEND);
    this.gl.clearColor(0, 0, 0, 0.0);

    this.fbo = this.initFramebufferObject(this.gl);
    if (!this.fbo) {
      console.log("Failed to intialize the framebuffer object (FBO)");
      return;
    }
    // this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.fbo.texture);
    this.setAttribute(
      this.sceneProgram,
      "a_texcoord",
      new Float32Array([
        0.0,
        0.0,

        1.0,
        0.0,

        0.0,
        1.0,

        0.0,
        1.0,

        1.0,
        0.0,

        1.0,
        1.0
      ]),
      2,
      "FLOAT"
    );
    this.setAttribute(
      this.sceneProgram,
      "a_Position",
      new Float32Array([
        -1.0,
        -1.0,

        1.0,
        -1.0,

        -1.0,
        1.0,

        -1.0,
        1.0,

        1.0,
        -1.0,

        1.0,
        1.0
      ]),
      2,
      "FLOAT"
    );
    this.setUniform2v(this.sceneProgram, "u_resolution", [
      canvas.width,
      canvas.height
    ]);
  }
  setUniform2v(program, name, data) {
    let location;
    if (program.uniformLocation[name]) {
      location = program.uniformLocation[name];
    } else {
      location = this.gl.getUniformLocation(program, name);
      program[name] = location;
    }
    if (location < 0) {
      console.log(`Failed to get the storage location of ${name}`);
      return false;
    }
    let dataArray = new Float32Array(data);
    this.gl.useProgram(program);
    this.gl.uniform2fv.call(this.gl, location, dataArray);
  }
  setUniform1i(program, name, data){
    let location;
    if (program.uniformLocation[name]) {
      location = program.uniformLocation[name];
    } else {
      location = this.gl.getUniformLocation(program, name);
      program[name] = location;
    }
    if (location < 0) {
      console.log(`Failed to get the storage location of ${name}`);
      return false;
    }
    this.gl.useProgram(program);
    this.gl.uniform1i.call(this.gl, location, data);
  };
  setAttribute(program, name, data, num, typeName) {
    // console.log(name, data);
    let location;
    if (program.attributeLocation[name] && program.attributeLocation[name] >= 0) {
      location = program.attributeLocation[name];
    } else {
      location = this.gl.getAttribLocation(program, name);
      program.attributeLocation[name] = location;
    }
    if (location < 0) {
      console.log(`Failed to get the storage location of ${name}`);
      return false;
    }
    let buffer = this.gl.createBuffer();
    if (!buffer) {
      console.log("Failed to create the buffer object");
      return false;
    }
    this.gl.useProgram(program);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(location, num, this.gl[typeName], false, 0, 0);
    this.gl.enableVertexAttribArray(location);

    return true;
  }
  drawPoint(count) {
    let _this = this;
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbo);
    // this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    this.gl.viewport(0, 0, _this.canvas.width, _this.canvas.height);
    // Set view port for FBO
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.useProgram(this.pointProgram);
    this.gl.drawArrays(this.gl.POINTS, 0, count);
  }
  drawScene() {
    let _this = this;
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    this.gl.viewport(0, 0, _this.canvas.width, _this.canvas.height); // Set view port for FBO
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.useProgram(this.sceneProgram);
    this.setAttribute(this.sceneProgram, "a_texcoord", new Float32Array([
        0.0,
        0.0,

        _this.canvas.width / MAPSIZE,
        0.0,

        0.0,
        _this.canvas.height / MAPSIZE,

        0.0,
        _this.canvas.height / MAPSIZE,

        _this.canvas.width / MAPSIZE,
        0.0,

        _this.canvas.width / MAPSIZE,
        _this.canvas.height / MAPSIZE
      ]), 2, "FLOAT");
    this.setAttribute(this.sceneProgram, "a_Position", new Float32Array([
        -1.0,
        -1.0,

        1.0,
        -1.0,

        -1.0,
        1.0,

        -1.0,
        1.0,

        1.0,
        -1.0,

        1.0,
        1.0
      ]), 2, "FLOAT");
    this.setUniform1i(this.sceneProgram, 0);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }
  update(count) {
    this.drawPoint(count);
    this.drawScene();
  }
  initFramebufferObject() {
    let _this = this;
    let gl = _this.gl;
    let framebuffer, texture, depthBuffer;
    let OFFSCREEN_WIDTH = MAPSIZE,
      OFFSCREEN_HEIGHT = MAPSIZE;
    let error = function() {
      if (framebuffer) gl.deleteFramebuffer(framebuffer);
      if (texture) gl.deleteTexture(texture);
      if (depthBuffer) gl.deleteRenderbuffer(depthBuffer);
      return null;
    };
    framebuffer = gl.createFramebuffer();
    if (!framebuffer) {
      console.log("Failed to create frame buffer object");
      return error();
    }
    texture = gl.createTexture(); // Create a texture object
    if (!texture) {
      console.log("Failed to create texture object");
      return error();
    }
    gl.bindTexture(gl.TEXTURE_2D, texture); // Bind the object to target
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      OFFSCREEN_WIDTH,
      OFFSCREEN_HEIGHT,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Create a renderbuffer object and Set its size and parameters
    depthBuffer = gl.createRenderbuffer(); // Create a renderbuffer object
    if (!depthBuffer) {
      console.log("Failed to create renderbuffer object");
      return error();
    }
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer); // Bind the object to target
    gl.renderbufferStorage(
      gl.RENDERBUFFER,
      gl.DEPTH_COMPONENT16,
      OFFSCREEN_WIDTH,
      OFFSCREEN_HEIGHT
    );

    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

    framebuffer.texture = texture; // Store the texture object

    // Check if FBO is configured correctly
    var e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (gl.FRAMEBUFFER_COMPLETE !== e) {
      console.log("Frame buffer object is incomplete: " + e.toString());
      return error();
    }

    // Unbind the buffer object
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);

    return framebuffer;
  }
}

export {
  GLRenderer as default
};