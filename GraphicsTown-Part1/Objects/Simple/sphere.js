var Sphere = undefined;
var SpinningSphere = undefined;

(function() {
    "use strict";

    var shaderProgram = undefined;
    var buffers = undefined;

    // constructor for Cubes
    Sphere = function Sphere(name, position, size, color) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.color = color || [.7,.8,.9];
    }
    Sphere.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        // create the shaders once - for all cubes
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["cube-vs", "cube-fs"]);
        }
        if (!buffers) {
            var arrays = twgl.primitives.createSphereVertices(10, 6, 6);
			var sph = {vpos: arrays.position, texPos: arrays.texcoord, indices: arrays.indices};
            buffers = twgl.createBufferInfoFromArrays(gl,sph);
        }

    };
    Sphere.prototype.draw = function(drawingState) {
        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:this.color, model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    Sphere.prototype.center = function(drawingState) {
        return this.position;
    }

    SpinningSphere = function SpinningSphere(name, position, size, color, axis) {
        Sphere.apply(this,arguments);
        this.axis = axis || 'X';
    }
    SpinningSphere.prototype = Object.create(Sphere.prototype);
    SpinningSphere.prototype.draw = function(drawingState) {
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        var theta = Number(drawingState.realtime)/speedSlider.value;
        if (this.axis == 'X') {
            twgl.m4.rotateX(modelM, theta, modelM);
        } else if (this.axis == 'Z') {
            twgl.m4.rotateZ(modelM, theta, modelM);
        } else {
            twgl.m4.rotateY(modelM, theta, modelM);
        }
        twgl.m4.setTranslation(modelM,this.position,modelM);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:this.color, model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    SpinningSphere.prototype.center = function(drawingState) {
        return this.position;
    }

    grobjects.push(new SpinningSphere("spinSphere1",[4,1.5,0],0.1,[0,1,1]), "Y" );
    grobjects.push(new SpinningSphere("spinSphere2",[-4,1.5,0],0.1,[1,1,0]), "Y" );
    grobjects.push(new SpinningSphere("spinSphere3",[0,1.5,-4],0.1,[0.5,1.5,0]), "Y" );
    


})();


