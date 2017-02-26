/* A simple vertex shader that takes vertex triples and adds a constant 1.0 for transparency */
attribute vec3 aVertexPosition;
void main(void){
    gl_Position = vec4(aVertexPosition, 1.0);
}