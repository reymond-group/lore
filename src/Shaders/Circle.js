Lore.Shaders['circle'] = new Lore.Shader('Circle', {}, [
    'attribute vec3 position;',
    'attribute vec3 color;',
    'varying vec3 vColor;',
    'void main() {',
        'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
        'gl_PointSize = 6.0;',
        'vColor = color;',
    '}'
], [
    'varying vec3 vColor;',
    'void main() {',
        'float r = 0.0, delta = 0.0, alpha = 1.0;',
        'vec2 cxy = 2.0 * gl_PointCoord - 1.0;',
        'r = dot(cxy, cxy);',
        '//#ifdef GL_OES_standard_derivatives',
            '//delta = fwidth(r);',
            '//alpha = 1.0 - smoothstep(1.0 - delta, 1.0 + delta, r);',
        '//#else',
            'if(r > 1.0) discard;',
        '//#endif',
        'gl_FragColor = vec4(vColor, alpha);',
    '}'
]);
