var Diamond = undefined;
var SpinningDiamond = undefined;

(function () {
    "use strict";

    var shaderProgram = undefined;
    var buffers = undefined;

    Diamond = function Cube(name, position, size, color) {
        this.name = name;
        this.position = position || [0, 0, 0];
        this.size = size || 1.0;
        this.color = color || [.7, .8, .9];
    }
    Diamond.prototype.init = function (drawingState) {
        var gl = drawingState.gl;

        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["cube-vs", "cube-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos: {
                    numComponents: 3, data: [
                        -0.5, 1.0, -0.5,
                        0.5, 1.0, -0.5,
                        0.0, 0.0, 0.0,

                        0.5, 1.0, -0.5,
                        0.5, 1.0, 0.5,
                        0.0, 0.0, 0.0,

                        0.5, 1.0, 0.5,
                        -0.5, 1.0, 0.5,
                        0.0, 0.0, 0.0,

                        -0.5, 1.0, 0.5,
                        -0.5, 1.0, -0.5,
                        0.0, 0.0, 0.0,

                        -0.5, 1.0, -0.5,
                        0.5, 1.0, -0.5,
                        0.0, 2.0, 0.0,

                        0.5, 1.0, -0.5,
                        0.5, 1.0, 0.5,
                        0.0, 2.0, 0.0,

                        0.5, 1.0, 0.5,
                        -0.5, 1.0, 0.5,
                        0.0, 2.0, 0.0,

                        -0.5, 1.0, 0.5,
                        -0.5, 1.0, -0.5,
                        0.0, 2.0, 0.0,
                    ]
                },
                vnormal: {
                    numComponents: 3, data: [
                        0, -1, -1, 0, -1, -1, 0, -1, -1,
                        1, -1, 0, 1, -1, 0, 1, -1, 0,
                        0, -1, 1, 0, -1, 1, 0, -1, -1,
                        -1, -1, 0, -1, -1, 0, -1, -1, 0,

                        0, 1, -1, 0, 1, -1, 0, 1, -1,
                        1, 1, 0, 1, 1, 0, 1, 1, 0,
                        0, 1, 1, 0, 1, 1, 0, 1, 1,
                        -1, 1, 0, -1, 1, 0, -1, 1, 0,
                    ]
                }
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl, arrays);
        }

    };
    Diamond.prototype.draw = function (drawingState) {

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
    Diamond.prototype.center = function (drawingState) {
        return this.position;
    }


    SpinningDiamond = function SpinningDiamond(name, position, size, color, axis) {
        Diamond.apply(this, arguments);
        this.axis = axis || 'X';
    }
    SpinningDiamond.prototype = Object.create(Diamond.prototype);
    SpinningDiamond.prototype.draw = function (drawingState) {
        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.scaling([this.size, this.size, this.size]);
        var theta = Number(drawingState.realtime) / speedSlider.value;
        if (this.axis == 'X') {
            twgl.m4.rotateX(modelM, theta, modelM);
        } else if (this.axis == 'Z') {
            twgl.m4.rotateZ(modelM, theta, modelM);
        } else {
            twgl.m4.rotateY(modelM, theta, modelM);
        }
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
    SpinningDiamond.prototype.center = function (drawingState) {
        return this.position;
    }
})();

