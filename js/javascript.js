/* Javascript code for WebGL tutorial website
*WebGL application
*Author: David Nguyen 
*Version: 1.1
*Date: 15/02/2020
*
*/

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

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
`;

const fsSource = `
    void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
`;

// Initialize a shader program, so WebGL knows how to draw our data 

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

// Creates a shader of the given type, uploads the source and complies it

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
window.onload = main;