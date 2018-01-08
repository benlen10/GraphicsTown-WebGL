var OfficeBuilding = undefined;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

(function () {
    "use strict";

    var shaderProgram = undefined;
    var buffers = undefined;

    OfficeBuilding = function OfficeBuilding(name, height, position, size, color) {
        this.name = name;
        this.position = position || [0, 0, 0];
        this.size = height || 2.0;
        this.color = color || [.7, .7, .8];
        this.t = height || 2.0;
    }
    OfficeBuilding.prototype.init = function (drawingState) {
        var gl = drawingState.gl;
        var t = OfficeBuilding.height;

        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["glass-vs", "glass-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos: {
                    numComponents: 3, data: [
                        -.5, -.5, -.5,
                        .5, -.5, -.5,
                        .5, this.t, -.5,
                        -.5, -.5, -.5,
                        .5, this.t, -.5,
                        -.5, this.t, -.5,
                        -.5, -.5, .5,
                        .5, -.5, .5,
                        .5, this.t, .5,

                        -.5, -.5, .5,
                        .5, this.t, .5,
                        -.5, this.t, .5,
                        -.5, -.5, -.5,
                        .5, -.5, -.5,
                        .5, -.5, .5,
                        -.5, -.5, -.5,
                        .5, -.5, .5,
                        -.5, -.5, .5,

                        -.5, this.t, -.5,
                        .5, this.t, -.5,
                        .5, this.t, .5,
                        -.5, this.t, -.5,
                        .5, this.t, .5,
                        -.5, this.t, .5,
                        -.5, -.5, -.5,
                        -.5, this.t, -.5,
                        -.5, this.t, .5,

                        -.5, -.5, -.5,
                        -.5, this.t, .5,
                        -.5, -.5, .5,
                        .5, -.5, -.5,
                        .5, this.t, -.5,
                        .5, this.t, .5,
                        .5, -.5, -.5,
                        .5, this.t, 0.5,
                        .5, -.5, .5
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

                        0, 0, 1,
                        0, 0, 1,
                        0, 0, 1,

                        0, 0, 1,
                        0, 0, 1,
                        0, 0, 1,

                        0, -1, 0,
                        0, -1, 0,
                        0, -1, 0,

                        0, -1, 0,
                        0, -1, 0,
                        0, -1, 0,

                        0, 1, 0,
                        0, 1, 0,
                        0, 1, 0,

                        0, 1, 0,
                        0, 1, 0,
                        0, 1, 0,

                        -1, 0, 0,
                        -1, 0, 0,
                        -1, 0, 0,

                        -1, 0, 0,
                        -1, 0, 0,
                        -1, 0, 0,

                        1, 0, 0,
                        1, 0, 0,
                        1, 0, 0,

                        1, 0, 0,
                        1, 0, 0,
                        1, 0, 0,
                    ]
                },
                vTex: {
                    numComponents: 2,
                    data: [
                        0, 0, 1,
                        0, 1, 1,
                        0, 0, 1,

                        1, 0, 1,
                        0, 0, 1,
                        0, 1, 1,

                        0, 0, 1,
                        1, 0, 1,
                        0, 0, 1,

                        0, 1, 1,
                        0, 0, 1,
                        1, 0, 1,

                        0, 0, 1,
                        0, 1, 1,
                        0, 0, 1,

                        1, 0, 1,
                        0, 0, 1,
                        0, 1, 1,

                        0, 0, 1,
                        1, 0, 1,
                        0, 0, 1,

                        0, 1, 1,
                        0, 0, 1,
                        1, 0, 1
                    ]
                }
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl, arrays);

            var glassTexture = gl.createTexture();
            gl.activeTexture(gl.TEXTURE3);
            gl.bindTexture(gl.TEXTURE_2D, glassTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

            var glassImage = new Image();
            glassImage.crossOrigin = "anonymous";

            //[url=https://flic.kr/p/21Z2psz][img]https://farm5.staticflickr.com/4541/38714006841_6e0f40c50e_o.jpg[/img][/url][url=https://flic.kr/p/21Z2psz]office-building-glass-texture[/url] by [url=https://www.flickr.com/photos/160869673@N02/]Ben Len[/url], on Flickr
            glassImage.src = "https://farm5.staticflickr.com/4541/38714006841_6e0f40c50e_o.jpg";
            window.setTimeout(glassImage.onload, 200);
            glassImage.onload = function () {
                gl.activeTexture(gl.TEXTURE3);
                gl.bindTexture(gl.TEXTURE_2D, glassTexture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, glassImage);

                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);;
            }
        }

    };
    OfficeBuilding.prototype.draw = function (drawingState) {

        var modelM = twgl.m4.scaling([this.size * 0.5, this.size, this.size * 0.5]);
        twgl.m4.setTranslation(modelM, this.position, modelM);

        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl, shaderProgram, buffers);
        twgl.setUniforms(shaderProgram, {
            view: drawingState.view, proj: drawingState.proj, lightdir: drawingState.sunDirection,
            cubecolor: this.color, model: modelM
        });
        shaderProgram.program.texSampler3 = gl.getUniformLocation(shaderProgram.program, "texSampler3");
        gl.uniform1i(shaderProgram.program.texSampler3, 3);

        if (!drawingState.drawShadow)
            twgl.setUniforms(shaderProgram, {
                view: drawingState.view, proj: drawingState.proj,
                depthMap: drawingState.depthMap, drawShadow: 0
            });
        else
            twgl.setUniforms(shaderProgram, {
                view: drawingState.lightView, proj: drawingState.lightProj,
                depthMap: drawingState.emptyBuff, drawShadow: 1
            });
        twgl.setUniforms(shaderProgram, {
            lightdir: drawingState.sunDirection, lightView: drawingState.lightView,
            lightProj: drawingState.lightProj
        });


        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    OfficeBuilding.prototype.center = function (drawingState) {
        return this.position;
    }

})();


