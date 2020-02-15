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


window.onload = main;
