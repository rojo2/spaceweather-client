
import {mat4,vec3} from "gl-matrix";

export function initBackground() {

  const canvas = document.querySelector("canvas"),
        gl = canvas.getContext("webgl", {
          antialias: true
        });

  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, `
  precision mediump float;

  uniform mat4 mvp;

  attribute vec3 position;

  varying float alpha;

  void main(void) {

    vec4 finalPosition = mvp * vec4(position, 1.0);

    gl_Position = finalPosition;

    alpha = (max(0.0, min(1.0, gl_Position.z)) * 0.5) + 0.5;

    if (gl_Position.w > 0.0) {
      gl_PointSize = 4.0 / gl_Position.w;
    } else {
      gl_PointSize = 0.0;
    }

  }`);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(vertexShader));
  }

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, `
  precision highp float;

  const vec4 begin = vec4(1.0, 1.0, 1.0, 0.5);
  const vec4 end = vec4(1.0, 1.0, 1.0, 0.5);

  vec4 interpolate4f(vec4 a,vec4 b, float p) {
    return a + (b - a) * p;
  }

  varying float alpha;

  void main(void) {

    vec2 pc = (gl_PointCoord - 0.5) * 2.0;

    float dist = (1.0 - sqrt(pc.x * pc.x + pc.y * pc.y));
    vec4 color = interpolate4f(begin, end, dist);

    gl_FragColor = vec4(dist, dist, dist, dist * alpha) * color;

  }`);

  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(fragmentShader));
  }

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const attributes = {
    position: gl.getAttribLocation(program, "position")
  }, uniforms = {
    mvp: gl.getUniformLocation(program, "mvp")
  };

  const NUM_POINTS = 100000;
  const points = [];
  for (let index = 0; index < NUM_POINTS; index++) {
    points.push((Math.random() - 0.5) * 8);
    points.push((Math.random() - 0.5) * 8);
    points.push((Math.random() - 0.5) * 8);
  }

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

  const pMatrix = mat4.create(),
        vMatrix = mat4.create(),
        ivMatrix = mat4.create(),
        mMatrix = mat4.create(),
        mvMatrix = mat4.create(),
        mvpMatrix = mat4.create(),
        position = vec3.create();

  mat4.perspective(pMatrix, Math.PI * 0.35, canvas.width / canvas.height, 0.01, 1000.0);

  vec3.set(position,0.0,0.0,0.0);

  let angle = 0.0;

  function render(now) {

    angle += 0.000125;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.viewport(0,0,canvas.width,canvas.height);

    // P * V * M
    //mat4.translate(mvpMatrix, mvpMatrix, position);
    mat4.identity(mMatrix);

    position[2] = Math.sin(now / 50000);

    mat4.identity(vMatrix);
    mat4.translate(vMatrix, vMatrix, position);
    mat4.rotateX(vMatrix, vMatrix, angle);
    mat4.rotateY(vMatrix, vMatrix, angle);
    mat4.rotateZ(vMatrix, vMatrix, angle);

    mat4.invert(ivMatrix, vMatrix);

    mat4.multiply(mvMatrix, ivMatrix, mMatrix);
    mat4.multiply(mvpMatrix, pMatrix, mvMatrix);

    gl.useProgram(program);
    gl.enableVertexAttribArray(attributes.position);
    gl.uniformMatrix4fv(uniforms.mvp, false, mvpMatrix);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 3*4, 0);
    gl.drawArrays(gl.POINTS, 0, NUM_POINTS);

    //console.count("render");

    window.requestAnimationFrame(render);

  }

  render();

  function resize() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    mat4.perspective(pMatrix, Math.PI * 0.35, canvas.width / canvas.height, 0.01, 1000.0);

  }

  resize();

  window.addEventListener("resize", resize);
}
