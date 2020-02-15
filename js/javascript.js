/* Javascript code for WebGL tutorial website
*WebGL application
*Author: David Nguyen 
*Version: 1.2
*Date: 15/02/2020
*
*/

//
// Start here
//

function main() {
    const canvas = document.querySelector("#glCanvas");
    // Initialize the GL context
    const gl = canvas.getContext("webgl");

    // only continue if WebGl is available and working
    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it");
        return;
    }

    // set clear colour to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // clear the colour buffer with specified clear colour
    gl.clear(gl.COLOR_BUFFER_BIT);

}

// Vertex sharder program

const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    

    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = aVertexColor;
    }
`;

const fsSource = `
    void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
`;

// Creates a shader of the given type, uploads the source and compiles it

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    // send the source to the shader object

    gl.shaderSource(shader, source);

    // compile the shader program

    gl.compileShader(shader);

    // see if it has compiled successfully

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

// Vertex shader program

const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
`;

    // Fragment shader program

const fsSource = `
    varying lowp vec4 vColor;

    void main(void) {
      gl_FragColor = vColor;
    }
`;

// Initialize shader program - Lighting for vertices and so forth is established

const shaderProgram = initShaderProgram(gl, vsSource, fsSource);


// Collect all info needed to use shader program
// Look up which attributes our shader program is using for aVertexPosition, aVertexColor
// also look up uniform locations 

const programInfo = {
    program: shaderProgram,
    attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
    },

    uniformLocations: {
        projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
        modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
};

    // Where we call the routine that builds all the objects to be drawn

    const buffers = initBuffers(gl);

    // Draw the scene

    drawScene(gl, programInfo, buffers);

//
//  InitBuffers
//    
// Initialize the buffers needed, just have one object (simple 2D square)
//

function initBuffers(gl) {
    
    // create buffer for the square's positions

    const positionBuffer = gl.createBuffer();

    // select the positionBuffer as the one to apply buffer operations to

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [
        1.0, 1.0, 
        -1.0, 1.0,    
        1.0, -1.0,     
        -1.0, -1.0,   
    ];

    // Now pass the list of positions into WebGL to build the shape
    // By creating a FLoat32Array from the javaScript array, use it to fill current buffer

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // set up the colours for the vertices

    var colors = [
        1.0, 1.0, 1.0, 1.0,     // white
        1.0, 0.0, 0.0, 1.0,     // red
        0.0, 1.0, 1.0, 1.0,     // green
        0.0, 0.0, 1.0, 1.0,     // blue
    ];

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    return {
        position: positionBuffer,
        color: colorBuffer,
    };
}

//
// Draw the scene
//

function drawScene(gl, programInfo, buffers) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
  
    // Clear the canvas before we start drawing on it.
  
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    // Create a perspective matrix is a special matrix that is
    // used to simulate the distortion of perspective in a camera.

    // Our field of view is 45 degrees, with a width/height
    // ratio matching the display size of the canvas

    // can only see objects between 0.1 units and 100 units away from the camera.
  
    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
  
    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.

    mat4.perspective(projectionMatrix,
                     fieldOfView,
                     aspect,
                     zNear,
                     zFar);
  
    // Set drawing position to the "identity" point, which is
    // the center of the scene.

    const modelViewMatrix = mat4.create();
  
    // move the drawing position a bit to where we want to
    // start drawing the square.
  
    mat4.translate(modelViewMatrix,     // destination matrix
                   modelViewMatrix,     // matrix to translate
                   [-0.0, 0.0, -6.0]);  // amount to translate

// Tell WebGL how to pull out the positions from the position buffer 
// into the vertexPosition attribute

{
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
}

// Tell WebGL how to pull out the colours from the colour buffer 
// into the vertexColor attribute

{
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexColor);
}

// Tell WebGL to use our program when drawing

gl.useProgram(programInfo.program);

// Set the shader uniforms

gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix);
gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix);

    {
        const offset = 0;
        const vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
}

//
// Initialize a shader program, so WebGL knows how to draw our data 
//

function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // if creating the shader program failed, show alert

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}



window.onload = main;
