module.exports = new Lore.Shader('sphere', 1, { size: new Lore.Uniform('size', 5.0, 'float'),
                                                        cutoff: new Lore.Uniform('cutoff', 0.0, 'float'),
                                                        clearColor: new Lore.Uniform('clearColor', [1.0, 1.0, 1.0, 1.0], 'float_vec4') }, [
    'uniform float size;',
    'uniform float cutoff;',
    'attribute vec3 position;',
    'attribute vec3 color;',
    'varying vec3 vColor;',
    'varying float vDiscard;',
    'vec3 rgb2hsv(vec3 c) {',
        'vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);',
        'vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));',
        'vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));',

        'float d = q.x - min(q.w, q.y);',
        'float e = 1.0e-10;',
        'return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);',
    '}',
    'vec3 hsv2rgb(vec3 c) {',
        'vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);',
        'vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);',
        'return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);',
    '}',
    'void main() {',
        'vec3 hsv = vec3(color.r, color.g, 1.0);',
        'float saturation = color.g;',
        'float point_size = color.b;',
        'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
        'vec4 mv_pos = modelViewMatrix * vec4(position, 1.0);',
        'vDiscard = 0.0;',
        'if(-mv_pos.z < cutoff || point_size <= 0.0 || mv_pos.z > 0.0) {',
            'vDiscard = 1.0;',
            'return;',
        '}',
        'gl_PointSize = point_size * size;',
        'vColor = hsv2rgb(hsv);',
    '}'
], [
    'uniform vec4 clearColor;',
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
        'vec3 v = normalize(vec3(0.1, -0.2, 1.0));',
        'vec3 h = normalize(light_dir + v);',
        'float specular = pow(max(0.0, dot(N, h)), 100.0);',
        '// specular += 0.1 * rand(gl_PointCoord);',
        'float fogIntensity = (gl_FragCoord.z / gl_FragCoord.w);',
        'fogIntensity = fogIntensity + fogIntensity * 2.0;',
        'fogIntensity *= clearColor.w;',
        'vec3 color = vColor * diffuse + specular * 0.5;',
        'gl_FragColor = mix(vec4(color, 1.0), clearColor, fogIntensity);',
    '}'
]);
