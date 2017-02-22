Lore.Uniform = function(name, value, type) {
    this.name = name;
    this.value = value;
    this.type = type;
    this.stale = true;
}

Lore.Uniform.prototype = {
    constructor: Lore.Uniform,

    setValue: function(value) {
        this.value = value;
        this.stale = true;
    }
}

Lore.Uniform.Set = function(gl, program, uniform) {
    let location = gl.getUniformLocation(program, uniform.name);

    if (uniform.type === 'int') {
        gl.uniform1i(location, uniform.value);
    } else if (uniform.type === 'int_vec2') {
        gl.uniform2iv(location, uniform.value);
    } else if (uniform.type === 'int_vec3') {
        gl.uniform3iv(location, uniform.value);
    } else if (uniform.type === 'int_vec4') {
        gl.uniform4iv(location, uniform.value);
    } else if (uniform.type === 'int_array') {
        gl.uniform1iv(location, uniform.value);
    } else if (uniform.type === 'float') {
        gl.uniform1f(location, uniform.value);
    } else if (uniform.type === 'float_vec2') {
        gl.uniform2fv(location, uniform.value);
    } else if (uniform.type === 'float_vec3') {
        gl.uniform3fv(location, uniform.value);
    } else if (uniform.type === 'float_vec4') {
        gl.uniform4fv(location, uniform.value);
    } else if (uniform.type === 'float_array') {
        gl.uniform1fv(location, uniform.value);
    } else if (uniform.type === 'float_mat2') {
        // false, see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniformMatrix
        gl.uniformMatrix2fv(location, false, uniform.value);
    } else if (uniform.type === 'float_mat3') {
        gl.uniformMatrix3fv(location, false, uniform.value);
    } else if (uniform.type === 'float_mat4') {
        gl.uniformMatrix4fv(location, false, uniform.value);
    }

    // TODO: Add SAMPLER_2D and SAMPLER_CUBE

    // Had to set this to true because point sizes did not update...
    uniform.stale = true;
}
