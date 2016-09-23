Lore.Shaders['fxaa'] = new Lore.Shader('FXAA', {}, [
    'attribute vec2 position;',
    'varying vec2 uv;',
    'void main() {',
        'gl_Position = vec4(position, 0.0, 1.0);',
        'uv = 0.5 * (position + 1.0);',
    '}'
], [
    'varying vec2 uv;',
    'uniform sampler2D t;',
    'void main() {',
        'gl_FragColor = texture2D(t, uv).rgba;',
    '}'
]);
