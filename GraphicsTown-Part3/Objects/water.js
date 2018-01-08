
var Water = undefined;

(function () {
    "use strict";

    var shaderProgram = undefined;
    var buffers = undefined;

    Water = function Water(name, position, size, color) {
        this.name = name;
        this.position = position || [0, 0, 0];
        this.size = size || 0.5;
        this.texture = null;
    }
    Water.prototype.init = function (drawingState) {

        var gl = drawingState.gl;
        shaderProgram = twgl.createProgramInfo(gl, ["bumpmap-vs", "bumpmap-fs"]);

        if (!buffers) {
            var arrays = {
                vpos: {
                    numComponents: 3, data: [
                        2, 0, -0.2,
                        -2, 0, -0.2,
                        -2, 0, 0.2,
                        2, 0, 0.2
                    ]
                },
                vnormal: {
                    numComponents: 3, data: [

                        0, 0.8, 0, 0, 0.5, 0, 0, 0.5, 0,
                        0, 0.5, 0, 0, 0.5, 0, 0, 0.5, 0

                    ]
                },
                vTex: {
                    numComponents: 2,
                    data: [
                        0, 10, 10, 10,
                        10, 0, 0, 0
                    ]
                },
                vColor: {
                    numComponents: 3,
                    data: [
                        .00, .20, .95,
                        .00, .20, .95,
                        .00, .20, .95,
                        .00, .20, .95
                    ]
                },
                indices: [0, 1, 2, 0, 2, 3]
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl, arrays);

            var waterTexture = gl.createTexture();
            gl.activeTexture(gl.TEXTURE9);
            gl.bindTexture(gl.TEXTURE_2D, waterTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
            var waterBumpmap = new Image();
            waterBumpmap.crossOrigin = "origin";

            //[url=https://flic.kr/p/DYFt3W][img]https://farm5.staticflickr.com/4552/24926624558_e365ce32dc.jpg[/img][/url][url=https://flic.kr/p/DYFt3W]grass-bump-map[/url] by [url=https://www.flickr.com/photos/160869673@N02/]Ben Len[/url], on Flickr
            waterBumpmap.src = "https://farm5.staticflickr.com/4559/38083430204_7f103c749e_o.jpg";
            window.setTimeout(waterBumpmap.onload, 200);
            waterBumpmap.onload = function () {
                gl.activeTexture(gl.TEXTURE9);
                gl.bindTexture(gl.TEXTURE_2D, waterTexture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, waterBumpmap);

                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            }
        }
    };
    Water.prototype.draw = function (drawingState) {

        var modelM = twgl.m4.scaling([this.size, this.size, this.size * 15]);
        modelM = twgl.m4.multiply(twgl.m4.rotationY(Math.PI), modelM);
        twgl.m4.setTranslation(modelM, this.position, modelM);
        var tMVn = twgl.m4.axisRotation(drawingState.sunDirection, Math.PI / 2);

        var gl = drawingState.gl;

        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl, shaderProgram, buffers);
        twgl.setUniforms(shaderProgram,
            {
                view: drawingState.view,
                proj: drawingState.proj,
                uMVn: tMVn,
                lightdir: drawingState.sunDirection,
                cubecolor: this.color,
                model: modelM
            });
        shaderProgram.program.texSampler3 = gl.getUniformLocation(shaderProgram.program, "texSampler3");
        gl.uniform1i(shaderProgram.program.texSampler3, 9);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);

    }

    Water.prototype.center = function (drawingState) {
        return this.position;
    }

})();