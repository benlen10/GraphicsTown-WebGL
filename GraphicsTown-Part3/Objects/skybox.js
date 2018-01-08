
var Skybox = undefined;

(function () {
    "use strict";

    var shaderProgram = undefined;
    var buffers = undefined;

    // Skybox constructor
    Skybox = function Skybox(name, position, size, color) {
        this.name = name;
        this.position = position || [0, 0, 0];
        this.size = size || 1.0;
        this.color = color;
        this.texture = null;
    }

    Skybox.prototype.init = function (drawingState) {
        var gl = drawingState.gl;
        shaderProgram = twgl.createProgramInfo(gl, ["nightsky-vs", "nightsky-fs"]);
        if (!buffers) {
            var arrays = {
                vpos: {
                    numComponents: 3, data: [
                        1, -1, -1,
                        -1, -1, -1,
                        -1, 1, -1,

                        1, 1, -1,
                        1, 1, 1,
                        1, -1, 1,

                        1, -1, -1,
                        1, 1, -1,
                        1, 1, 1,

                        1, 1, -1,
                        -1, 1, -1,
                        -1, 1, 1,

                        -1, 1, 1,
                        -1, 1, -1,
                        -1, -1, -1,

                        -1, -1, 1,
                        -1, -1, -1,
                        1, -1, -1,

                        1, -1, 1,
                        -1, -1, 1,
                        1, 1, 1,

                        -1, 1, 1,
                        -1, -1, 1,
                        1, -1, 1
                    ]
                },
                vnormal: {
                    numComponents: 3, data: [
                        0, 0, -1,
                        0, 0, -1,
                        0, 0, -1,

                        0, 0, -1,
                        0, 0, -1,
                        0, 0, -1,

                        0, 0, -1,
                        0, 0, -1,
                        0, 0, -1,

                        0, 0, -1,
                        0, 0, -1,
                        0, 0, -1,

                        0, 0, -1,
                        0, 0, -1,
                        0, 0, -1,

                        0, 0, -1,
                        0, 0, -1,
                        0, 0, -1,

                        0, 0, -1,
                        0, 0, -1,
                        0, 0, -1,

                        0, 0, -1,
                        0, 0, -1,
                        0, 0, -1,

                        0, 0, -1,
                        0, 0, -1,
                        0, 0, -1,

                        0, 0, -1,
                        0, 0, -1,
                        0, 0, -1,

                        0, 0, -1,
                        0, 0, -1,
                        0, 0, -1,

                        0, 0, -1,
                        0, 0, -1,
                        0, 0, -1,
                    ]
                },
                vTex: {
                    numComponents: 2,
                    data: [
                        0.5, 0.75,
                        0.25, 0.75,

                        0.25, 0.5,
                        0.5, 0.5,

                        0.75, 0.50,
                        0.75, 0.75,

                        0.5, 0.75,
                        0.5, 0.50,

                        0.485, 0.25,
                        0.485, 0.5,

                        0.26, 0.5,
                        0.26, .25,

                        0, 0.50,
                        0.25, 0.50,

                        0.25, 0.75,
                        0.0, 0.75,

                        0.26, 1.0,
                        0.49, 1.0,

                        0.49, 0.76,
                        0.25, 0.76,

                        0.75, 0.5,
                        1.0, 0.5,

                        1.0, 0.75,
                        0.75, 0.75
                    ]
                },
                indices: [
                    0, 1, 2,
                    0, 2, 3,
                    4, 5, 6,

                    4, 6, 7,
                    8, 9, 10,
                    8, 10, 11,

                    12, 13, 14,
                    12, 14, 15,
                    16, 17, 18,

                    16, 18, 19,
                    20, 21, 22,
                    20, 22, 23
                ]
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl, arrays);

            var textureTri = gl.createTexture();
            gl.activeTexture(gl.TEXTURE7);
            gl.bindTexture(gl.TEXTURE_2D, textureTri);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

            var skyboxImage = new Image();
            skyboxImage.crossOrigin = "origin";

            // Full Source URL: [url=https://flic.kr/p/224yTiE][img]https://farm5.staticflickr.com/4533/38765414972_201f040946.jpg[/img][/url][url=https://flic.kr/p/224yTiE]night_sky_texture1[/url] by [url=https://www.flickr.com/photos/160869673@N02/]Ben Len[/url], on Flickr
            skyboxImage.src = "https://farm5.staticflickr.com/4533/38765414972_201f040946.jpg";
            window.setTimeout(skyboxImage.onload, 200);
            skyboxImage.onload = function () {

                gl.activeTexture(gl.TEXTURE7);
                gl.bindTexture(gl.TEXTURE_2D, textureTri);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, skyboxImage);

                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            }
        }
    };

    Skybox.prototype.draw = function (drawingState) {
        var modelM = twgl.m4.scaling([this.size, this.size, this.size]);
        twgl.m4.setTranslation(modelM, this.position, modelM);
        var gl = drawingState.gl;

        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl, shaderProgram, buffers);
        twgl.setUniforms(shaderProgram,
            {
                view: drawingState.view,
                proj: drawingState.proj,
                lightdir: drawingState.sunDirection,
                cubecolor: this.color,
                model: modelM
            });
        shaderProgram.program.texSamplerSky = gl.getUniformLocation(shaderProgram.program, "texSamplerSky");
        gl.uniform1i(shaderProgram.program.texSamplerSky, 7);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    
    Skybox.prototype.center = function (drawingState) {
        return this.position;
    }
})();