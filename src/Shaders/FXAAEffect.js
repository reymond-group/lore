Lore.Shaders['fxaaEffect'] = new Lore.Shader('FXAAEffect', {}, [
    'attribute vec2 v_coord;',
    'uniform sampler2D fbo_texture;',
    'varying vec2 f_texcoord;',
    'void main() {',
        'gl_Position = vec4(v_coord, 0.0, 1.0);',
        'f_texcoord = (v_coord + 1.0) / 2.0;',
    '}'
], [
    '#define FXAA_REDUCE_MIN   (1.0/ 128.0)',
    '#define FXAA_REDUCE_MUL   (1.0 / 8.0)',
    '#define FXAA_SPAN_MAX     8.0',

    'vec4 applyFXAA(vec2 fragCoord, sampler2D tex, vec2 resolution)',
    '{',
        'fragCoord = fragCoord * resolution;',
        'vec2 inverseVP = vec2(1.0 / 500.0, 1.0 / 500.0);',
        'vec3 rgbNW = texture2D(tex, (fragCoord.xy + vec2(-1.0, -1.0)) * inverseVP).xyz;',
        'vec3 rgbNE = texture2D(tex, (fragCoord.xy + vec2(1.0, -1.0)) * inverseVP).xyz;',
        'vec3 rgbSW = texture2D(tex, (fragCoord.xy + vec2(-1.0, 1.0)) * inverseVP).xyz;',
        'vec3 rgbSE = texture2D(tex, (fragCoord.xy + vec2(1.0, 1.0)) * inverseVP).xyz;',
        'vec4 rgbaM  = texture2D(tex, fragCoord.xy  * inverseVP);',
        'vec3 rgbM = rgbaM.xyz;',
        'float opacity = rgbaM.w;',
        'vec3 luma = vec3(0.299, 0.587, 0.114);',
        'float lumaNW = dot(rgbNW, luma);',
        'float lumaNE = dot(rgbNE, luma);',
        'float lumaSW = dot(rgbSW, luma);',
        'float lumaSE = dot(rgbSE, luma);',
        'float lumaM  = dot(rgbM,  luma);',
        'float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));',
        'float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));',

        'vec2 dir;',
        'dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));',
        'dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));',

        'float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) * (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);',
        'float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);',

        'dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX), max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX), dir * rcpDirMin)) * inverseVP;',

        'vec3 rgbA = 0.5 * (texture2D(tex, fragCoord.xy * inverseVP + dir * (1.0 / 3.0 - 0.5)).xyz +',
                           'texture2D(tex, fragCoord.xy * inverseVP + dir * (2.0 / 3.0 - 0.5)).xyz);',

        'vec3 rgbB = rgbA * 0.5 + 0.25 * (texture2D(tex, fragCoord * inverseVP + dir * -0.5).xyz +',
                                         'texture2D(tex, fragCoord.xy * inverseVP + dir * 0.5).xyz);',

        'float lumaB = dot(rgbB, luma);',
        'if ((lumaB < lumaMin) || (lumaB > lumaMax))',
            'return vec4(rgbA, opacity);',
        'else',
            'return vec4(rgbB, opacity);',
    '}',

    'uniform sampler2D fbo_texture;',
    'varying vec2 f_texcoord;',
    'void main(void) {',
        'gl_FragColor = applyFXAA(f_texcoord, fbo_texture, vec2(500.0, 500.0));',
    '}'
]);
