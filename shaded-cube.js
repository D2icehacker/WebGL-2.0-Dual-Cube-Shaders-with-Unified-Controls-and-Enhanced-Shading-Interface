/* eslint-disable require-jsdoc */
'use strict';

function shadedCube() {
  let gl;
  let gl1;
  let program;
  let program1;

  let lightColor = vec4(1.0, 1.0, 1.0, 1.0);

  const numPositions = 36;

  const positionsArray = [];
  const normalsArray = [];
  

  const vertices = [
    vec4(-0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, 0.5, 0.5, 1.0),
    vec4(0.5, 0.5, 0.5, 1.0),
    vec4(0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, -0.5, -0.5, 1.0),
    vec4(-0.5, 0.5, -0.5, 1.0),
    vec4(0.5, 0.5, -0.5, 1.0),
    vec4(0.5, -0.5, -0.5, 1.0)];

  const viewerPosition = vec4(0.0, 0.0, 20.0, 0.0);
  const lightPosition = vec4(0.5, 0.5, 1.0, 0.0);
  const lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
  const lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
  const lightSpecular = vec4(1.0, 0.0, 1.0, 1.0);

  const materialAmbient = vec4(0.8, 0.8, 0.8, 1.0);
  const materialDiffuse = vec4(0.8, 0.8, 0.8, 1.0);
  const materialSpecular = vec4(0.8, 0.8, 0.8, 1.0);
  const materialShininess = 100.0;

  const xAxis = 0;
  const yAxis = 1;
  const zAxis = 2;
  let axis = 0;
  const theta = vec3(0, 0, 0);

  let flag = true;

  function quad(a, b, c, d) {
    const t1 = subtract(vertices[b], vertices[a]);
    const t2 = subtract(vertices[c], vertices[b]);
    let normal = cross(t1, t2);
    normal = vec3(normal);
    positionsArray.push(vertices[a]);
    normalsArray.push(normal);
    positionsArray.push(vertices[b]);
    normalsArray.push(normal);
    positionsArray.push(vertices[c]);
    normalsArray.push(normal);
    positionsArray.push(vertices[a]);
    normalsArray.push(normal);
    positionsArray.push(vertices[c]);
    normalsArray.push(normal);
    positionsArray.push(vertices[d]);
    normalsArray.push(normal);
  }

  function colorCube() {
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
  }

  function updateLightColor(newColor) {
    lightColor = newColor;
    const specularProduct = mult(lightSpecular, lightColor);

    const uSpecularProduct = gl.getUniformLocation(program, 'uSpecularProduct');
    const uSpecularProduct1 = gl1.getUniformLocation(program1, 'uSpecularProduct');


    gl.uniform4fv(uSpecularProduct, flatten(specularProduct)); 
    gl1.uniform4fv(uSpecularProduct1, flatten(specularProduct));
  }

  window.onload = function init() {
    const canvas = document.getElementById('gl-canvas');
    const canvas1 = document.getElementById('gl-canvas1');

    const lightColorPicker = document.getElementById('lightColorPicker');
    lightColorPicker.addEventListener('input', function (event) {
      const newColor = hexToVec4(event.target.value);
      updateLightColor(newColor);
    });

    gl = canvas.getContext('webgl2');
    gl1 = canvas1.getContext('webgl2');
    if (!gl) {
      alert('WebGL 2.0 is not available');
      return;
    }
    if (!gl1) {
      alert('WebGL 2.0 is not available');
      return;
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl1.viewport(0, 0, canvas1.width, canvas1.height);
    gl.clearColor(0.8, 0.8, 0.8, 1.0);
    gl1.clearColor(0.8, 0.8, 0.8, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl1.enable(gl1.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, 'vertex-shader', 'fragment-shader');
    program1 = initShaders(gl1, 'vertex-shader1', 'fragment-shader1');

    if (!program || !program1) {
      console.error('Shader program initialization failed.');
      return;
    }

    gl.useProgram(program);
    gl1.useProgram(program1);

    // Generate the data needed for the cube
    colorCube();

    const vBuffer = gl.createBuffer();
    const vBuffer1 = gl1.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl1.bindBuffer(gl1.ARRAY_BUFFER, vBuffer1);

    gl.bufferData(gl.ARRAY_BUFFER, flatten(positionsArray), gl.STATIC_DRAW);
    gl1.bufferData(gl1.ARRAY_BUFFER, flatten(positionsArray), gl1.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'aPosition');
    const positionLoc1 = gl1.getAttribLocation(program1, 'aPosition');

    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl1.vertexAttribPointer(positionLoc1, 4, gl1.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(positionLoc);
    gl1.enableVertexAttribArray(positionLoc1);

    const nBuffer = gl.createBuffer();
    const nBuffer1 = gl1.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl1.bindBuffer(gl1.ARRAY_BUFFER, nBuffer1);

    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);
    gl1.bufferData(gl1.ARRAY_BUFFER, flatten(normalsArray), gl1.STATIC_DRAW);

    const normalLoc = gl.getAttribLocation(program, 'aNormal');
    const normalLoc1 = gl1.getAttribLocation(program1, 'aNormal');

    gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
    gl1.vertexAttribPointer(normalLoc1, 3, gl1.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(normalLoc);
    gl1.enableVertexAttribArray(normalLoc1);

    const projectionMatrix = ortho(-1, 1, -1, 1, -100, 100);

    const ambientProduct = mult(lightAmbient, materialAmbient);
    const diffuseProduct = mult(lightDiffuse, materialDiffuse);
    const specularProduct = mult(lightSpecular, materialSpecular);

    // Set uniform locations after using the shader program
    const uAmbientProduct = gl.getUniformLocation(program, 'uAmbientProduct');
    const uDiffuseProduct = gl.getUniformLocation(program, 'uDiffuseProduct');
    const uSpecularProduct = gl.getUniformLocation(program, 'uSpecularProduct');
    const uShininess = gl.getUniformLocation(program, 'uShininess');
    const uLightPosition = gl.getUniformLocation(program, 'uLightPosition');
    const uViewerPosition = gl.getUniformLocation(program, 'uViewerPosition');
    const uProjectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');
    const uModelViewMatrix = gl.getUniformLocation(program, 'uModelViewMatrix');

    const uAmbientProduct1 = gl1.getUniformLocation(program1, 'uAmbientProduct');
    const uDiffuseProduct1 = gl1.getUniformLocation(program1, 'uDiffuseProduct');
    const uSpecularProduct1 = gl1.getUniformLocation(program1, 'uSpecularProduct');
    const uShininess1 = gl1.getUniformLocation(program1, 'uShininess');
    const uLightPosition1 = gl1.getUniformLocation(program1, 'uLightPosition');
    const uViewerPosition1 = gl1.getUniformLocation(program1, 'uViewerPosition');
    const uProjectionMatrix1 = gl1.getUniformLocation(program1, 'uProjectionMatrix');
    const uModelViewMatrix1 = gl1.getUniformLocation(program1, 'uModelViewMatrix');

    document.getElementById('ButtonX').onclick = function () {
      axis = xAxis;
    };
    document.getElementById('ButtonY').onclick = function () {
      axis = yAxis;
    };
    document.getElementById('ButtonZ').onclick = function () {
      axis = zAxis;
    };
    document.getElementById('ButtonT').onclick = function () {
      flag = !flag;
    };

    gl.uniform4fv(uAmbientProduct, ambientProduct);
    gl.uniform4fv(uDiffuseProduct, diffuseProduct);
    gl.uniform4fv(uSpecularProduct, specularProduct);
    gl.uniform1f(uShininess, materialShininess);
    gl.uniform4fv(uLightPosition, lightPosition);
    gl.uniform4fv(uViewerPosition, viewerPosition);
    gl.uniformMatrix4fv(uProjectionMatrix, false, flatten(projectionMatrix));

    gl1.uniform4fv(uAmbientProduct1, ambientProduct);
    gl1.uniform4fv(uDiffuseProduct1, diffuseProduct);
    gl1.uniform4fv(uSpecularProduct1, specularProduct);
    gl1.uniform1f(uShininess1, materialShininess);
    gl1.uniform4fv(uLightPosition1, lightPosition);
    gl1.uniform4fv(uViewerPosition1, viewerPosition);
    gl1.uniformMatrix4fv(uProjectionMatrix1, false, flatten(projectionMatrix));

    render();
  };

  function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl1.clear(gl1.COLOR_BUFFER_BIT | gl1.DEPTH_BUFFER_BIT);

    if (flag) {
      theta[axis] += 2.0;
    }

    let modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[xAxis], vec3(1, 0, 0)));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[yAxis], vec3(0, 1, 0)));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[zAxis], vec3(0, 0, 1)));

    // Set model view matrix for the first context
    const uModelViewMatrix = gl.getUniformLocation(program, 'uModelViewMatrix');
    gl.uniformMatrix4fv(uModelViewMatrix, false, flatten(modelViewMatrix));

    // Draw for the first context
    gl.drawArrays(gl.TRIANGLES, 0, numPositions);

    // Set model view matrix for the second context
    const uModelViewMatrix1 = gl1.getUniformLocation(program1, 'uModelViewMatrix');
    gl1.uniformMatrix4fv(uModelViewMatrix1, false, flatten(modelViewMatrix));

    // Draw for the second context
    gl1.drawArrays(gl1.TRIANGLES, 0, numPositions);

    // Request next frame
    requestAnimationFrame(render);
  }
}

shadedCube();



  // ... (existing code)

  function hexToVec4(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return vec4(r / 255, g / 255, b / 255, 1.0);
  }
