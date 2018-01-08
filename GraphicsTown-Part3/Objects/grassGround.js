var GrassGround = undefined;

(function () {
    "use strict";

    var shaderProgram = undefined;
    var buffers = undefined;

    GrassGround = function GrassGround(name) {
        this.name = name;
        this.position = [0, 0, 0];
        this.size = 1.0;
        this.color = [0, 0, 0];
        this.texture = null;
    }
    GrassGround.prototype.init = function (drawingState) {

        var gl = drawingState.gl;
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["glass-vs", "glass-fs"]);
        }
        var groundPlaneSize = 0.85;
        var vertexPos = [
            -groundPlaneSize, 0, -groundPlaneSize,
            groundPlaneSize, 0, -groundPlaneSize,
            groundPlaneSize, 0, groundPlaneSize,
            -groundPlaneSize, 0, -groundPlaneSize,
            groundPlaneSize, 0, groundPlaneSize,
            -groundPlaneSize, 0, groundPlaneSize
        ];
        var arrays = { vpos: { numComponents: 3, data: vertexPos } };
        buffers = twgl.createBufferInfoFromArrays(drawingState.gl, arrays);

        var grassTexture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE4);
        gl.bindTexture(gl.TEXTURE_2D, grassTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        var grassImage = new Image();
        grassImage.crossOrigin = "anonymous";

        // [url=https://flic.kr/p/ZCFYxe][img]https://farm5.staticflickr.com/4541/37827529195_ae82b60582.jpg[/img][/url][url=https://flic.kr/p/ZCFYxe]grass-dark-texture-custom[/url] by [url=https://www.flickr.com/photos/160869673@N02/]Ben Len[/url], on Flickr
        grassImage.src = "https://farm5.staticflickr.com/4541/37827529195_ae82b60582.jpg";
        window.setTimeout(grassImage.onload, 200);
        grassImage.onload = function () {
            gl.activeTexture(gl.TEXTURE4);
            gl.bindTexture(gl.TEXTURE_2D, grassTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, grassImage);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
    };
    GrassGround.prototype.draw = function (drawingState) {
        var modelM = twgl.m4.scaling([this.size * 8, this.size, this.size * 7]);
        modelM = twgl.m4.multiply(twgl.m4.rotationY(Math.PI), modelM);
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
        shaderProgram.program.texSampler3 = gl.getUniformLocation(shaderProgram.program, "texSampler3");
        gl.uniform1i(shaderProgram.program.texSampler3, 4);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);

    };
    GrassGround.prototype.center = function (drawingState) {
        return this.position;
    }
})();
