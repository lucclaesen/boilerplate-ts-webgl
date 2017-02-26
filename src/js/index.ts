let style = require<any>("../styles/app.css");
let vertexShaderSource = require<string>("../shaders/simpleVShader.glsl");
let fragmentShaderSource = require<string>("../shaders/simpleFShader.glsl");


let gl : WebGLRenderingContext, 
    canvas : HTMLCanvasElement,
    glProgram,
    fragmentShader,
    vertexShader,
    vertexPositionAttribute,
    trianglesVerticesBuffer;

function initWebGL(){
    
    canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
    
    try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        
        if(gl) {
            setupWebGL();
            initShaders();
            setupBuffers();
            drawScene();
        } else {
            alert( "Error: Your browser does not appear to support WebGL.");
        }
    }
    catch(e){
        console.log("error");
    }
    
}


function setupWebGL() {
    gl.clearColor(0.1, 0.5, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function initShaders() {
    // a. create a shader glProgram
    glProgram = gl.createProgram();

    // b. make the shaders    
    vertexShader = makeShader(vertexShaderSource, gl.VERTEX_SHADER); 
    fragmentShader = makeShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
    
    //c. attach the shaders to the glProgram
    gl.attachShader(glProgram, vertexShader);
    gl.attachShader(glProgram, fragmentShader);

    // d. Link the glProgram
    gl.linkProgram(glProgram);
    if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
        console.error("unable to link the gl program");
    }

    // e. use the program
    gl.useProgram(glProgram);
    
}

function setupBuffers() {
    var triangleVertices = [
        -0.5    , 0.5   , 0.0,
        0.0     , 0.0   , 0.0,
        -0.5    , -0.5  , 0.0,
        0.5     , 0.5   , 0.0,
        0.0     , 0.0   , 0.0,
        0.5     , -0.5  , 0.0
    ];

    // Define a VBO as an array buffer (a buffer with vertix definitions) or element_array_buffer (a buffer of vertix indices)
    trianglesVerticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticesBuffer);

    // feed the data to the buffer, specifying either STATIC_DRAW, DYNAMIC_DRAW or STREAM_DRAW
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
}

// drawing amounts to assigning a buffer to a shader attribute
function drawScene() {
    // first, get a "pointer" to a shader attribute and specify that it accepts array data
    vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
    gl.enableVertexAttribArray(vertexPositionAttribute);

    // specifies that the current buffer should be interpreted as a set of triples of floats () -- so that it fits the 
    // vec3 typing of the shader attribute
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    // finally, raise the command to draw vertices 0 to 6 as triangles
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

// helper functions
function makeShader(src, shaderType) {
    const shader = gl.createShader(shaderType);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Could not compile shader: " + gl.getShaderInfoLog(shader));
    }
    return shader;
}

window.onload = initWebGL;
