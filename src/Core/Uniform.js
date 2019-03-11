//@ts-check

/**
 * A class representing a uniform.
 * 
 * @property {String} name The name of this uniform. Also the variable name in the shader.
 * @property {Number|number[]|Float32Array} value The value of this uniform.
 * @property {String} type The type of this uniform. Available types: int, int_vec2, int_vec3, int_vec4, int_array, float, float_vec2, float_vec3, float_vec4, float_array, float_mat2, float_mat3, float_mat4.
 * @property {Boolean} stale A boolean indicating whether or not this uniform is stale and needs to be updated.
 */
class Uniform {
    /**
     * Creates an instance of Uniform.
     * @param {String} name The name of this uniform. Also the variable name in the shader.
     * @param {Number|number[]|Float32Array} value The value of this uniform.
     * @param {String} type The type of this uniform. Available types: int, int_vec2, int_vec3, int_vec4, int_array, float, float_vec2, float_vec3, float_vec4, float_array, float_mat2, float_mat3, float_mat4.
     */
    constructor(name, value, type) {
        this.name = name;
        this.value = value;
        this.type = type;
        this.stale = true;
    }

    /**
     * Set the value of this uniform.
     * 
     * @param {Number} value A number which is valid for the specified type.
     */
    setValue(value) {
        this.value = value;
        this.stale = true;
    }

    /**
     * Pushes the uniform to the GPU.
     * 
     * @param {WebGLRenderingContext} gl A WebGL rendering context.
     * @param {WebGLUniformLocation} program 
     * @param {Uniform} uniform 
     */
    static Set(gl, program, uniform) {
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
}

module.exports = Uniform