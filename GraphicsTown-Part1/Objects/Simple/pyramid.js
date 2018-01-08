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

    };
    Pyramid.prototype.draw = function (drawingState) {
        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.scaling([this.size, this.size, this.size]);
        twgl.m4.setTranslation(modelM, this.position, modelM);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
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

