/**
 * Created by gleicher on 10/9/2015.
 */

// The current speed of each object
var object_speed = 0;

var speedSlider;

var isValidGraphicsObject = function (object) {
    if (object == undefined) {
        return false;
    }

    if (object.name === undefined) {
        return false;
    }

    if (typeof object.draw !== "function" && typeof object.drawAfter !== "function") {
        console.log("warning: GraphicsObject of type " + object.name + " does not contain either a draw or drawAfter method");
        return false;
    }

    if (typeof object.center !== "function") {
        console.log("warning: GraphicsObject of type " + object.name + " does not contain a center method. ");
        return false;
    }

    if (typeof object.init !== "function") {
        console.log("warning: GraphicsObject of type " + object.name + " does not contain an init method. ");
        return false;
    }

    return true;
}


window.onload = function () {
    "use strict";


    // Fetch canvas and twgl context
    var canvas = document.getElementById("mainCanvas");
    var gl = canvas.getContext("webgl");

    // Fetch control ar
    var timeOfDaySlider = document.getElementById("time-of-day-slider");
    var canvasViewController = document.getElementById("canvas-xy-view-controller");
    speedSlider = document.getElementById("speed-slider");
    var runCheckbox = document.getElementById("run-checkbox");
    var examineCheckbox = document.getElementById("examine-checkbox");
    var viewSelectorDropdown = document.getElementById("view-selector");
    var resetViewButton = document.getElementById("reset-view-button");
    var objectSelectorDropdown = document.getElementById("object-selector");

    // Populate object selctor dropdown
    grobjects.forEach(function (obj) {
        if (obj.name != undefined) {
            objectSelectorDropdown.innerHTML += "<option>" + obj.name + "</option>";
        }
    });

    resetViewButton.onclick = function () {
        // note - this knows about arcball (defined later) since arcball is lifted
        arcball.reset();

        drivePos = [0, .2, 5];
        driveTheta = 0;
        driveXTheta = 0;

    }

    // make a fake drawing state for the object initialization
    var drawingState = {
        gl: gl,
        proj: twgl.m4.identity(),
        view: twgl.m4.identity(),
        camera: twgl.m4.identity(),
        sunDirection: [0, 1, 0]
    }


    // information for the cameras
    var lookAt = [0, 0, 0];
    var lookFrom = [0, 5, -10];
    var fov = 1.1;

    var arcball = new ArcBall(canvas);

    // for timing
    var realtime = 0
    var lastTime = Date.now();

    // parameters for driving
    var drivePos = [0, .2, 5];
    var driveTheta = 0;
    var driveXTheta = 0;

    // cheesy keyboard handling
    var keysdown = {};

    document.body.onkeydown = function (e) {
        var event = window.event ? window.event : e;
        keysdown[event.keyCode] = true;
        e.stopPropagation();
    };
    document.body.onkeyup = function (e) {
        var event = window.event ? window.event : e;
        delete keysdown[event.keyCode];
        e.stopPropagation();
    };

    // the actual draw function - which is the main "loop"
    function draw() {
        // advance the clock appropriately (unless its stopped)
        var curTime = Date.now();
        if (runCheckbox.checked) {
            realtime += (curTime - lastTime);
        }
        lastTime = curTime;

        // first, let's clear the screen
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // figure out the transforms
        var projM = twgl.m4.perspective(fov, 1, 0.1, 100);
        var cameraM = twgl.m4.lookAt(lookFrom, lookAt, [0, 1, 0]);
        var viewM = twgl.m4.inverse(cameraM);

        // implement the camera UI
        if (viewSelectorDropdown.value == "ArcBall") {
            viewM = arcball.getMatrix();
            twgl.m4.setTranslation(viewM, [0, -2, -14], viewM);
        } else if (viewSelectorDropdown.value == "Drive") {
            if (keysdown[65]) { driveTheta += .02; }
            if (keysdown[68]) { driveTheta -= .02; }
            if (keysdown[87]) {
                var dz = Math.cos(driveTheta);
                var dx = Math.sin(driveTheta);
                drivePos[0] -= .05 * dx;
                drivePos[2] -= .05 * dz;
            }
            if (keysdown[83]) {
                var dz = Math.cos(driveTheta);
                var dx = Math.sin(driveTheta);
                drivePos[0] += .05 * dx;
                drivePos[2] += .05 * dz;
            }

            cameraM = twgl.m4.rotationY(driveTheta);
            twgl.m4.setTranslation(cameraM, drivePos, cameraM);
            viewM = twgl.m4.inverse(cameraM);
        } else if (viewSelectorDropdown.value == "Fly") {

            if (keysdown[65] || keysdown[37]) {
                driveTheta += .02;
            } else if (keysdown[68] || keysdown[39]) {
                driveTheta -= .02;
            }

            if (keysdown[38]) { driveXTheta += .02; }
            if (keysdown[40]) { driveXTheta -= .02; }

            var dz = Math.cos(driveTheta);
            var dx = Math.sin(driveTheta);
            var dy = Math.sin(driveXTheta);

            if (keysdown[87]) {
                drivePos[0] -= .25 * dx;
                drivePos[2] -= .25 * dz;
                drivePos[1] += .25 * dy;
            }

            if (keysdown[83]) {
                drivePos[0] += .25 * dx;
                drivePos[2] += .25 * dz;
                drivePos[1] -= .25 * dy;
            }

            cameraM = twgl.m4.rotationX(driveXTheta);
            twgl.m4.multiply(cameraM, twgl.m4.rotationY(driveTheta), cameraM);
            twgl.m4.setTranslation(cameraM, drivePos, cameraM);
            viewM = twgl.m4.inverse(cameraM);
        }

        // get lighting information
        var tod = Number(timeOfDaySlider.value);
        var sunAngle = Math.PI * (tod - 6) / 12;
        var sunDirection = [Math.cos(sunAngle), Math.sin(sunAngle), 0];

        // make a real drawing state for drawing
        var drawingState = {
            gl: gl,
            proj: projM,   // twgl.m4.identity(),
            view: viewM,   // twgl.m4.identity(),
            camera: cameraM,
            timeOfDay: tod,
            sunDirection: sunDirection,
            realtime: realtime
        }

        // initialize all of the objects that haven't yet been initialized (that way objects can be added at any point)
        grobjects.forEach(function (obj) {
            if (!obj.__initialized) {
                if (isValidGraphicsObject(obj)) {
                    obj.init(drawingState);
                    obj.__initialized = true;
                }
            }
        });

        // now draw all of the objects - unless we're in examine mode
        if (examineCheckbox.checked) { //
            // get the examined object - too bad this is an array not an object
            var examined = undefined;
            grobjects.forEach(function (obj) { if (obj.name == objectSelectorDropdown.value) { examined = obj; } });
            var ctr = examined.center(drawingState);
            var shift = twgl.m4.translation([-ctr[0], -ctr[1], -ctr[2]]);
            twgl.m4.multiply(shift, drawingState.view, drawingState.view);

            if (examined.draw) examined.draw(drawingState);
            if (examined.drawAfter) examined.drawAfter(drawingState);
        } else {

            grobjects.forEach(function (obj) {
                if (obj.draw) obj.draw(drawingState);
            });

            grobjects.forEach(function (obj) {
                if (obj.drawAfter) obj.drawAfter();
            });
        }
        window.requestAnimationFrame(draw);
    };
    draw();
};
