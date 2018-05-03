//@ts-check

const Shaders = require('../Shaders');

class Effect {
    constructor(renderer, shaderName) {
        this.renderer = renderer;
        this.gl = this.renderer.gl;

        this.framebuffer = this.initFramebuffer();
        this.texture = this.initTexture();
        this.renderbuffer = this.initRenderbuffer();
        this.shader = Shaders[shaderName].clone();
        this.shader.init(this.renderer.gl);

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }

    initBuffer() {
      let g = this.gl;
      let texCoordLocation = g.getAttribLocation(this.shader.program, 'v_coord');

      // provide texture coordinates for the rectangle.
      let texCoordBuffer = g.createBuffer();
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
    }

    initTexture() {
        let g = this.gl;

        let texture = g.createTexture();
        g.bindTexture(g.TEXTURE_2D, texture);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);

        g.bindTexture(g.TEXTURE_2D, texture);
        g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, this.renderer.getWidth(), this.renderer.getHeight(), 0, g.RGBA, g.UNSIGNED_BYTE, null);

        g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, texture, 0);

        return texture;
    }

    initFramebuffer() {
        let g = this.gl;

        let framebuffer = g.createFramebuffer();
        g.bindFramebuffer(g.FRAMEBUFFER, framebuffer);
        return framebuffer;
    }

    initRenderbuffer() {
      let g = this.gl;

      let renderbuffer = g.createRenderbuffer();
      g.bindRenderbuffer(g.RENDERBUFFER, renderbuffer);

      g.renderbufferStorage(g.RENDERBUFFER, g.DEPTH_COMPONENT16, this.renderer.getWidth(), this.renderer.getHeight());
      g.framebufferRenderbuffer(g.FRAMEBUFFER, g.DEPTH_ATTACHMENT, g.RENDERBUFFER, renderbuffer);

      // g.renderbufferStorage(g.RENDERBUFFER, g.DEPTH_STENCIL, this.renderer.getWidth(), this.renderer.getHeight());
      // g.framebufferRenderbuffer(g.FRAMEBUFFER, g.DEPTH_STENCIL_ATTACHMENT, g.RENDERBUFFER, renderbuffer);

      return renderbuffer;
    }

    bind() {
        let g = this.gl;
        g.bindFramebuffer(g.FRAMEBUFFER, this.framebuffer);
        g.clear(g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT);
    }

    unbind() {
        let g = this.gl;
        g.bindRenderbuffer(g.RENDERBUFFER, null);
        g.bindFramebuffer(g.FRAMEBUFFER, null);

        this.initBuffer();
        this.shader.use();
        g.drawArrays(g.TRIANGLES, 0, 6);
    }
}

module.exports = Effect