import Carto from 'carto';

var Utils = {};

Utils.wrapEval = function (fn) {
  return `
    (function (feature, $zoom) {
      var $meters_per_pixel = 5000;
      return (${fn}());
    })
  `;
};

Utils.eval = function (fns) {
  let fn = eval(Utils.wrapEval(fns));

  return fn;
};

Utils.getShader = function (ccss) {
  return new Carto.RendererJS()
    .render(ccss).getLayers()[0].shader;
};

/**
 * Helper used in the tests.
 * Returns a function that executes a given function with the given parameters.
 */
Utils.runFn = function runFn(fn, param) {
  return function () {
    fn(param);
  };
};

export default Utils;
