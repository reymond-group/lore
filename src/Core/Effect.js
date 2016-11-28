Lore.Effect = function(renderer, shaderName) {
    this.renderer = renderer;
    this.gl = this.renderer.gl;

    this.framebuffer = this.initFramebuffer();
    this.texture = this.initTexture();
    this.renderbuffer = this.initRenderbuffer();

    this.shader = this.renderer.shaders[this.renderer.createProgram(Lore.Shaders[shaderName])];

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
}

Lore.Effect.prototype = {
    constructor: Lore.Effect,

    initBuffer: function() {
      var g = this.gl;
      var texCoordLocation = g.getAttribLocation(this.shader.program, 'v_coord');

      // provide texture coordinates for the rectangle.
      var texCoordBuffer = g.createBuffer();
      g.bindBuffer(g.ARRAY_BUFFER, texCoordBuffer);
      g.bufferData(g.ARRAY_BUFFER, new Float32Array([
           1.0,  1.0,
          -1.0,  1.0,
          -1.0, -1.0,
          -1.0, -1.0,
           1.0, -1.0,
           1.0,  1.0]), g.STATIC_DRAW);

      g.enableVertexAttribArray(texCoordLocation);
      g.vertexAttribPointer(texCoordLocation, 2, g.FLOAT, false, 0, 0);

      return texCoordBuffer;
    },

    initTexture: function() {
        var g = this.gl;

        var texture = g.createTexture();
        g.bindTexture(g.TEXTURE_2D, texture);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);

        g.bindTexture(g.TEXTURE_2D, texture);
        g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, this.renderer.getWidth(), this.renderer.getHeight(), 0, g.RGBA, g.UNSIGNED_BYTE, null);

        g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, texture, 0);

        return texture;
    },

    initFramebuffer: function() {
        var g = this.gl;

        var framebuffer = g.createFramebuffer();
        g.bindFramebuffer(g.FRAMEBUFFER, framebuffer);
        return framebuffer;
    },

    initRenderbuffer: function() {
      var g = this.gl;

      var renderbuffer = g.createRenderbuffer();
      g.bindRenderbuffer(g.RENDERBUFFER, renderbuffer);

      g.renderbufferStorage(g.RENDERBUFFER, g.DEPTH_COMPONENT16, this.renderer.getWidth(), this.renderer.getHeight());
      g.framebufferRenderbuffer(g.FRAMEBUFFER, g.DEPTH_ATTACHMENT, g.RENDERBUFFER, renderbuffer);

      // g.renderbufferStorage(g.RENDERBUFFER, g.DEPTH_STENCIL, this.renderer.getWidth(), this.renderer.getHeight());
      // g.framebufferRenderbuffer(g.FRAMEBUFFER, g.DEPTH_STENCIL_ATTACHMENT, g.RENDERBUFFER, renderbuffer);

      return renderbuffer;
    },

    bind: function() {
        var g = this.gl;
        g.bindFramebuffer(g.FRAMEBUFFER, this.framebuffer);
        g.clear(g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT);
    },

    unbind: function() {
        var g = this.gl;
        g.bindRenderbuffer(g.RENDERBUFFER, null);
        g.bindFramebuffer(g.FRAMEBUFFER, null);

        this.initBuffer();
        this.shader.use();
        g.drawArrays(g.TRIANGLES, 0, 6);
    }
}
