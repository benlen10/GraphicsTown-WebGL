var grobjects = grobjects || [];

var Obj = undefined;
var m4=twgl.m4;
var v3 = twgl.v3;

(function() {
    "use strict";
    var shaderProgram = undefined;
    var buffers = undefined;
	var i;

    Obj = function Obj(name, position, size, color) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.color = color || [.7,.8,2];
    }
    Obj.prototype.init = function(drawingState) 
	{
        var gl=drawingState.gl;
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["cube-vs", "cube-fs"]);
        }
        if (!buffers) {
			var cube = parseFaceShadedOBJ(cylinder_obj_str);
            var arrays = {};
			arrays.vpos=cube.verts;
			arrays.vnormal=cube.norms;
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }
    };
    Obj .prototype.draw = function(drawingState) 
	{
        var scale_value = 0.25;
        var modelM = twgl.m4.scaling([scale_value,scale_value,scale_value]);
        twgl.m4.setTranslation(modelM,this.position,modelM);
		
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:this.color, model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    Obj.prototype.center = function(drawingState) {
        return this.position;
    }

})();


grobjects.push(new Obj("cylinder1",[0,1, 4]), 0.25, [0,1, 1] );
