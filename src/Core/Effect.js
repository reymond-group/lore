Lore.Effect = function(gl, width, height, shader) {
    this.gl = gl;
    this.fb = gl.createFramebuffer();
    this.tex = gl.createTexture();
    this.width = width;
    this.height = height;
    this.shader = shader;
}


Lore.Effect.prototype = {
    constructor: Lore.Effect,
    
    getWidth: function() { return this.width; },
    setWidth: function(width) { this.width = width; },

    getHeight: function() { return this.height; },
    setHeight: function(height) { this.height = height; },

    setTextureFromCanvas: function(tex, canvas) {
        var g = this.gl;
        g.bindTexture(g.TEXTURE_2D, tex);
        g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, canvas);
    },

    bind: function() {
        var g = this.gl;
        g.bindFramebuffer(g.FRAMEBUFFER, this.fb);
        g.bindTexture(g.TEXTURE_2D, this.tex);
    
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);

        g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, this.width, this.height, 0, g.RGBA, g.UNSIGNED_BYTE, null);
        g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, this.tex, 0);
        
        // Bind shader
        g.useProgram(this.shader.program);
        
        g.drawArrays(g.TRIANGLES, 0, 6);
    }
}



