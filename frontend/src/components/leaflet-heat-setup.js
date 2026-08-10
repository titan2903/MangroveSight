import L from 'leaflet';

if (typeof window !== 'undefined') {
  window.L = window.L || L;

  // 1. Patch Canvas getContext to suppress the "willReadFrequently" warning from leaflet-heat
  const originalGetContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (contextId, options) {
    if (contextId === '2d') {
      options = options || {};
      options.willReadFrequently = true;
    }
    return originalGetContext.call(this, contextId, options);
  };
}
