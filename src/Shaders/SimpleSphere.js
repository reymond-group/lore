const Shader = require('../Core/Shader')
const Uniform = require('../Core/Uniform')

module.exports = new Shader('simpleSphere', 1, { size: new Uniform('size', 5.0, 'float'),
                                                 cutoff: new Uniform('cutoff', 0.0, 'float'),
                                                 clearColor: new Uniform('clearColor', [0.0, 0.0, 0.0, 1.0], 'float_vec4'),
                                                 fogDensity: new Uniform('fogDensity', 6.0, 'float') }, [
    'uniform float size;',
    'uniform float cutoff;',
    'attribute vec3 position;',
    'attribute vec3 color;',
    'varying vec3 vColor;',
    'varying float vDiscard;',
    'vec3 floatToRgb(float n) {',
        'float b = floor(n / 65536.0);',
        'float g = floor((n - b * 65536.0) / 256.0);',
        'float r = floor(n - b * 65536.0 - g * 256.0);',
        'return vec3(r / 255.0, g / 255.0, b / 255.0);',
    '}',
    'void main() {',
        'float point_size = color.b;',
        'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
        'vec4 mv_pos = modelViewMatrix * vec4(position, 1.0);',
        'vDiscard = 0.0;',
        'if(-mv_pos.z < cutoff || point_size <= 0.0 || mv_pos.z > 0.0) {',
            'vDiscard = 1.0;',
            'return;',
        '}',
        'gl_PointSize = point_size * size;',
        'vColor = floatToRgb(color.r);',
    '}'
], [
    'uniform vec4 clearColor;',
    'uniform float fogDensity;',
    'varying vec3 vColor;',
    'varying float vDiscard;',
    'float rand(vec2 co) {',
        'return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);',
    '}',
    'void main() {',
        'if(vDiscard > 0.5) discard;',
        'vec3 N;',
        'N.xy = gl_PointCoord * 2.0 - vec2(1.0);',
        'float mag = dot(N.xy, N.xy);',
        'if (mag > 1.0) discard;   // discard fragments outside circle',
        'N.z = sqrt(1.0 - mag);',
        'vec3 light_dir = vec3(0.25, -0.25, 1.0);',
        'float diffuse = max(0.25, dot(light_dir, N));',
        'float z = gl_FragCoord.z / gl_FragCoord.w;',
        'float fog_factor = clamp(exp2(-fogDensity * fogDensity * z * z * 1.442695), 0.025, 1.0);',
        'vec3 color = vColor * diffuse;',
        'gl_FragColor = mix(clearColor, vec4(color, 1.0), fog_factor);',
    '}'
], 'circle');
