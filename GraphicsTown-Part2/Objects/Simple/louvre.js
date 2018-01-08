var Pyramid = undefined;

(function () {
    "use strict";

    var shaderProgram = undefined;
    var buffers = undefined;

    Pyramid = function Pyramid(name, position, size, color) {
        this.name = name;
        this.position = position || [0, 0, 0];
        this.size = size || 1.0;
        this.color = color || [.7, .8, .9];
    }
    Pyramid.prototype.init = function (drawingState) {
        var gl = drawingState.gl;

        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["reflective-vs", "reflective-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos: {
                    numComponents: 3, data: [
                        -0.5, 0.0, -0.5,
                        0.5, 0.0, -0.5,
                        0.0, 1.0, 0.0,

                        0.5, 0.0, -0.5,
                        0.5, 0.0, 0.5,
                        0.0, 1.0, 0.0,

                        0.5, 0.0, 0.5,
                        -0.5, 0.0, 0.5,
                        0.0, 1.0, 0.0,

                        -0.5, 0.0, 0.5,
                        -0.5, 0.0, -0.5,
                        0.0, 1.0, 0.0,
                    ]
                },
                vnormal: {
                    numComponents: 3, data: [
                        0.9, 0.9, 0.5,
                        0.9, 0.9, 0.5,
                        0.9, 0.9, 0.5,

                        0.5, 0.9, 0.9,
                        0.5, 0.9, 0.9,
                        0.5, 0.9, 0.9,

                        0.9, 0.5, 0.9,
                        0.9, 0.5, 0.9,
                        0.9, 0.5, 0.9,

                        0.5, 0.9, 0.5,
                        0.5, 0.9, 0.5,
                        0.5, 0.9, 0.5,
                    ]
                }
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl, arrays);
        }
        shaderProgram.program.texSampler1 = gl.getUniformLocation(shaderProgram.program, "texSampler1");
        gl.uniform1i(shaderProgram.texSampler1, 0);

        var louvreTexture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, louvreTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        var louvreImage = new Image();
        louvreImage.crossOrigin = "anonymous";

        //[url=https://flic.kr/p/ZCAnT4][img]https://farm5.staticflickr.com/4583/37826437045_b7f00e7ee6.jpg[/img][/url][url=https://flic.kr/p/ZCAnT4]louvre-glass-texture[/url] by [url=https://www.flickr.com/photos/160869673@N02/]Ben Len[/url], on Flickr
        louvreImage.src = "https://farm5.staticflickr.com/4583/37826437045_b7f00e7ee6.jpg";
        window.setTimeout(louvreImage.onload, 200);
        louvreImage.onload = function LoadTexture() {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, louvreTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, louvreImage);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
    };
    Pyramid.prototype.draw = function (drawingState) {

        var modelM = twgl.m4.scaling([this.size, this.size, this.size]);
        twgl.m4.setTranslation(modelM, this.position, modelM);

        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl, shaderProgram, buffers);
        twgl.setUniforms(shaderProgram, {
            view: drawingState.view, proj: drawingState.proj, lightdir: drawingState.sunDirection,
            cubecolor: this.color, model: modelM
        });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    Pyramid.prototype.center = function (drawingState) {
        return this.position;
    }
})();

