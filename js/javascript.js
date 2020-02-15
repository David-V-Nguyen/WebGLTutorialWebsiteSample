/* Javascript code for WebGL tutorial website
*WebGL application
*Author: David Nguyen 
*Version: 1
*Date: 15/02/2020
*
*/

function main() {
    const canvas = document.querySelector("#glCanvas");
    // Initialize the GL context
    const gl = canvas.getContext("webgl");

    // only continue if WebGl is available and working
    if (gl === null){
        alert("Unable to initialize WebGL. Your browser or machine may not support it");
        return;
    }

    // set clear colour to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // clear the colour buffer with specified clear colour
    gl.clear(gl.COLOR_BUFFER_BIT);

}

window.onload = main;