Lore.Shaders['coordinates'] = new Lore.Shader('Coordinates', { }, [
    'attribute vec3 position;',
    'attribute vec3 color;',
    'varying vec3 vColor;',
    'void main() {',
        'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
        'vec4 mv_pos = modelViewMatrix * vec4(position, 1.0);',
        'gl_PointSize = 1.0;',
        'vColor = color;',
    '}'
], [
    'varying vec3 vColor;',
    'void main() {',
        'gl_FragColor = vec4(vColor, 1.0);',
    '}'
]);
