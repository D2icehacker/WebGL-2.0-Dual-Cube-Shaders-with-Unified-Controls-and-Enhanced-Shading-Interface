/* eslint-disable require-jsdoc */
//
//  initShaders.js
//

function initShaders(gl, vertexShaderId, fragmentShaderId) {
    let vertShdr;
    let fragShdr;
  
    // use the passed vertexShaderId to get the corresponding element via DOM
    const vertElem = document.getElementById(vertexShaderId);
    if (!vertElem) {
      alert('Unable to load vertex shader ' + vertexShaderId);
      return -1;
    } else {
      vertShdr = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vertShdr, vertElem.textContent.replace(/^\s+|\s+$/g, ''));
      gl.compileShader(vertShdr);
      if (!gl.getShaderParameter(vertShdr, gl.COMPILE_STATUS)) {
        const msg = 'Vertex shader failed to compile.  The error log is:' +
          '<pre>' + gl.getShaderInfoLog(vertShdr) + '</pre>';
        alert(msg);
        return -1;
      }
    }
  
    // use the passed fragmentShaderId to get the corresponding element via DOM
    const fragElem = document.getElementById(fragmentShaderId);
    if (!fragElem) {
      alert('Unable to load vertex shader ' + fragmentShaderId);
      return -1;
    } else {
      fragShdr = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fragShdr, fragElem.textContent.replace(/^\s+|\s+$/g, ''));
      gl.compileShader(fragShdr);
      if (!gl.getShaderParameter(fragShdr, gl.COMPILE_STATUS)) {
        const msg = 'Fragment shader failed to compile.  The error log is:' +
          '<pre>' + gl.getShaderInfoLog(fragShdr) + '</pre>';
        alert(msg);
        return -1;
      }
    }
  
    const program = gl.createProgram();
    gl.attachShader(program, vertShdr);
    gl.attachShader(program, fragShdr);
    // complete the process of preparing the GPU code for the program's 
    // fragment and vertex shaders.
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const msg = 'Shader program failed to link.  The error log is:' +
          '<pre>' + gl.getProgramInfoLog(program) + '</pre>';
      alert(msg);
      return -1;
    }
    // return the linked program here (otherwise return value is -1)
    return program;
  }
  