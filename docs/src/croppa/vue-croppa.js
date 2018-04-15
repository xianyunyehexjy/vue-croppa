/*
 * vue-croppa v1.3.3
 * https://github.com/zhanziyang/vue-croppa
 * 
 * Copyright (c) 2018 zhanziyang
 * Released under the ISC license
 */
  
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Croppa = factory());
}(this, (function () { 'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var index = createCommonjsModule(function (module, exports) {
(function (root, factory) {
    if (typeof undefined === 'function' && undefined.amd) {
        undefined([], factory);
    } else {
        module.exports = factory();
    }
}(commonjsGlobal, function () {
  'use strict';

  function drawImage(img, orientation, x, y, width, height) {
    if (!/^[1-8]$/.test(orientation)) throw new Error('orientation should be [1-8]');

    if (x == null) x = 0;
    if (y == null) y = 0;
    if (width == null) width = img.width;
    if (height == null) height = img.height;

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    ctx.save();
    switch (+orientation) {
      // 1 = The 0th row is at the visual top of the image, and the 0th column is the visual left-hand side.
      case 1:
          break;

      // 2 = The 0th row is at the visual top of the image, and the 0th column is the visual right-hand side.
      case 2:
         ctx.translate(width, 0);
         ctx.scale(-1, 1);
         break;

      // 3 = The 0th row is at the visual bottom of the image, and the 0th column is the visual right-hand side.
      case 3:
          ctx.translate(width, height);
          ctx.rotate(180 / 180 * Math.PI);
          break;

      // 4 = The 0th row is at the visual bottom of the image, and the 0th column is the visual left-hand side.
      case 4:
          ctx.translate(0, height);
          ctx.scale(1, -1);
          break;

      // 5 = The 0th row is the visual left-hand side of the image, and the 0th column is the visual top.
      case 5:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(90 / 180 * Math.PI);
          ctx.scale(1, -1);
          break;

      // 6 = The 0th row is the visual right-hand side of the image, and the 0th column is the visual top.
      case 6:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(90 / 180 * Math.PI);
          ctx.translate(0, -height);
          break;

      // 7 = The 0th row is the visual right-hand side of the image, and the 0th column is the visual bottom.
      case 7:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(270 / 180 * Math.PI);
          ctx.translate(-width, height);
          ctx.scale(1, -1);
          break;

      // 8 = The 0th row is the visual left-hand side of the image, and the 0th column is the visual bottom.
      case 8:
          canvas.width = height;
          canvas.height = width;
          ctx.translate(0, width);
          ctx.rotate(270 / 180 * Math.PI);
          break;
    }

    ctx.drawImage(img, x, y, width, height);
    ctx.restore();

    return canvas;
  }

  return {
    drawImage: drawImage
  };
}));
});

var u = {
  onePointCoord: function onePointCoord(point, vm) {
    var canvas = vm.canvas,
        quality = vm.quality;

    var rect = canvas.getBoundingClientRect();
    var clientX = point.clientX;
    var clientY = point.clientY;
    return {
      x: (clientX - rect.left) * quality,
      y: (clientY - rect.top) * quality
    };
  },
  getPointerCoords: function getPointerCoords(evt, vm) {
    var pointer = void 0;
    if (evt.touches && evt.touches[0]) {
      pointer = evt.touches[0];
    } else if (evt.changedTouches && evt.changedTouches[0]) {
      pointer = evt.changedTouches[0];
    } else {
      pointer = evt;
    }
    return this.onePointCoord(pointer, vm);
  },
  getPinchDistance: function getPinchDistance(evt, vm) {
    var pointer1 = evt.touches[0];
    var pointer2 = evt.touches[1];
    var coord1 = this.onePointCoord(pointer1, vm);
    var coord2 = this.onePointCoord(pointer2, vm);

    return Math.sqrt(Math.pow(coord1.x - coord2.x, 2) + Math.pow(coord1.y - coord2.y, 2));
  },
  getPinchCenterCoord: function getPinchCenterCoord(evt, vm) {
    var pointer1 = evt.touches[0];
    var pointer2 = evt.touches[1];
    var coord1 = this.onePointCoord(pointer1, vm);
    var coord2 = this.onePointCoord(pointer2, vm);

    return {
      x: (coord1.x + coord2.x) / 2,
      y: (coord1.y + coord2.y) / 2
    };
  },
  imageLoaded: function imageLoaded(img) {
    return img.complete && img.naturalWidth !== 0;
  },
  rAFPolyfill: function rAFPolyfill() {
    // rAF polyfill
    if (typeof document == 'undefined' || typeof window == 'undefined') return;
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || // Webkit中此取消方法的名字变了
      window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function (callback) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
        var id = window.setTimeout(function () {
          var arg = currTime + timeToCall;
          callback(arg);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }
    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
      };
    }

    Array.isArray = function (arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    };
  },
  toBlobPolyfill: function toBlobPolyfill() {
    if (typeof document == 'undefined' || typeof window == 'undefined' || !HTMLCanvasElement) return;
    var binStr, len, arr;
    if (!HTMLCanvasElement.prototype.toBlob) {
      Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value: function value(callback, type, quality) {
          binStr = atob(this.toDataURL(type, quality).split(',')[1]);
          len = binStr.length;
          arr = new Uint8Array(len);

          for (var i = 0; i < len; i++) {
            arr[i] = binStr.charCodeAt(i);
          }

          callback(new Blob([arr], { type: type || 'image/png' }));
        }
      });
    }
  },
  eventHasFile: function eventHasFile(evt) {
    var dt = evt.dataTransfer || evt.originalEvent.dataTransfer;
    if (dt.types) {
      for (var i = 0, len = dt.types.length; i < len; i++) {
        if (dt.types[i] == 'Files') {
          return true;
        }
      }
    }

    return false;
  },
  getFileOrientation: function getFileOrientation(arrayBuffer) {
    var view = new DataView(arrayBuffer);
    if (view.getUint16(0, false) != 0xFFD8) return -2;
    var length = view.byteLength;
    var offset = 2;
    while (offset < length) {
      var marker = view.getUint16(offset, false);
      offset += 2;
      if (marker == 0xFFE1) {
        if (view.getUint32(offset += 2, false) != 0x45786966) return -1;
        var little = view.getUint16(offset += 6, false) == 0x4949;
        offset += view.getUint32(offset + 4, little);
        var tags = view.getUint16(offset, little);
        offset += 2;
        for (var i = 0; i < tags; i++) {
          if (view.getUint16(offset + i * 12, little) == 0x0112) {
            return view.getUint16(offset + i * 12 + 8, little);
          }
        }
      } else if ((marker & 0xFF00) != 0xFF00) break;else offset += view.getUint16(offset, false);
    }
    return -1;
  },
  parseDataUrl: function parseDataUrl(url) {
    var reg = /^data:([^;]+)?(;base64)?,(.*)/gmi;
    return reg.exec(url)[3];
  },
  base64ToArrayBuffer: function base64ToArrayBuffer(base64) {
    var binaryString = atob(base64);
    var len = binaryString.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  },
  getRotatedImage: function getRotatedImage(img, orientation) {
    var _canvas = index.drawImage(img, orientation);
    var _img = new Image();
    _img.src = _canvas.toDataURL();
    return _img;
  },
  flipX: function flipX(ori) {
    if (ori % 2 == 0) {
      return ori - 1;
    }

    return ori + 1;
  },
  flipY: function flipY(ori) {
    var map = {
      1: 4,
      4: 1,
      2: 3,
      3: 2,
      5: 8,
      8: 5,
      6: 7,
      7: 6
    };

    return map[ori];
  },
  rotate90: function rotate90(ori) {
    var map = {
      1: 6,
      2: 7,
      3: 8,
      4: 5,
      5: 2,
      6: 3,
      7: 4,
      8: 1
    };

    return map[ori];
  },
  numberValid: function numberValid(n) {
    return typeof n === 'number' && !isNaN(n);
  }
};

Number.isInteger = Number.isInteger || function (value) {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
};

var initialImageType = String;
if (typeof window !== 'undefined' && window.Image) {
  initialImageType = [String, Image];
}

var props = {
  value: Object,
  width: {
    type: Number,
    default: 200,
    validator: function validator(val) {
      return val > 0;
    }
  },
  height: {
    type: Number,
    default: 200,
    validator: function validator(val) {
      return val > 0;
    }
  },
  placeholder: {
    type: String,
    default: 'Choose an image'
  },
  placeholderColor: {
    default: '#606060'
  },
  placeholderFontSize: {
    type: Number,
    default: 0,
    validator: function validator(val) {
      return val >= 0;
    }
  },
  canvasColor: {
    default: 'transparent'
  },
  quality: {
    type: Number,
    default: 2,
    validator: function validator(val) {
      return val > 0;
    }
  },
  zoomSpeed: {
    default: 3,
    type: Number,
    validator: function validator(val) {
      return val > 0;
    }
  },
  accept: String,
  fileSizeLimit: {
    type: Number,
    default: 0,
    validator: function validator(val) {
      return val >= 0;
    }
  },
  disabled: Boolean,
  disableDragAndDrop: Boolean,
  disableClickToChoose: Boolean,
  disableDragToMove: Boolean,
  disableScrollToZoom: Boolean,
  disablePinchToZoom: Boolean,
  disableRotation: Boolean,
  reverseScrollToZoom: Boolean,
  preventWhiteSpace: Boolean,
  showRemoveButton: {
    type: Boolean,
    default: true
  },
  removeButtonColor: {
    type: String,
    default: 'red'
  },
  removeButtonSize: {
    type: Number
  },
  initialImage: initialImageType,
  initialSize: {
    type: String,
    default: 'cover',
    validator: function validator(val) {
      return val === 'cover' || val === 'contain' || val === 'natural';
    }
  },
  initialPosition: {
    type: String,
    default: 'center',
    validator: function validator(val) {
      var valids = ['center', 'top', 'bottom', 'left', 'right'];
      return val.split(' ').every(function (word) {
        return valids.indexOf(word) >= 0;
      }) || /^-?\d+% -?\d+%$/.test(val);
    }
  },
  inputAttrs: Object,
  showLoading: Boolean,
  loadingSize: {
    type: Number,
    default: 20
  },
  loadingColor: {
    type: String,
    default: '#606060'
  },
  replaceDrop: Boolean,
  passive: Boolean,
  imageBorderRadius: {
    type: [Number, String],
    default: 0
  },
  autoSizing: Boolean,
  videoEnabled: Boolean
};

var events = {
  INIT_EVENT: 'init',
  FILE_CHOOSE_EVENT: 'file-choose',
  FILE_SIZE_EXCEED_EVENT: 'file-size-exceed',
  FILE_TYPE_MISMATCH_EVENT: 'file-type-mismatch',
  NEW_IMAGE: 'new-image',
  NEW_IMAGE_DRAWN: 'new-image-drawn',
  IMAGE_REMOVE_EVENT: 'image-remove',
  MOVE_EVENT: 'move',
  ZOOM_EVENT: 'zoom',
  DRAW: 'draw',
  INITIAL_IMAGE_LOADED_EVENT: 'initial-image-loaded',
  LOADING_START: 'loading-start',
  LOADING_END: 'loading-end'
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var PCT_PER_ZOOM = 1 / 100000; // The amount of zooming everytime it happens, in percentage of image width.
var MIN_MS_PER_CLICK = 500; // If touch duration is shorter than the value, then it is considered as a click.
var CLICK_MOVE_THRESHOLD = 100; // If touch move distance is greater than this value, then it will by no mean be considered as a click.
var MIN_WIDTH = 10; // The minimal width the user can zoom to.
var DEFAULT_PLACEHOLDER_TAKEUP = 2 / 3; // Placeholder text by default takes up this amount of times of canvas width.
var PINCH_ACCELERATION = 1; // The amount of times by which the pinching is more sensitive than the scolling

var syncData = ['imgData', 'img', 'imgSet', 'originalImage', 'naturalHeight', 'naturalWidth', 'orientation', 'scaleRatio'];
// const DEBUG = false

var component = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { ref: "wrapper", class: 'croppa-container ' + (_vm.img ? 'croppa--has-target' : '') + ' ' + (_vm.passive ? 'croppa--passive' : '') + ' ' + (_vm.disabled ? 'croppa--disabled' : '') + ' ' + (_vm.disableClickToChoose ? 'croppa--disabled-cc' : '') + ' ' + (_vm.disableDragToMove && _vm.disableScrollToZoom ? 'croppa--disabled-mz' : '') + ' ' + (_vm.fileDraggedOver ? 'croppa--dropzone' : ''), on: { "dragenter": function dragenter($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handleDragEnter($event);
        }, "dragleave": function dragleave($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handleDragLeave($event);
        }, "dragover": function dragover($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handleDragOver($event);
        }, "drop": function drop($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handleDrop($event);
        } } }, [_c('input', _vm._b({ ref: "fileInput", staticStyle: { "height": "1px", "width": "1px", "overflow": "hidden", "margin-left": "-99999px", "position": "absolute" }, attrs: { "type": "file", "accept": _vm.accept, "disabled": _vm.disabled }, on: { "change": _vm._handleInputChange } }, 'input', _vm.inputAttrs)), _c('div', { staticClass: "slots", staticStyle: { "width": "0", "height": "0", "visibility": "hidden" } }, [_vm._t("initial"), _vm._t("placeholder")], 2), _c('canvas', { ref: "canvas", on: { "click": function click($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handleClick($event);
        }, "dblclick": function dblclick($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handleDblClick($event);
        }, "touchstart": function touchstart($event) {
          $event.stopPropagation();_vm._handlePointerStart($event);
        }, "mousedown": function mousedown($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerStart($event);
        }, "pointerstart": function pointerstart($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerStart($event);
        }, "touchend": function touchend($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerEnd($event);
        }, "touchcancel": function touchcancel($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerEnd($event);
        }, "mouseup": function mouseup($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerEnd($event);
        }, "pointerend": function pointerend($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerEnd($event);
        }, "pointercancel": function pointercancel($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerEnd($event);
        }, "touchmove": function touchmove($event) {
          $event.stopPropagation();_vm._handlePointerMove($event);
        }, "mousemove": function mousemove($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerMove($event);
        }, "pointermove": function pointermove($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerMove($event);
        }, "pointerleave": function pointerleave($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerLeave($event);
        }, "DOMMouseScroll": function DOMMouseScroll($event) {
          $event.stopPropagation();_vm._handleWheel($event);
        }, "wheel": function wheel($event) {
          $event.stopPropagation();_vm._handleWheel($event);
        }, "mousewheel": function mousewheel($event) {
          $event.stopPropagation();_vm._handleWheel($event);
        } } }), _vm.showRemoveButton && _vm.img && !_vm.passive ? _c('svg', { staticClass: "icon icon-remove", style: 'top: -' + _vm.height / 40 + 'px; right: -' + _vm.width / 40 + 'px', attrs: { "viewBox": "0 0 1024 1024", "version": "1.1", "xmlns": "http://www.w3.org/2000/svg", "xmlns:xlink": "http://www.w3.org/1999/xlink", "width": _vm.removeButtonSize || _vm.width / 10, "height": _vm.removeButtonSize || _vm.width / 10 }, on: { "click": _vm.remove } }, [_c('path', { attrs: { "d": "M511.921231 0C229.179077 0 0 229.257846 0 512 0 794.702769 229.179077 1024 511.921231 1024 794.781538 1024 1024 794.702769 1024 512 1024 229.257846 794.781538 0 511.921231 0ZM732.041846 650.633846 650.515692 732.081231C650.515692 732.081231 521.491692 593.683692 511.881846 593.683692 502.429538 593.683692 373.366154 732.081231 373.366154 732.081231L291.761231 650.633846C291.761231 650.633846 430.316308 523.500308 430.316308 512.196923 430.316308 500.696615 291.761231 373.523692 291.761231 373.523692L373.366154 291.918769C373.366154 291.918769 503.453538 430.395077 511.881846 430.395077 520.349538 430.395077 650.515692 291.918769 650.515692 291.918769L732.041846 373.523692C732.041846 373.523692 593.447385 502.547692 593.447385 512.196923 593.447385 521.412923 732.041846 650.633846 732.041846 650.633846Z", "fill": _vm.removeButtonColor } })]) : _vm._e(), _vm.showLoading && _vm.loading ? _c('div', { staticClass: "sk-fading-circle", style: _vm.loadingStyle }, _vm._l(12, function (i) {
      return _c('div', { key: i, class: 'sk-circle' + i + ' sk-circle' }, [_c('div', { staticClass: "sk-circle-indicator", style: { backgroundColor: _vm.loadingColor } })]);
    })) : _vm._e(), _vm._t("default")], 2);
  }, staticRenderFns: [],
  model: {
    prop: 'value',
    event: events.INIT_EVENT
  },

  props: props,

  data: function data() {
    return {
      canvas: null,
      ctx: null,
      originalImage: null,
      img: null,
      video: null,
      dragging: false,
      lastMovingCoord: null,
      imgData: {
        width: 0,
        height: 0,
        startX: 0,
        startY: 0
      },
      fileDraggedOver: false,
      tabStart: 0,
      scrolling: false,
      pinching: false,
      rotating: false,
      pinchDistance: 0,
      supportTouch: false,
      pointerMoved: false,
      pointerStartCoord: null,
      naturalWidth: 0,
      naturalHeight: 0,
      scaleRatio: null,
      orientation: 1,
      userMetadata: null,
      imageSet: false,
      currentPointerCoord: null,
      currentIsInitial: false,
      loading: false,
      realWidth: 0,
      realHeight: 0,
      chosenFile: null
    };
  },


  computed: {
    outputWidth: function outputWidth() {
      var w = this.autoSizing ? this.realWidth : this.width;
      return w * this.quality;
    },
    outputHeight: function outputHeight() {
      var h = this.autoSizing ? this.realHeight : this.height;
      return h * this.quality;
    },
    computedPlaceholderFontSize: function computedPlaceholderFontSize() {
      return this.placeholderFontSize * this.quality;
    },
    aspectRatio: function aspectRatio() {
      return this.naturalWidth / this.naturalHeight;
    },
    loadingStyle: function loadingStyle() {
      return {
        width: this.loadingSize + 'px',
        height: this.loadingSize + 'px',
        right: '15px',
        bottom: '10px'
      };
    }
  },

  mounted: function mounted() {
    var _this = this;

    this._initialize();
    u.rAFPolyfill();
    u.toBlobPolyfill();

    var supports = this.supportDetection();
    if (!supports.basic) {
      console.warn('Your browser does not support vue-croppa functionality.');
    }

    if (this.passive) {
      this.$watch('value._data', function (data) {
        var set$$1 = false;
        if (!data) return;
        for (var key in data) {
          if (syncData.indexOf(key) >= 0) {
            var val = data[key];
            if (val !== _this[key]) {
              _this.$set(_this, key, val);
              set$$1 = true;
            }
          }
        }
        if (set$$1) {
          if (!_this.img) {
            _this.remove();
          } else {
            _this.$nextTick(function () {
              _this._draw();
            });
          }
        }
      }, {
        deep: true
      });
    }

    this._autoSizingInit();
  },
  beforeDestroy: function beforeDestroy() {
    this._autoSizingRemove();
  },


  watch: {
    outputWidth: function outputWidth() {
      this.onDimensionChange();
    },
    outputHeight: function outputHeight() {
      this.onDimensionChange();
    },
    canvasColor: function canvasColor() {
      if (!this.img) {
        this._setPlaceholders();
      } else {
        this._draw();
      }
    },
    imageBorderRadius: function imageBorderRadius() {
      if (this.img) {
        this._draw();
      }
    },
    placeholder: function placeholder() {
      if (!this.img) {
        this._setPlaceholders();
      }
    },
    placeholderColor: function placeholderColor() {
      if (!this.img) {
        this._setPlaceholders();
      }
    },
    computedPlaceholderFontSize: function computedPlaceholderFontSize() {
      if (!this.img) {
        this._setPlaceholders();
      }
    },
    preventWhiteSpace: function preventWhiteSpace(val) {
      if (val) {
        this.imageSet = false;
      }
      this._placeImage();
    },
    scaleRatio: function scaleRatio(val, oldVal) {
      if (this.passive) return;
      if (!this.img) return;
      if (!u.numberValid(val)) return;

      var x = 1;
      if (u.numberValid(oldVal) && oldVal !== 0) {
        x = val / oldVal;
      }
      var pos = this.currentPointerCoord || {
        x: this.imgData.startX + this.imgData.width / 2,
        y: this.imgData.startY + this.imgData.height / 2
      };
      this.imgData.width = this.naturalWidth * val;
      this.imgData.height = this.naturalHeight * val;

      if (!this.userMetadata && this.imageSet && !this.rotating) {
        var offsetX = (x - 1) * (pos.x - this.imgData.startX);
        var offsetY = (x - 1) * (pos.y - this.imgData.startY);
        this.imgData.startX = this.imgData.startX - offsetX;
        this.imgData.startY = this.imgData.startY - offsetY;
      }

      if (this.preventWhiteSpace) {
        this._preventZoomingToWhiteSpace();
        this._preventMovingToWhiteSpace();
      }
    },

    'imgData.width': function imgDataWidth(val, oldVal) {
      // if (this.passive) return
      if (!u.numberValid(val)) return;
      this.scaleRatio = val / this.naturalWidth;
      if (this.hasImage()) {
        if (Math.abs(val - oldVal) > val * (1 / 100000)) {
          this.$emit(events.ZOOM_EVENT);
          this._draw();
        }
      }
    },
    'imgData.height': function imgDataHeight(val) {
      // if (this.passive) return
      if (!u.numberValid(val)) return;
      this.scaleRatio = val / this.naturalHeight;
    },
    'imgData.startX': function imgDataStartX(val) {
      // if (this.passive) return
      if (this.hasImage()) {
        this.$nextTick(this._draw);
      }
    },
    'imgData.startY': function imgDataStartY(val) {
      // if (this.passive) return
      if (this.hasImage()) {
        this.$nextTick(this._draw);
      }
    },
    loading: function loading(val) {
      if (this.passive) return;
      if (val) {
        this.$emit(events.LOADING_START);
      } else {
        this.$emit(events.LOADING_END);
      }
    },
    autoSizing: function autoSizing(val) {
      if (val) {
        this._autoSizingInit();
      }
    }
  },

  methods: {
    getCanvas: function getCanvas() {
      return this.canvas;
    },
    getContext: function getContext() {
      return this.ctx;
    },
    getChosenFile: function getChosenFile() {
      return this.chosenFile || this.$refs.fileInput.files[0];
    },
    move: function move(offset) {
      if (!offset || this.passive) return;
      var oldX = this.imgData.startX;
      var oldY = this.imgData.startY;
      this.imgData.startX += offset.x;
      this.imgData.startY += offset.y;
      if (this.preventWhiteSpace) {
        this._preventMovingToWhiteSpace();
      }
      if (this.imgData.startX !== oldX || this.imgData.startY !== oldY) {
        this.$emit(events.MOVE_EVENT);
        this._draw();
      }
    },
    moveUpwards: function moveUpwards() {
      var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      this.move({ x: 0, y: -amount });
    },
    moveDownwards: function moveDownwards() {
      var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      this.move({ x: 0, y: amount });
    },
    moveLeftwards: function moveLeftwards() {
      var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      this.move({ x: -amount, y: 0 });
    },
    moveRightwards: function moveRightwards() {
      var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      this.move({ x: amount, y: 0 });
    },
    zoom: function zoom() {
      var zoomIn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var acceleration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      if (this.passive) return;
      var realSpeed = this.zoomSpeed * acceleration;
      var speed = this.outputWidth * PCT_PER_ZOOM * realSpeed;
      var x = 1;
      if (zoomIn) {
        x = 1 + speed;
      } else if (this.imgData.width > MIN_WIDTH) {
        x = 1 - speed;
      }

      this.scaleRatio *= x;
    },
    zoomIn: function zoomIn() {
      this.zoom(true);
    },
    zoomOut: function zoomOut() {
      this.zoom(false);
    },
    rotate: function rotate() {
      var step = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      if (this.disableRotation || this.disabled || this.passive) return;
      step = parseInt(step);
      if (isNaN(step) || step > 3 || step < -3) {
        console.warn('Invalid argument for rotate() method. It should one of the integers from -3 to 3.');
        step = 1;
      }
      this._rotateByStep(step);
    },
    flipX: function flipX() {
      if (this.disableRotation || this.disabled || this.passive) return;
      this._setOrientation(2);
    },
    flipY: function flipY() {
      if (this.disableRotation || this.disabled || this.passive) return;
      this._setOrientation(4);
    },
    refresh: function refresh() {
      this.$nextTick(this._initialize);
    },
    hasImage: function hasImage() {
      return !!this.imageSet;
    },
    applyMetadata: function applyMetadata(metadata) {
      if (!metadata || this.passive) return;
      this.userMetadata = metadata;
      var ori = metadata.orientation || this.orientation || 1;
      this._setOrientation(ori, true);
    },
    generateDataUrl: function generateDataUrl(type, compressionRate) {
      if (!this.hasImage()) return '';
      return this.canvas.toDataURL(type, compressionRate);
    },
    generateBlob: function generateBlob(callback, mimeType, qualityArgument) {
      if (!this.hasImage()) {
        callback(null);
        return;
      }
      this.canvas.toBlob(callback, mimeType, qualityArgument);
    },
    promisedBlob: function promisedBlob() {
      var _this2 = this;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (typeof Promise == 'undefined') {
        console.warn('No Promise support. Please add Promise polyfill if you want to use this method.');
        return;
      }
      return new Promise(function (resolve, reject) {
        try {
          _this2.generateBlob.apply(_this2, [function (blob) {
            resolve(blob);
          }].concat(args));
        } catch (err) {
          reject(err);
        }
      });
    },
    getMetadata: function getMetadata() {
      if (!this.hasImage()) return {};
      var _imgData = this.imgData,
          startX = _imgData.startX,
          startY = _imgData.startY;


      return {
        startX: startX,
        startY: startY,
        scale: this.scaleRatio,
        orientation: this.orientation
      };
    },
    supportDetection: function supportDetection() {
      if (typeof window === 'undefined') return;
      var div = document.createElement('div');
      return {
        'basic': window.requestAnimationFrame && window.File && window.FileReader && window.FileList && window.Blob,
        'dnd': 'ondragstart' in div && 'ondrop' in div
      };
    },
    chooseFile: function chooseFile() {
      if (this.passive) return;
      this.$refs.fileInput.click();
    },
    remove: function remove() {
      this._setPlaceholders();

      var hadImage = this.img != null;
      this.originalImage = null;
      this.img = null;
      this.$refs.fileInput.value = '';
      this.imgData = {
        width: 0,
        height: 0,
        startX: 0,
        startY: 0
      };
      this.orientation = 1;
      this.scaleRatio = null;
      this.userMetadata = null;
      this.imageSet = false;
      this.loading = false;
      this.chosenFile = null;
      if (this.video) {
        this.video.pause();
        this.video = null;
      }

      if (hadImage) {
        this.$emit(events.IMAGE_REMOVE_EVENT);
      }
    },
    addClipPlugin: function addClipPlugin(plugin) {
      if (!this.clipPlugins) {
        this.clipPlugins = [];
      }
      if (typeof plugin === 'function' && this.clipPlugins.indexOf(plugin) < 0) {
        this.clipPlugins.push(plugin);
      } else {
        throw Error('Clip plugins should be functions');
      }
    },
    emitNativeEvent: function emitNativeEvent(evt) {
      this.$emit(evt.type, evt);
    },
    _setContainerSize: function _setContainerSize() {
      if (this.$refs.wrapper && getComputedStyle) {
        this.realWidth = +getComputedStyle(this.$refs.wrapper).width.slice(0, -2);
        this.realHeight = +getComputedStyle(this.$refs.wrapper).height.slice(0, -2);
      }
    },
    _autoSizingInit: function _autoSizingInit() {
      if (this.useAutoSizing) {
        this._setContainerSize();
        window.addEventListener('resize', this._setContainerSize);
      }
    },
    _autoSizingRemove: function _autoSizingRemove() {
      if (this.useAutoSizing) {
        window.removeEventListener('resize', this._setContainerSize);
      }
    },
    _initialize: function _initialize() {
      this.canvas = this.$refs.canvas;
      this._setSize();
      this.canvas.style.backgroundColor = !this.canvasColor || this.canvasColor == 'default' ? 'transparent' : typeof this.canvasColor === 'string' ? this.canvasColor : '';
      this.ctx = this.canvas.getContext('2d');
      this.ctx.mozImageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = "high";
      this.ctx.webkitImageSmoothingEnabled = true;
      this.ctx.msImageSmoothingEnabled = true;
      this.ctx.imageSmoothingEnabled = true;
      this.originalImage = null;
      this.img = null;
      this.imageSet = false;
      this.chosenFile = null;
      this._setInitial();
      if (!this.passive) {
        this.$emit(events.INIT_EVENT, this);
      }
    },
    _setSize: function _setSize() {
      this.canvas.width = this.outputWidth;
      this.canvas.height = this.outputHeight;
      this.canvas.style.width = (this.realWidth || this.width) + 'px';
      this.canvas.style.height = (this.realHeight || this.height) + 'px';
    },
    _rotateByStep: function _rotateByStep(step) {
      var orientation = 1;
      switch (step) {
        case 1:
          orientation = 6;
          break;
        case 2:
          orientation = 3;
          break;
        case 3:
          orientation = 8;
          break;
        case -1:
          orientation = 8;
          break;
        case -2:
          orientation = 3;
          break;
        case -3:
          orientation = 6;
          break;
      }
      this._setOrientation(orientation);
    },
    _setImagePlaceholder: function _setImagePlaceholder() {
      var _this3 = this;

      var img = void 0;
      if (this.$slots.placeholder && this.$slots.placeholder[0]) {
        var vNode = this.$slots.placeholder[0];
        var tag = vNode.tag,
            elm = vNode.elm;

        if (tag == 'img' && elm) {
          img = elm;
        }
      }

      if (!img) return;

      var onLoad = function onLoad() {
        _this3.ctx.drawImage(img, 0, 0, _this3.outputWidth, _this3.outputHeight);
      };

      if (u.imageLoaded(img)) {
        onLoad();
      } else {
        img.onload = onLoad;
      }
    },
    _setTextPlaceholder: function _setTextPlaceholder() {
      var ctx = this.ctx;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      var defaultFontSize = this.outputWidth * DEFAULT_PLACEHOLDER_TAKEUP / this.placeholder.length;
      var fontSize = !this.computedPlaceholderFontSize || this.computedPlaceholderFontSize == 0 ? defaultFontSize : this.computedPlaceholderFontSize;
      ctx.font = fontSize + 'px sans-serif';
      ctx.fillStyle = !this.placeholderColor || this.placeholderColor == 'default' ? '#606060' : this.placeholderColor;
      ctx.fillText(this.placeholder, this.outputWidth / 2, this.outputHeight / 2);
    },
    _setPlaceholders: function _setPlaceholders() {
      this._paintBackground();
      this._setImagePlaceholder();
      this._setTextPlaceholder();
    },
    _setInitial: function _setInitial() {
      var _this4 = this;

      var src = void 0,
          img = void 0;
      if (this.$slots.initial && this.$slots.initial[0]) {
        var vNode = this.$slots.initial[0];
        var tag = vNode.tag,
            elm = vNode.elm;

        if (tag == 'img' && elm) {
          img = elm;
        }
      }
      if (this.initialImage && typeof this.initialImage === 'string') {
        src = this.initialImage;
        img = new Image();
        if (!/^data:/.test(src) && !/^blob:/.test(src)) {
          img.setAttribute('crossOrigin', 'anonymous');
        }
        img.src = src;
      } else if (_typeof(this.initialImage) === 'object' && this.initialImage instanceof Image) {
        img = this.initialImage;
      }
      if (!src && !img) {
        this._setPlaceholders();
        return;
      }
      this.currentIsInitial = true;
      if (u.imageLoaded(img)) {
        // this.$emit(events.INITIAL_IMAGE_LOADED_EVENT)
        this._onload(img, +img.dataset['exifOrientation'], true);
      } else {
        this.loading = true;
        img.onload = function () {
          // this.$emit(events.INITIAL_IMAGE_LOADED_EVENT)
          _this4._onload(img, +img.dataset['exifOrientation'], true);
        };

        img.onerror = function () {
          _this4._setPlaceholders();
        };
      }
    },
    _onload: function _onload(img) {
      var orientation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var initial = arguments[2];

      this.originalImage = img;
      this.img = img;

      if (isNaN(orientation)) {
        orientation = 1;
      }

      this._setOrientation(orientation);

      if (initial) {
        this.$emit(events.INITIAL_IMAGE_LOADED_EVENT);
      }
    },
    _onVideoLoad: function _onVideoLoad(video, initial) {
      var _this5 = this;

      this.video = video;
      var canvas = document.createElement('canvas');
      var videoWidth = video.videoWidth,
          videoHeight = video.videoHeight;

      canvas.width = videoWidth;
      canvas.height = videoHeight;
      var ctx = canvas.getContext('2d');
      this.loading = false;
      var drawFrame = function drawFrame(initial) {
        if (!_this5.video) return;
        ctx.drawImage(_this5.video, 0, 0, videoWidth, videoHeight);
        var frame = new Image();
        frame.src = canvas.toDataURL();
        frame.onload = function () {
          _this5.img = frame;
          // this._placeImage()
          if (initial) {
            _this5._placeImage();
          } else {
            _this5._draw();
          }
        };
      };
      drawFrame(true);
      var keepDrawing = function keepDrawing() {
        _this5.$nextTick(function () {
          drawFrame();
          if (!_this5.video || _this5.video.ended || _this5.video.paused) return;
          requestAnimationFrame(keepDrawing);
        });
      };
      this.video.addEventListener('play', function () {
        requestAnimationFrame(keepDrawing);
      });
    },
    _handleClick: function _handleClick(evt) {
      this.emitNativeEvent(evt);
      if (!this.hasImage() && !this.disableClickToChoose && !this.disabled && !this.supportTouch && !this.passive) {
        this.chooseFile();
      }
    },
    _handleDblClick: function _handleDblClick(evt) {
      this.emitNativeEvent(evt);
      if (this.videoEnabled && this.video) {
        if (this.video.paused || this.video.ended) {
          this.video.play();
        } else {
          this.video.pause();
        }
        return;
      }
    },
    _handleInputChange: function _handleInputChange() {
      var input = this.$refs.fileInput;
      if (!input.files.length || this.passive) return;

      var file = input.files[0];
      this._onNewFileIn(file);
    },
    _onNewFileIn: function _onNewFileIn(file) {
      var _this6 = this;

      this.currentIsInitial = false;
      this.loading = true;
      this.$emit(events.FILE_CHOOSE_EVENT, file);
      this.chosenFile = file;
      if (!this._fileSizeIsValid(file)) {
        this.loading = false;
        this.$emit(events.FILE_SIZE_EXCEED_EVENT, file);
        return false;
      }
      if (!this._fileTypeIsValid(file)) {
        this.loading = false;
        this.$emit(events.FILE_TYPE_MISMATCH_EVENT, file);
        var type = file.type || file.name.toLowerCase().split('.').pop();
        return false;
      }

      if (typeof window !== 'undefined' && typeof window.FileReader !== 'undefined') {
        var fr = new FileReader();
        fr.onload = function (e) {
          var fileData = e.target.result;
          var base64 = u.parseDataUrl(fileData);
          var isVideo = /^video/.test(file.type);
          if (isVideo) {
            var video = document.createElement('video');
            video.src = fileData;
            fileData = null;
            if (video.readyState >= video.HAVE_FUTURE_DATA) {
              _this6._onVideoLoad(video);
            } else {
              video.addEventListener('canplay', function () {
                console.log('can play event');
                _this6._onVideoLoad(video);
              }, false);
            }
          } else {
            var orientation = 1;
            try {
              orientation = u.getFileOrientation(u.base64ToArrayBuffer(base64));
            } catch (err) {}
            if (orientation < 1) orientation = 1;
            var img = new Image();
            img.src = fileData;
            fileData = null;
            img.onload = function () {
              _this6._onload(img, orientation);
              _this6.$emit(events.NEW_IMAGE);
            };
          }
        };
        fr.readAsDataURL(file);
      }
    },
    _fileSizeIsValid: function _fileSizeIsValid(file) {
      if (!file) return false;
      if (!this.fileSizeLimit || this.fileSizeLimit == 0) return true;

      return file.size < this.fileSizeLimit;
    },
    _fileTypeIsValid: function _fileTypeIsValid(file) {
      var acceptableMimeType = this.videoEnabled && /^video/.test(file.type) && document.createElement('video').canPlayType(file.type) || /^image/.test(file.type);
      if (!acceptableMimeType) return false;
      if (!this.accept) return true;
      var accept = this.accept;
      var baseMimetype = accept.replace(/\/.*$/, '');
      var types = accept.split(',');
      for (var i = 0, len = types.length; i < len; i++) {
        var type = types[i];
        var t = type.trim();
        if (t.charAt(0) == '.') {
          if (file.name.toLowerCase().split('.').pop() === t.toLowerCase().slice(1)) return true;
        } else if (/\/\*$/.test(t)) {
          var fileBaseType = file.type.replace(/\/.*$/, '');
          if (fileBaseType === baseMimetype) {
            return true;
          }
        } else if (file.type === type) {
          return true;
        }
      }

      return false;
    },
    _placeImage: function _placeImage(applyMetadata) {
      if (!this.img) return;
      var imgData = this.imgData;

      this.naturalWidth = this.img.naturalWidth;
      this.naturalHeight = this.img.naturalHeight;

      imgData.startX = u.numberValid(imgData.startX) ? imgData.startX : 0;
      imgData.startY = u.numberValid(imgData.startY) ? imgData.startY : 0;

      if (this.preventWhiteSpace) {
        this._aspectFill();
      } else if (!this.imageSet) {
        if (this.initialSize == 'contain') {
          this._aspectFit();
        } else if (this.initialSize == 'natural') {
          this._naturalSize();
        } else {
          this._aspectFill();
        }
      } else {
        this.imgData.width = this.naturalWidth * this.scaleRatio;
        this.imgData.height = this.naturalHeight * this.scaleRatio;
      }

      if (!this.imageSet) {
        if (/top/.test(this.initialPosition)) {
          imgData.startY = 0;
        } else if (/bottom/.test(this.initialPosition)) {
          imgData.startY = this.outputHeight - imgData.height;
        }

        if (/left/.test(this.initialPosition)) {
          imgData.startX = 0;
        } else if (/right/.test(this.initialPosition)) {
          imgData.startX = this.outputWidth - imgData.width;
        }

        if (/^-?\d+% -?\d+%$/.test(this.initialPosition)) {
          var result = /^(-?\d+)% (-?\d+)%$/.exec(this.initialPosition);
          var x = +result[1] / 100;
          var y = +result[2] / 100;
          imgData.startX = x * (this.outputWidth - imgData.width);
          imgData.startY = y * (this.outputHeight - imgData.height);
        }
      }

      applyMetadata && this._applyMetadata();

      if (applyMetadata && this.preventWhiteSpace) {
        this.zoom(false, 0);
      } else {
        this.move({ x: 0, y: 0 });
        this._draw();
      }
    },
    _aspectFill: function _aspectFill() {
      var imgWidth = this.naturalWidth;
      var imgHeight = this.naturalHeight;
      var canvasRatio = this.outputWidth / this.outputHeight;
      var scaleRatio = void 0;

      if (this.aspectRatio > canvasRatio) {
        scaleRatio = imgHeight / this.outputHeight;
        this.imgData.width = imgWidth / scaleRatio;
        this.imgData.height = this.outputHeight;
        this.imgData.startX = -(this.imgData.width - this.outputWidth) / 2;
        this.imgData.startY = 0;
      } else {
        scaleRatio = imgWidth / this.outputWidth;
        this.imgData.height = imgHeight / scaleRatio;
        this.imgData.width = this.outputWidth;
        this.imgData.startY = -(this.imgData.height - this.outputHeight) / 2;
        this.imgData.startX = 0;
      }
    },
    _aspectFit: function _aspectFit() {
      var imgWidth = this.naturalWidth;
      var imgHeight = this.naturalHeight;
      var canvasRatio = this.outputWidth / this.outputHeight;
      var scaleRatio = void 0;
      if (this.aspectRatio > canvasRatio) {
        scaleRatio = imgWidth / this.outputWidth;
        this.imgData.height = imgHeight / scaleRatio;
        this.imgData.width = this.outputWidth;
        this.imgData.startY = -(this.imgData.height - this.outputHeight) / 2;
        this.imgData.startX = 0;
      } else {
        scaleRatio = imgHeight / this.outputHeight;
        this.imgData.width = imgWidth / scaleRatio;
        this.imgData.height = this.outputHeight;
        this.imgData.startX = -(this.imgData.width - this.outputWidth) / 2;
        this.imgData.startY = 0;
      }
    },
    _naturalSize: function _naturalSize() {
      var imgWidth = this.naturalWidth;
      var imgHeight = this.naturalHeight;
      this.imgData.width = imgWidth;
      this.imgData.height = imgHeight;
      this.imgData.startX = -(this.imgData.width - this.outputWidth) / 2;
      this.imgData.startY = -(this.imgData.height - this.outputHeight) / 2;
    },
    _handlePointerStart: function _handlePointerStart(evt) {
      this.emitNativeEvent(evt);
      if (this.passive) return;
      this.supportTouch = true;
      this.pointerMoved = false;
      var pointerCoord = u.getPointerCoords(evt, this);
      this.pointerStartCoord = pointerCoord;

      if (this.disabled) return;
      // simulate click with touch on mobile devices
      if (!this.hasImage() && !this.disableClickToChoose) {
        this.tabStart = new Date().valueOf();
        return;
      }
      // ignore mouse right click and middle click
      if (evt.which && evt.which > 1) return;

      if (!evt.touches || evt.touches.length === 1) {
        this.dragging = true;
        this.pinching = false;
        var coord = u.getPointerCoords(evt, this);
        this.lastMovingCoord = coord;
      }

      if (evt.touches && evt.touches.length === 2 && !this.disablePinchToZoom) {
        this.dragging = false;
        this.pinching = true;
        this.pinchDistance = u.getPinchDistance(evt, this);
      }

      var cancelEvents = ['mouseup', 'touchend', 'touchcancel', 'pointerend', 'pointercancel'];
      for (var i = 0, len = cancelEvents.length; i < len; i++) {
        var e = cancelEvents[i];
        document.addEventListener(e, this._handlePointerEnd);
      }
    },
    _handlePointerEnd: function _handlePointerEnd(evt) {
      this.emitNativeEvent(evt);
      if (this.passive) return;
      var pointerMoveDistance = 0;
      if (this.pointerStartCoord) {
        var pointerCoord = u.getPointerCoords(evt, this);
        pointerMoveDistance = Math.sqrt(Math.pow(pointerCoord.x - this.pointerStartCoord.x, 2) + Math.pow(pointerCoord.y - this.pointerStartCoord.y, 2)) || 0;
      }
      if (this.disabled) return;
      if (!this.hasImage() && !this.disableClickToChoose) {
        var tabEnd = new Date().valueOf();
        if (pointerMoveDistance < CLICK_MOVE_THRESHOLD && tabEnd - this.tabStart < MIN_MS_PER_CLICK && this.supportTouch) {
          this.chooseFile();
        }
        this.tabStart = 0;
        return;
      }

      this.dragging = false;
      this.pinching = false;
      this.pinchDistance = 0;
      this.lastMovingCoord = null;
      this.pointerMoved = false;
      this.pointerStartCoord = null;
    },
    _handlePointerMove: function _handlePointerMove(evt) {
      this.emitNativeEvent(evt);
      if (this.passive) return;
      this.pointerMoved = true;
      if (!this.hasImage()) return;
      var coord = u.getPointerCoords(evt, this);
      this.currentPointerCoord = coord;

      if (this.disabled || this.disableDragToMove) return;

      evt.preventDefault();
      if (!evt.touches || evt.touches.length === 1) {
        if (!this.dragging) return;
        if (this.lastMovingCoord) {
          this.move({
            x: coord.x - this.lastMovingCoord.x,
            y: coord.y - this.lastMovingCoord.y
          });
        }
        this.lastMovingCoord = coord;
      }

      if (evt.touches && evt.touches.length === 2 && !this.disablePinchToZoom) {
        if (!this.pinching) return;
        var distance = u.getPinchDistance(evt, this);
        var delta = distance - this.pinchDistance;
        this.zoom(delta > 0, PINCH_ACCELERATION);
        this.pinchDistance = distance;
      }
    },
    _handlePointerLeave: function _handlePointerLeave(evt) {
      this.emitNativeEvent(evt);
      if (this.passive) return;
      this.currentPointerCoord = null;
    },
    _handleWheel: function _handleWheel(evt) {
      var _this7 = this;

      this.emitNativeEvent(evt);
      if (this.passive) return;
      if (this.disabled || this.disableScrollToZoom || !this.hasImage()) return;
      evt.preventDefault();
      this.scrolling = true;
      if (evt.wheelDelta < 0 || evt.deltaY > 0 || evt.detail > 0) {
        this.zoom(this.reverseScrollToZoom);
      } else if (evt.wheelDelta > 0 || evt.deltaY < 0 || evt.detail < 0) {
        this.zoom(!this.reverseScrollToZoom);
      }
      this.$nextTick(function () {
        _this7.scrolling = false;
      });
    },
    _handleDragEnter: function _handleDragEnter(evt) {
      this.emitNativeEvent(evt);
      if (this.passive) return;
      if (this.disabled || this.disableDragAndDrop || !u.eventHasFile(evt)) return;
      if (this.hasImage() && !this.replaceDrop) return;
      this.fileDraggedOver = true;
    },
    _handleDragLeave: function _handleDragLeave(evt) {
      this.emitNativeEvent(evt);
      if (this.passive) return;
      if (!this.fileDraggedOver || !u.eventHasFile(evt)) return;
      this.fileDraggedOver = false;
    },
    _handleDragOver: function _handleDragOver(evt) {
      this.emitNativeEvent(evt);
    },
    _handleDrop: function _handleDrop(evt) {
      this.emitNativeEvent(evt);
      if (this.passive) return;
      if (!this.fileDraggedOver || !u.eventHasFile(evt)) return;
      if (this.hasImage() && this.replaceDrop) {
        this.remove();
      }
      this.fileDraggedOver = false;

      var file = void 0;
      var dt = evt.dataTransfer;
      if (!dt) return;
      if (dt.items) {
        for (var i = 0, len = dt.items.length; i < len; i++) {
          var item = dt.items[i];
          if (item.kind == 'file') {
            file = item.getAsFile();
            break;
          }
        }
      } else {
        file = dt.files[0];
      }

      if (file) {
        this._onNewFileIn(file);
      }
    },
    _preventMovingToWhiteSpace: function _preventMovingToWhiteSpace() {
      if (this.imgData.startX > 0) {
        this.imgData.startX = 0;
      }
      if (this.imgData.startY > 0) {
        this.imgData.startY = 0;
      }
      if (this.outputWidth - this.imgData.startX > this.imgData.width) {
        this.imgData.startX = -(this.imgData.width - this.outputWidth);
      }
      if (this.outputHeight - this.imgData.startY > this.imgData.height) {
        this.imgData.startY = -(this.imgData.height - this.outputHeight);
      }
    },
    _preventZoomingToWhiteSpace: function _preventZoomingToWhiteSpace() {
      if (this.imgData.width < this.outputWidth) {
        this.scaleRatio = this.outputWidth / this.naturalWidth;
      }

      if (this.imgData.height < this.outputHeight) {
        this.scaleRatio = this.outputHeight / this.naturalHeight;
      }
    },
    _setOrientation: function _setOrientation() {
      var _this8 = this;

      var orientation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 6;
      var applyMetadata = arguments[1];

      var useOriginal = applyMetadata;
      if (orientation > 1 || useOriginal) {
        if (!this.img) return;
        this.rotating = true;
        // u.getRotatedImageData(useOriginal ? this.originalImage : this.img, orientation)
        var _img = u.getRotatedImage(useOriginal ? this.originalImage : this.img, orientation);
        _img.onload = function () {
          _this8.img = _img;
          _this8._placeImage(applyMetadata);
        };
      } else {
        this._placeImage(applyMetadata);
      }

      if (orientation == 2) {
        // flip x
        this.orientation = u.flipX(this.orientation);
      } else if (orientation == 4) {
        // flip y
        this.orientation = u.flipY(this.orientation);
      } else if (orientation == 6) {
        // 90 deg
        this.orientation = u.rotate90(this.orientation);
      } else if (orientation == 3) {
        // 180 deg
        this.orientation = u.rotate90(u.rotate90(this.orientation));
      } else if (orientation == 8) {
        // 270 deg
        this.orientation = u.rotate90(u.rotate90(u.rotate90(this.orientation)));
      } else {
        this.orientation = orientation;
      }

      if (useOriginal) {
        this.orientation = orientation;
      }
    },
    _paintBackground: function _paintBackground() {
      var backgroundColor = !this.canvasColor || this.canvasColor == 'default' ? 'transparent' : this.canvasColor;
      this.ctx.fillStyle = backgroundColor;
      this.ctx.clearRect(0, 0, this.outputWidth, this.outputHeight);
      this.ctx.fillRect(0, 0, this.outputWidth, this.outputHeight);
    },
    _draw: function _draw() {
      var _this9 = this;

      this.$nextTick(function () {
        if (typeof window !== 'undefined' && window.requestAnimationFrame) {
          requestAnimationFrame(_this9._drawFrame);
        } else {
          _this9._drawFrame();
        }
      });
    },
    _drawFrame: function _drawFrame() {
      if (!this.img) return;
      this.loading = false;
      var ctx = this.ctx;
      var _imgData2 = this.imgData,
          startX = _imgData2.startX,
          startY = _imgData2.startY,
          width = _imgData2.width,
          height = _imgData2.height;


      this._paintBackground();
      ctx.drawImage(this.img, startX, startY, width, height);

      if (this.preventWhiteSpace) {
        this._clip(this._createContainerClipPath
        // this._clip(this._createImageClipPath)
        );
      }

      this.$emit(events.DRAW, ctx);
      if (!this.imageSet) {
        this.imageSet = true;
        this.$emit(events.NEW_IMAGE_DRAWN);
      }
      this.rotating = false;
    },
    _clipPathFactory: function _clipPathFactory(x, y, width, height) {
      var ctx = this.ctx;
      var radius = typeof this.imageBorderRadius === 'number' ? this.imageBorderRadius : !isNaN(Number(this.imageBorderRadius)) ? Number(this.imageBorderRadius) : 0;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    },
    _createContainerClipPath: function _createContainerClipPath() {
      var _this10 = this;

      this._clipPathFactory(0, 0, this.outputWidth, this.outputHeight);
      if (this.clipPlugins && this.clipPlugins.length) {
        this.clipPlugins.forEach(function (func) {
          func(_this10.ctx, 0, 0, _this10.outputWidth, _this10.outputHeight);
        });
      }
    },


    // _createImageClipPath () {
    //   let { startX, startY, width, height } = this.imgData
    //   let w = width
    //   let h = height
    //   let x = startX
    //   let y = startY
    //   if (w < h) {
    //     h = this.outputHeight * (width / this.outputWidth)
    //   }
    //   if (h < w) {
    //     w = this.outputWidth * (height / this.outputHeight)
    //     x = startX + (width - this.outputWidth) / 2
    //   }
    //   this._clipPathFactory(x, startY, w, h)
    // },

    _clip: function _clip(createPath) {
      var ctx = this.ctx;
      ctx.save();
      ctx.fillStyle = '#fff';
      ctx.globalCompositeOperation = 'destination-in';
      createPath();
      ctx.fill();
      ctx.restore();
    },
    _applyMetadata: function _applyMetadata() {
      var _this11 = this;

      if (!this.userMetadata) return;
      var _userMetadata = this.userMetadata,
          startX = _userMetadata.startX,
          startY = _userMetadata.startY,
          scale = _userMetadata.scale;


      if (u.numberValid(startX)) {
        this.imgData.startX = startX;
      }

      if (u.numberValid(startY)) {
        this.imgData.startY = startY;
      }

      if (u.numberValid(scale)) {
        this.scaleRatio = scale;
      }

      this.$nextTick(function () {
        _this11.userMetadata = null;
      });
    },
    onDimensionChange: function onDimensionChange() {
      if (!this.img) {
        this._initialize();
      } else {
        if (this.preventWhiteSpace) {
          this.imageSet = false;
        }
        this._setSize();
        this._placeImage();
      }
    }
  }
};

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var index$1 = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

var defaultOptions = {
  componentName: 'croppa'
};

var VueCroppa = {
  install: function install(Vue, options) {
    options = index$1({}, defaultOptions, options);
    var version = Number(Vue.version.split('.')[0]);
    if (version < 2) {
      throw new Error('vue-croppa supports vue version 2.0 and above. You are using Vue@' + version + '. Please upgrade to the latest version of Vue.');
    }
    var componentName = options.componentName || 'croppa';

    // registration
    Vue.component(componentName, component);
  },

  component: component
};

return VueCroppa;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLWNyb3BwYS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NhbnZhcy1leGlmLW9yaWVudGF0aW9uL2luZGV4LmpzIiwiLi4vLi4vLi4vc3JjL3V0aWwuanMiLCIuLi8uLi8uLi9zcmMvcHJvcHMuanMiLCIuLi8uLi8uLi9zcmMvZXZlbnRzLmpzIiwiLi4vLi4vLi4vc3JjL2Nyb3BwZXIudnVlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCIuLi8uLi8uLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5DYW52YXNFeGlmT3JpZW50YXRpb24gPSBmYWN0b3J5KCk7XG4gIH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZnVuY3Rpb24gZHJhd0ltYWdlKGltZywgb3JpZW50YXRpb24sIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICBpZiAoIS9eWzEtOF0kLy50ZXN0KG9yaWVudGF0aW9uKSkgdGhyb3cgbmV3IEVycm9yKCdvcmllbnRhdGlvbiBzaG91bGQgYmUgWzEtOF0nKTtcblxuICAgIGlmICh4ID09IG51bGwpIHggPSAwO1xuICAgIGlmICh5ID09IG51bGwpIHkgPSAwO1xuICAgIGlmICh3aWR0aCA9PSBudWxsKSB3aWR0aCA9IGltZy53aWR0aDtcbiAgICBpZiAoaGVpZ2h0ID09IG51bGwpIGhlaWdodCA9IGltZy5oZWlnaHQ7XG5cbiAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICBjdHguc2F2ZSgpO1xuICAgIHN3aXRjaCAoK29yaWVudGF0aW9uKSB7XG4gICAgICAvLyAxID0gVGhlIDB0aCByb3cgaXMgYXQgdGhlIHZpc3VhbCB0b3Agb2YgdGhlIGltYWdlLCBhbmQgdGhlIDB0aCBjb2x1bW4gaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZS5cbiAgICAgIGNhc2UgMTpcbiAgICAgICAgICBicmVhaztcblxuICAgICAgLy8gMiA9IFRoZSAwdGggcm93IGlzIGF0IHRoZSB2aXN1YWwgdG9wIG9mIHRoZSBpbWFnZSwgYW5kIHRoZSAwdGggY29sdW1uIGlzIHRoZSB2aXN1YWwgcmlnaHQtaGFuZCBzaWRlLlxuICAgICAgY2FzZSAyOlxuICAgICAgICAgY3R4LnRyYW5zbGF0ZSh3aWR0aCwgMCk7XG4gICAgICAgICBjdHguc2NhbGUoLTEsIDEpO1xuICAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIDMgPSBUaGUgMHRoIHJvdyBpcyBhdCB0aGUgdmlzdWFsIGJvdHRvbSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIHJpZ2h0LWhhbmQgc2lkZS5cbiAgICAgIGNhc2UgMzpcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoMTgwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIDQgPSBUaGUgMHRoIHJvdyBpcyBhdCB0aGUgdmlzdWFsIGJvdHRvbSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIGxlZnQtaGFuZCBzaWRlLlxuICAgICAgY2FzZSA0OlxuICAgICAgICAgIGN0eC50cmFuc2xhdGUoMCwgaGVpZ2h0KTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA1ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIHRvcC5cbiAgICAgIGNhc2UgNTpcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpZHRoO1xuICAgICAgICAgIGN0eC5yb3RhdGUoOTAgLyAxODAgKiBNYXRoLlBJKTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA2ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCByaWdodC1oYW5kIHNpZGUgb2YgdGhlIGltYWdlLCBhbmQgdGhlIDB0aCBjb2x1bW4gaXMgdGhlIHZpc3VhbCB0b3AuXG4gICAgICBjYXNlIDY6XG4gICAgICAgICAgY2FudmFzLndpZHRoID0gaGVpZ2h0O1xuICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSB3aWR0aDtcbiAgICAgICAgICBjdHgucm90YXRlKDkwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgY3R4LnRyYW5zbGF0ZSgwLCAtaGVpZ2h0KTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgLy8gNyA9IFRoZSAwdGggcm93IGlzIHRoZSB2aXN1YWwgcmlnaHQtaGFuZCBzaWRlIG9mIHRoZSBpbWFnZSwgYW5kIHRoZSAwdGggY29sdW1uIGlzIHRoZSB2aXN1YWwgYm90dG9tLlxuICAgICAgY2FzZSA3OlxuICAgICAgICAgIGNhbnZhcy53aWR0aCA9IGhlaWdodDtcbiAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gd2lkdGg7XG4gICAgICAgICAgY3R4LnJvdGF0ZSgyNzAgLyAxODAgKiBNYXRoLlBJKTtcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKC13aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA4ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIGJvdHRvbS5cbiAgICAgIGNhc2UgODpcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpZHRoO1xuICAgICAgICAgIGN0eC50cmFuc2xhdGUoMCwgd2lkdGgpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoMjcwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY3R4LmRyYXdJbWFnZShpbWcsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICByZXR1cm4gY2FudmFzO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBkcmF3SW1hZ2U6IGRyYXdJbWFnZVxuICB9O1xufSkpO1xuIiwiaW1wb3J0IENhbnZhc0V4aWZPcmllbnRhdGlvbiBmcm9tICdjYW52YXMtZXhpZi1vcmllbnRhdGlvbidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBvbmVQb2ludENvb3JkIChwb2ludCwgdm0pIHtcclxuICAgIGxldCB7IGNhbnZhcywgcXVhbGl0eSB9ID0gdm1cclxuICAgIGxldCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICBsZXQgY2xpZW50WCA9IHBvaW50LmNsaWVudFhcclxuICAgIGxldCBjbGllbnRZID0gcG9pbnQuY2xpZW50WVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDogKGNsaWVudFggLSByZWN0LmxlZnQpICogcXVhbGl0eSxcclxuICAgICAgeTogKGNsaWVudFkgLSByZWN0LnRvcCkgKiBxdWFsaXR5XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZ2V0UG9pbnRlckNvb3JkcyAoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXJcclxuICAgIGlmIChldnQudG91Y2hlcyAmJiBldnQudG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIH0gZWxzZSBpZiAoZXZ0LmNoYW5nZWRUb3VjaGVzICYmIGV2dC5jaGFuZ2VkVG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LmNoYW5nZWRUb3VjaGVzWzBdXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwb2ludGVyID0gZXZ0XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIsIHZtKVxyXG4gIH0sXHJcblxyXG4gIGdldFBpbmNoRGlzdGFuY2UgKGV2dCwgdm0pIHtcclxuICAgIGxldCBwb2ludGVyMSA9IGV2dC50b3VjaGVzWzBdXHJcbiAgICBsZXQgcG9pbnRlcjIgPSBldnQudG91Y2hlc1sxXVxyXG4gICAgbGV0IGNvb3JkMSA9IHRoaXMub25lUG9pbnRDb29yZChwb2ludGVyMSwgdm0pXHJcbiAgICBsZXQgY29vcmQyID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIyLCB2bSlcclxuXHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KGNvb3JkMS54IC0gY29vcmQyLngsIDIpICsgTWF0aC5wb3coY29vcmQxLnkgLSBjb29yZDIueSwgMikpXHJcbiAgfSxcclxuXHJcbiAgZ2V0UGluY2hDZW50ZXJDb29yZCAoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXIxID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIGxldCBwb2ludGVyMiA9IGV2dC50b3VjaGVzWzFdXHJcbiAgICBsZXQgY29vcmQxID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIxLCB2bSlcclxuICAgIGxldCBjb29yZDIgPSB0aGlzLm9uZVBvaW50Q29vcmQocG9pbnRlcjIsIHZtKVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHg6IChjb29yZDEueCArIGNvb3JkMi54KSAvIDIsXHJcbiAgICAgIHk6IChjb29yZDEueSArIGNvb3JkMi55KSAvIDJcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBpbWFnZUxvYWRlZCAoaW1nKSB7XHJcbiAgICByZXR1cm4gaW1nLmNvbXBsZXRlICYmIGltZy5uYXR1cmFsV2lkdGggIT09IDBcclxuICB9LFxyXG5cclxuICByQUZQb2x5ZmlsbCAoKSB7XHJcbiAgICAvLyByQUYgcG9seWZpbGxcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJykgcmV0dXJuXHJcbiAgICB2YXIgbGFzdFRpbWUgPSAwXHJcbiAgICB2YXIgdmVuZG9ycyA9IFsnd2Via2l0JywgJ21veiddXHJcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddXHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gfHwgICAgLy8gV2Via2l05Lit5q2k5Y+W5raI5pa55rOV55qE5ZCN5a2X5Y+Y5LqGXHJcbiAgICAgICAgd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ11cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXHJcbiAgICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNi43IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKVxyXG4gICAgICAgIHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHZhciBhcmcgPSBjdXJyVGltZSArIHRpbWVUb0NhbGxcclxuICAgICAgICAgIGNhbGxiYWNrKGFyZylcclxuICAgICAgICB9LCB0aW1lVG9DYWxsKVxyXG4gICAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsXHJcbiAgICAgICAgcmV0dXJuIGlkXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKSB7XHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgIGNsZWFyVGltZW91dChpZClcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEFycmF5LmlzQXJyYXkgPSBmdW5jdGlvbiAoYXJnKSB7XHJcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHRvQmxvYlBvbHlmaWxsICgpIHtcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJyB8fCAhSFRNTENhbnZhc0VsZW1lbnQpIHJldHVyblxyXG4gICAgdmFyIGJpblN0ciwgbGVuLCBhcnJcclxuICAgIGlmICghSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLnRvQmxvYikge1xyXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLCAndG9CbG9iJywge1xyXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoY2FsbGJhY2ssIHR5cGUsIHF1YWxpdHkpIHtcclxuICAgICAgICAgIGJpblN0ciA9IGF0b2IodGhpcy50b0RhdGFVUkwodHlwZSwgcXVhbGl0eSkuc3BsaXQoJywnKVsxXSlcclxuICAgICAgICAgIGxlbiA9IGJpblN0ci5sZW5ndGhcclxuICAgICAgICAgIGFyciA9IG5ldyBVaW50OEFycmF5KGxlbilcclxuXHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGFycltpXSA9IGJpblN0ci5jaGFyQ29kZUF0KGkpXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgY2FsbGJhY2sobmV3IEJsb2IoW2Fycl0sIHsgdHlwZTogdHlwZSB8fCAnaW1hZ2UvcG5nJyB9KSlcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZXZlbnRIYXNGaWxlIChldnQpIHtcclxuICAgIHZhciBkdCA9IGV2dC5kYXRhVHJhbnNmZXIgfHwgZXZ0Lm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyXHJcbiAgICBpZiAoZHQudHlwZXMpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGR0LnR5cGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGR0LnR5cGVzW2ldID09ICdGaWxlcycpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfSxcclxuXHJcbiAgZ2V0RmlsZU9yaWVudGF0aW9uIChhcnJheUJ1ZmZlcikge1xyXG4gICAgdmFyIHZpZXcgPSBuZXcgRGF0YVZpZXcoYXJyYXlCdWZmZXIpXHJcbiAgICBpZiAodmlldy5nZXRVaW50MTYoMCwgZmFsc2UpICE9IDB4RkZEOCkgcmV0dXJuIC0yXHJcbiAgICB2YXIgbGVuZ3RoID0gdmlldy5ieXRlTGVuZ3RoXHJcbiAgICB2YXIgb2Zmc2V0ID0gMlxyXG4gICAgd2hpbGUgKG9mZnNldCA8IGxlbmd0aCkge1xyXG4gICAgICB2YXIgbWFya2VyID0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBmYWxzZSlcclxuICAgICAgb2Zmc2V0ICs9IDJcclxuICAgICAgaWYgKG1hcmtlciA9PSAweEZGRTEpIHtcclxuICAgICAgICBpZiAodmlldy5nZXRVaW50MzIob2Zmc2V0ICs9IDIsIGZhbHNlKSAhPSAweDQ1Nzg2OTY2KSByZXR1cm4gLTFcclxuICAgICAgICB2YXIgbGl0dGxlID0gdmlldy5nZXRVaW50MTYob2Zmc2V0ICs9IDYsIGZhbHNlKSA9PSAweDQ5NDlcclxuICAgICAgICBvZmZzZXQgKz0gdmlldy5nZXRVaW50MzIob2Zmc2V0ICsgNCwgbGl0dGxlKVxyXG4gICAgICAgIHZhciB0YWdzID0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBsaXR0bGUpXHJcbiAgICAgICAgb2Zmc2V0ICs9IDJcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhZ3M7IGkrKykge1xyXG4gICAgICAgICAgaWYgKHZpZXcuZ2V0VWludDE2KG9mZnNldCArIChpICogMTIpLCBsaXR0bGUpID09IDB4MDExMikge1xyXG4gICAgICAgICAgICByZXR1cm4gdmlldy5nZXRVaW50MTYob2Zmc2V0ICsgKGkgKiAxMikgKyA4LCBsaXR0bGUpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKChtYXJrZXIgJiAweEZGMDApICE9IDB4RkYwMCkgYnJlYWtcclxuICAgICAgZWxzZSBvZmZzZXQgKz0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBmYWxzZSlcclxuICAgIH1cclxuICAgIHJldHVybiAtMVxyXG4gIH0sXHJcblxyXG4gIHBhcnNlRGF0YVVybCAodXJsKSB7XHJcbiAgICBjb25zdCByZWcgPSAvXmRhdGE6KFteO10rKT8oO2Jhc2U2NCk/LCguKikvZ21pXHJcbiAgICByZXR1cm4gcmVnLmV4ZWModXJsKVszXVxyXG4gIH0sXHJcblxyXG4gIGJhc2U2NFRvQXJyYXlCdWZmZXIgKGJhc2U2NCkge1xyXG4gICAgdmFyIGJpbmFyeVN0cmluZyA9IGF0b2IoYmFzZTY0KVxyXG4gICAgdmFyIGxlbiA9IGJpbmFyeVN0cmluZy5sZW5ndGhcclxuICAgIHZhciBieXRlcyA9IG5ldyBVaW50OEFycmF5KGxlbilcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgYnl0ZXNbaV0gPSBiaW5hcnlTdHJpbmcuY2hhckNvZGVBdChpKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJ5dGVzLmJ1ZmZlclxyXG4gIH0sXHJcblxyXG4gIGdldFJvdGF0ZWRJbWFnZSAoaW1nLCBvcmllbnRhdGlvbikge1xyXG4gICAgdmFyIF9jYW52YXMgPSBDYW52YXNFeGlmT3JpZW50YXRpb24uZHJhd0ltYWdlKGltZywgb3JpZW50YXRpb24pXHJcbiAgICB2YXIgX2ltZyA9IG5ldyBJbWFnZSgpXHJcbiAgICBfaW1nLnNyYyA9IF9jYW52YXMudG9EYXRhVVJMKClcclxuICAgIHJldHVybiBfaW1nXHJcbiAgfSxcclxuXHJcbiAgZmxpcFggKG9yaSkge1xyXG4gICAgaWYgKG9yaSAlIDIgPT0gMCkge1xyXG4gICAgICByZXR1cm4gb3JpIC0gMVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvcmkgKyAxXHJcbiAgfSxcclxuXHJcbiAgZmxpcFkgKG9yaSkge1xyXG4gICAgY29uc3QgbWFwID0ge1xyXG4gICAgICAxOiA0LFxyXG4gICAgICA0OiAxLFxyXG4gICAgICAyOiAzLFxyXG4gICAgICAzOiAyLFxyXG4gICAgICA1OiA4LFxyXG4gICAgICA4OiA1LFxyXG4gICAgICA2OiA3LFxyXG4gICAgICA3OiA2XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcFtvcmldXHJcbiAgfSxcclxuXHJcbiAgcm90YXRlOTAgKG9yaSkge1xyXG4gICAgY29uc3QgbWFwID0ge1xyXG4gICAgICAxOiA2LFxyXG4gICAgICAyOiA3LFxyXG4gICAgICAzOiA4LFxyXG4gICAgICA0OiA1LFxyXG4gICAgICA1OiAyLFxyXG4gICAgICA2OiAzLFxyXG4gICAgICA3OiA0LFxyXG4gICAgICA4OiAxXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcFtvcmldXHJcbiAgfSxcclxuXHJcbiAgbnVtYmVyVmFsaWQgKG4pIHtcclxuICAgIHJldHVybiB0eXBlb2YgbiA9PT0gJ251bWJlcicgJiYgIWlzTmFOKG4pXHJcbiAgfVxyXG59IiwiTnVtYmVyLmlzSW50ZWdlciA9XHJcbiAgTnVtYmVyLmlzSW50ZWdlciB8fFxyXG4gIGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJlxyXG4gICAgICBpc0Zpbml0ZSh2YWx1ZSkgJiZcclxuICAgICAgTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlXHJcbiAgICApXHJcbiAgfVxyXG5cclxudmFyIGluaXRpYWxJbWFnZVR5cGUgPSBTdHJpbmdcclxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5JbWFnZSkge1xyXG4gIGluaXRpYWxJbWFnZVR5cGUgPSBbU3RyaW5nLCBJbWFnZV1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHZhbHVlOiBPYmplY3QsXHJcbiAgd2lkdGg6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIwMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgaGVpZ2h0OiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAyMDAsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIHBsYWNlaG9sZGVyOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAnQ2hvb3NlIGFuIGltYWdlJ1xyXG4gIH0sXHJcbiAgcGxhY2Vob2xkZXJDb2xvcjoge1xyXG4gICAgZGVmYXVsdDogJyM2MDYwNjAnXHJcbiAgfSxcclxuICBwbGFjZWhvbGRlckZvbnRTaXplOiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAwLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHJldHVybiB2YWwgPj0gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgY2FudmFzQ29sb3I6IHtcclxuICAgIGRlZmF1bHQ6ICd0cmFuc3BhcmVudCdcclxuICB9LFxyXG4gIHF1YWxpdHk6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIHpvb21TcGVlZDoge1xyXG4gICAgZGVmYXVsdDogMyxcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYWNjZXB0OiBTdHJpbmcsXHJcbiAgZmlsZVNpemVMaW1pdDoge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID49IDBcclxuICAgIH1cclxuICB9LFxyXG4gIGRpc2FibGVkOiBCb29sZWFuLFxyXG4gIGRpc2FibGVEcmFnQW5kRHJvcDogQm9vbGVhbixcclxuICBkaXNhYmxlQ2xpY2tUb0Nob29zZTogQm9vbGVhbixcclxuICBkaXNhYmxlRHJhZ1RvTW92ZTogQm9vbGVhbixcclxuICBkaXNhYmxlU2Nyb2xsVG9ab29tOiBCb29sZWFuLFxyXG4gIGRpc2FibGVQaW5jaFRvWm9vbTogQm9vbGVhbixcclxuICBkaXNhYmxlUm90YXRpb246IEJvb2xlYW4sXHJcbiAgcmV2ZXJzZVNjcm9sbFRvWm9vbTogQm9vbGVhbixcclxuICBwcmV2ZW50V2hpdGVTcGFjZTogQm9vbGVhbixcclxuICBzaG93UmVtb3ZlQnV0dG9uOiB7XHJcbiAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgZGVmYXVsdDogdHJ1ZVxyXG4gIH0sXHJcbiAgcmVtb3ZlQnV0dG9uQ29sb3I6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICdyZWQnXHJcbiAgfSxcclxuICByZW1vdmVCdXR0b25TaXplOiB7XHJcbiAgICB0eXBlOiBOdW1iZXJcclxuICB9LFxyXG4gIGluaXRpYWxJbWFnZTogaW5pdGlhbEltYWdlVHlwZSxcclxuICBpbml0aWFsU2l6ZToge1xyXG4gICAgdHlwZTogU3RyaW5nLFxyXG4gICAgZGVmYXVsdDogJ2NvdmVyJyxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID09PSAnY292ZXInIHx8IHZhbCA9PT0gJ2NvbnRhaW4nIHx8IHZhbCA9PT0gJ25hdHVyYWwnXHJcbiAgICB9XHJcbiAgfSxcclxuICBpbml0aWFsUG9zaXRpb246IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICdjZW50ZXInLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHZhciB2YWxpZHMgPSBbJ2NlbnRlcicsICd0b3AnLCAnYm90dG9tJywgJ2xlZnQnLCAncmlnaHQnXVxyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIHZhbC5zcGxpdCgnICcpLmV2ZXJ5KHdvcmQgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIHZhbGlkcy5pbmRleE9mKHdvcmQpID49IDBcclxuICAgICAgICB9KSB8fCAvXi0/XFxkKyUgLT9cXGQrJSQvLnRlc3QodmFsKVxyXG4gICAgICApXHJcbiAgICB9XHJcbiAgfSxcclxuICBpbnB1dEF0dHJzOiBPYmplY3QsXHJcbiAgc2hvd0xvYWRpbmc6IEJvb2xlYW4sXHJcbiAgbG9hZGluZ1NpemU6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIwXHJcbiAgfSxcclxuICBsb2FkaW5nQ29sb3I6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICcjNjA2MDYwJ1xyXG4gIH0sXHJcbiAgcmVwbGFjZURyb3A6IEJvb2xlYW4sXHJcbiAgcGFzc2l2ZTogQm9vbGVhbixcclxuICBpbWFnZUJvcmRlclJhZGl1czoge1xyXG4gICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcclxuICAgIGRlZmF1bHQ6IDBcclxuICB9LFxyXG4gIGF1dG9TaXppbmc6IEJvb2xlYW4sXHJcbiAgdmlkZW9FbmFibGVkOiBCb29sZWFuLFxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcbiAgSU5JVF9FVkVOVDogJ2luaXQnLFxuICBGSUxFX0NIT09TRV9FVkVOVDogJ2ZpbGUtY2hvb3NlJyxcbiAgRklMRV9TSVpFX0VYQ0VFRF9FVkVOVDogJ2ZpbGUtc2l6ZS1leGNlZWQnLFxuICBGSUxFX1RZUEVfTUlTTUFUQ0hfRVZFTlQ6ICdmaWxlLXR5cGUtbWlzbWF0Y2gnLFxuICBORVdfSU1BR0U6ICduZXctaW1hZ2UnLFxuICBORVdfSU1BR0VfRFJBV046ICduZXctaW1hZ2UtZHJhd24nLFxuICBJTUFHRV9SRU1PVkVfRVZFTlQ6ICdpbWFnZS1yZW1vdmUnLFxuICBNT1ZFX0VWRU5UOiAnbW92ZScsXG4gIFpPT01fRVZFTlQ6ICd6b29tJyxcbiAgRFJBVzogJ2RyYXcnLFxuICBJTklUSUFMX0lNQUdFX0xPQURFRF9FVkVOVDogJ2luaXRpYWwtaW1hZ2UtbG9hZGVkJyxcbiAgTE9BRElOR19TVEFSVDogJ2xvYWRpbmctc3RhcnQnLFxuICBMT0FESU5HX0VORDogJ2xvYWRpbmctZW5kJ1xufVxuIiwiPHRlbXBsYXRlPlxyXG4gIDxkaXYgcmVmPVwid3JhcHBlclwiXHJcbiAgICA6Y2xhc3M9XCJgY3JvcHBhLWNvbnRhaW5lciAke2ltZyA/ICdjcm9wcGEtLWhhcy10YXJnZXQnIDogJyd9ICR7cGFzc2l2ZSA/ICdjcm9wcGEtLXBhc3NpdmUnIDogJyd9ICR7ZGlzYWJsZWQgPyAnY3JvcHBhLS1kaXNhYmxlZCcgOiAnJ30gJHtkaXNhYmxlQ2xpY2tUb0Nob29zZSA/ICdjcm9wcGEtLWRpc2FibGVkLWNjJyA6ICcnfSAke2Rpc2FibGVEcmFnVG9Nb3ZlICYmIGRpc2FibGVTY3JvbGxUb1pvb20gPyAnY3JvcHBhLS1kaXNhYmxlZC1teicgOiAnJ30gJHtmaWxlRHJhZ2dlZE92ZXIgPyAnY3JvcHBhLS1kcm9wem9uZScgOiAnJ31gXCJcclxuICAgIEBkcmFnZW50ZXIuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZURyYWdFbnRlclwiXHJcbiAgICBAZHJhZ2xlYXZlLnN0b3AucHJldmVudD1cIl9oYW5kbGVEcmFnTGVhdmVcIlxyXG4gICAgQGRyYWdvdmVyLnN0b3AucHJldmVudD1cIl9oYW5kbGVEcmFnT3ZlclwiXHJcbiAgICBAZHJvcC5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlRHJvcFwiPlxyXG4gICAgPGlucHV0IHR5cGU9XCJmaWxlXCJcclxuICAgICAgOmFjY2VwdD1cImFjY2VwdFwiXHJcbiAgICAgIDpkaXNhYmxlZD1cImRpc2FibGVkXCJcclxuICAgICAgdi1iaW5kPVwiaW5wdXRBdHRyc1wiXHJcbiAgICAgIHJlZj1cImZpbGVJbnB1dFwiXHJcbiAgICAgIEBjaGFuZ2U9XCJfaGFuZGxlSW5wdXRDaGFuZ2VcIlxyXG4gICAgICBzdHlsZT1cImhlaWdodDoxcHg7d2lkdGg6MXB4O292ZXJmbG93OmhpZGRlbjttYXJnaW4tbGVmdDotOTk5OTlweDtwb3NpdGlvbjphYnNvbHV0ZTtcIiAvPlxyXG4gICAgPGRpdiBjbGFzcz1cInNsb3RzXCJcclxuICAgICAgc3R5bGU9XCJ3aWR0aDogMDsgaGVpZ2h0OiAwOyB2aXNpYmlsaXR5OiBoaWRkZW47XCI+XHJcbiAgICAgIDxzbG90IG5hbWU9XCJpbml0aWFsXCI+PC9zbG90PlxyXG4gICAgICA8c2xvdCBuYW1lPVwicGxhY2Vob2xkZXJcIj48L3Nsb3Q+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxjYW52YXMgcmVmPVwiY2FudmFzXCJcclxuICAgICAgQGNsaWNrLnN0b3AucHJldmVudD1cIl9oYW5kbGVDbGlja1wiXHJcbiAgICAgIEBkYmxjbGljay5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlRGJsQ2xpY2tcIlxyXG4gICAgICBAdG91Y2hzdGFydC5zdG9wPVwiX2hhbmRsZVBvaW50ZXJTdGFydFwiXHJcbiAgICAgIEBtb3VzZWRvd24uc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJTdGFydFwiXHJcbiAgICAgIEBwb2ludGVyc3RhcnQuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJTdGFydFwiXHJcbiAgICAgIEB0b3VjaGVuZC5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgIEB0b3VjaGNhbmNlbC5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgIEBtb3VzZXVwLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgQHBvaW50ZXJlbmQuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICBAcG9pbnRlcmNhbmNlbC5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgIEB0b3VjaG1vdmUuc3RvcD1cIl9oYW5kbGVQb2ludGVyTW92ZVwiXHJcbiAgICAgIEBtb3VzZW1vdmUuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJNb3ZlXCJcclxuICAgICAgQHBvaW50ZXJtb3ZlLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyTW92ZVwiXHJcbiAgICAgIEBwb2ludGVybGVhdmUuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJMZWF2ZVwiXHJcbiAgICAgIEBET01Nb3VzZVNjcm9sbC5zdG9wPVwiX2hhbmRsZVdoZWVsXCJcclxuICAgICAgQHdoZWVsLnN0b3A9XCJfaGFuZGxlV2hlZWxcIlxyXG4gICAgICBAbW91c2V3aGVlbC5zdG9wPVwiX2hhbmRsZVdoZWVsXCI+PC9jYW52YXM+XHJcbiAgICA8c3ZnIGNsYXNzPVwiaWNvbiBpY29uLXJlbW92ZVwiXHJcbiAgICAgIHYtaWY9XCJzaG93UmVtb3ZlQnV0dG9uICYmIGltZyAmJiAhcGFzc2l2ZVwiXHJcbiAgICAgIEBjbGljaz1cInJlbW92ZVwiXHJcbiAgICAgIDpzdHlsZT1cImB0b3A6IC0ke2hlaWdodC80MH1weDsgcmlnaHQ6IC0ke3dpZHRoLzQwfXB4YFwiXHJcbiAgICAgIHZpZXdCb3g9XCIwIDAgMTAyNCAxMDI0XCJcclxuICAgICAgdmVyc2lvbj1cIjEuMVwiXHJcbiAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxyXG4gICAgICB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIlxyXG4gICAgICA6d2lkdGg9XCJyZW1vdmVCdXR0b25TaXplIHx8IHdpZHRoLzEwXCJcclxuICAgICAgOmhlaWdodD1cInJlbW92ZUJ1dHRvblNpemUgfHwgd2lkdGgvMTBcIj5cclxuICAgICAgPHBhdGggZD1cIk01MTEuOTIxMjMxIDBDMjI5LjE3OTA3NyAwIDAgMjI5LjI1Nzg0NiAwIDUxMiAwIDc5NC43MDI3NjkgMjI5LjE3OTA3NyAxMDI0IDUxMS45MjEyMzEgMTAyNCA3OTQuNzgxNTM4IDEwMjQgMTAyNCA3OTQuNzAyNzY5IDEwMjQgNTEyIDEwMjQgMjI5LjI1Nzg0NiA3OTQuNzgxNTM4IDAgNTExLjkyMTIzMSAwWk03MzIuMDQxODQ2IDY1MC42MzM4NDYgNjUwLjUxNTY5MiA3MzIuMDgxMjMxQzY1MC41MTU2OTIgNzMyLjA4MTIzMSA1MjEuNDkxNjkyIDU5My42ODM2OTIgNTExLjg4MTg0NiA1OTMuNjgzNjkyIDUwMi40Mjk1MzggNTkzLjY4MzY5MiAzNzMuMzY2MTU0IDczMi4wODEyMzEgMzczLjM2NjE1NCA3MzIuMDgxMjMxTDI5MS43NjEyMzEgNjUwLjYzMzg0NkMyOTEuNzYxMjMxIDY1MC42MzM4NDYgNDMwLjMxNjMwOCA1MjMuNTAwMzA4IDQzMC4zMTYzMDggNTEyLjE5NjkyMyA0MzAuMzE2MzA4IDUwMC42OTY2MTUgMjkxLjc2MTIzMSAzNzMuNTIzNjkyIDI5MS43NjEyMzEgMzczLjUyMzY5MkwzNzMuMzY2MTU0IDI5MS45MTg3NjlDMzczLjM2NjE1NCAyOTEuOTE4NzY5IDUwMy40NTM1MzggNDMwLjM5NTA3NyA1MTEuODgxODQ2IDQzMC4zOTUwNzcgNTIwLjM0OTUzOCA0MzAuMzk1MDc3IDY1MC41MTU2OTIgMjkxLjkxODc2OSA2NTAuNTE1NjkyIDI5MS45MTg3NjlMNzMyLjA0MTg0NiAzNzMuNTIzNjkyQzczMi4wNDE4NDYgMzczLjUyMzY5MiA1OTMuNDQ3Mzg1IDUwMi41NDc2OTIgNTkzLjQ0NzM4NSA1MTIuMTk2OTIzIDU5My40NDczODUgNTIxLjQxMjkyMyA3MzIuMDQxODQ2IDY1MC42MzM4NDYgNzMyLjA0MTg0NiA2NTAuNjMzODQ2WlwiXHJcbiAgICAgICAgOmZpbGw9XCJyZW1vdmVCdXR0b25Db2xvclwiPjwvcGF0aD5cclxuICAgIDwvc3ZnPlxyXG4gICAgPGRpdiBjbGFzcz1cInNrLWZhZGluZy1jaXJjbGVcIlxyXG4gICAgICA6c3R5bGU9XCJsb2FkaW5nU3R5bGVcIlxyXG4gICAgICB2LWlmPVwic2hvd0xvYWRpbmcgJiYgbG9hZGluZ1wiPlxyXG4gICAgICA8ZGl2IDpjbGFzcz1cImBzay1jaXJjbGUke2l9IHNrLWNpcmNsZWBcIlxyXG4gICAgICAgIHYtZm9yPVwiaSBpbiAxMlwiXHJcbiAgICAgICAgOmtleT1cImlcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwic2stY2lyY2xlLWluZGljYXRvclwiXHJcbiAgICAgICAgICA6c3R5bGU9XCJ7YmFja2dyb3VuZENvbG9yOiBsb2FkaW5nQ29sb3J9XCI+PC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8c2xvdD48L3Nsb3Q+XHJcbiAgPC9kaXY+XHJcbjwvdGVtcGxhdGU+XHJcblxyXG48c2NyaXB0PlxyXG5pbXBvcnQgdSBmcm9tICcuL3V0aWwnXHJcbmltcG9ydCBwcm9wcyBmcm9tICcuL3Byb3BzJ1xyXG5pbXBvcnQgZXZlbnRzIGZyb20gJy4vZXZlbnRzJ1xyXG5cclxuY29uc3QgUENUX1BFUl9aT09NID0gMSAvIDEwMDAwMCAvLyBUaGUgYW1vdW50IG9mIHpvb21pbmcgZXZlcnl0aW1lIGl0IGhhcHBlbnMsIGluIHBlcmNlbnRhZ2Ugb2YgaW1hZ2Ugd2lkdGguXHJcbmNvbnN0IE1JTl9NU19QRVJfQ0xJQ0sgPSA1MDAgLy8gSWYgdG91Y2ggZHVyYXRpb24gaXMgc2hvcnRlciB0aGFuIHRoZSB2YWx1ZSwgdGhlbiBpdCBpcyBjb25zaWRlcmVkIGFzIGEgY2xpY2suXHJcbmNvbnN0IENMSUNLX01PVkVfVEhSRVNIT0xEID0gMTAwIC8vIElmIHRvdWNoIG1vdmUgZGlzdGFuY2UgaXMgZ3JlYXRlciB0aGFuIHRoaXMgdmFsdWUsIHRoZW4gaXQgd2lsbCBieSBubyBtZWFuIGJlIGNvbnNpZGVyZWQgYXMgYSBjbGljay5cclxuY29uc3QgTUlOX1dJRFRIID0gMTAgLy8gVGhlIG1pbmltYWwgd2lkdGggdGhlIHVzZXIgY2FuIHpvb20gdG8uXHJcbmNvbnN0IERFRkFVTFRfUExBQ0VIT0xERVJfVEFLRVVQID0gMiAvIDMgLy8gUGxhY2Vob2xkZXIgdGV4dCBieSBkZWZhdWx0IHRha2VzIHVwIHRoaXMgYW1vdW50IG9mIHRpbWVzIG9mIGNhbnZhcyB3aWR0aC5cclxuY29uc3QgUElOQ0hfQUNDRUxFUkFUSU9OID0gMSAvLyBUaGUgYW1vdW50IG9mIHRpbWVzIGJ5IHdoaWNoIHRoZSBwaW5jaGluZyBpcyBtb3JlIHNlbnNpdGl2ZSB0aGFuIHRoZSBzY29sbGluZ1xyXG5cclxuY29uc3Qgc3luY0RhdGEgPSBbJ2ltZ0RhdGEnLCAnaW1nJywgJ2ltZ1NldCcsICdvcmlnaW5hbEltYWdlJywgJ25hdHVyYWxIZWlnaHQnLCAnbmF0dXJhbFdpZHRoJywgJ29yaWVudGF0aW9uJywgJ3NjYWxlUmF0aW8nXVxyXG4vLyBjb25zdCBERUJVRyA9IGZhbHNlXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgbW9kZWw6IHtcclxuICAgIHByb3A6ICd2YWx1ZScsXHJcbiAgICBldmVudDogZXZlbnRzLklOSVRfRVZFTlRcclxuICB9LFxyXG5cclxuICBwcm9wczogcHJvcHMsXHJcblxyXG4gIGRhdGEgKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgY2FudmFzOiBudWxsLFxyXG4gICAgICBjdHg6IG51bGwsXHJcbiAgICAgIG9yaWdpbmFsSW1hZ2U6IG51bGwsXHJcbiAgICAgIGltZzogbnVsbCxcclxuICAgICAgdmlkZW86IG51bGwsXHJcbiAgICAgIGRyYWdnaW5nOiBmYWxzZSxcclxuICAgICAgbGFzdE1vdmluZ0Nvb3JkOiBudWxsLFxyXG4gICAgICBpbWdEYXRhOiB7XHJcbiAgICAgICAgd2lkdGg6IDAsXHJcbiAgICAgICAgaGVpZ2h0OiAwLFxyXG4gICAgICAgIHN0YXJ0WDogMCxcclxuICAgICAgICBzdGFydFk6IDBcclxuICAgICAgfSxcclxuICAgICAgZmlsZURyYWdnZWRPdmVyOiBmYWxzZSxcclxuICAgICAgdGFiU3RhcnQ6IDAsXHJcbiAgICAgIHNjcm9sbGluZzogZmFsc2UsXHJcbiAgICAgIHBpbmNoaW5nOiBmYWxzZSxcclxuICAgICAgcm90YXRpbmc6IGZhbHNlLFxyXG4gICAgICBwaW5jaERpc3RhbmNlOiAwLFxyXG4gICAgICBzdXBwb3J0VG91Y2g6IGZhbHNlLFxyXG4gICAgICBwb2ludGVyTW92ZWQ6IGZhbHNlLFxyXG4gICAgICBwb2ludGVyU3RhcnRDb29yZDogbnVsbCxcclxuICAgICAgbmF0dXJhbFdpZHRoOiAwLFxyXG4gICAgICBuYXR1cmFsSGVpZ2h0OiAwLFxyXG4gICAgICBzY2FsZVJhdGlvOiBudWxsLFxyXG4gICAgICBvcmllbnRhdGlvbjogMSxcclxuICAgICAgdXNlck1ldGFkYXRhOiBudWxsLFxyXG4gICAgICBpbWFnZVNldDogZmFsc2UsXHJcbiAgICAgIGN1cnJlbnRQb2ludGVyQ29vcmQ6IG51bGwsXHJcbiAgICAgIGN1cnJlbnRJc0luaXRpYWw6IGZhbHNlLFxyXG4gICAgICBsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgcmVhbFdpZHRoOiAwLFxyXG4gICAgICByZWFsSGVpZ2h0OiAwLFxyXG4gICAgICBjaG9zZW5GaWxlOiBudWxsXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIG91dHB1dFdpZHRoICgpIHtcclxuICAgICAgY29uc3QgdyA9IHRoaXMuYXV0b1NpemluZyA/IHRoaXMucmVhbFdpZHRoIDogdGhpcy53aWR0aFxyXG4gICAgICByZXR1cm4gdyAqIHRoaXMucXVhbGl0eVxyXG4gICAgfSxcclxuXHJcbiAgICBvdXRwdXRIZWlnaHQgKCkge1xyXG4gICAgICBjb25zdCBoID0gdGhpcy5hdXRvU2l6aW5nID8gdGhpcy5yZWFsSGVpZ2h0IDogdGhpcy5oZWlnaHRcclxuICAgICAgcmV0dXJuIGggKiB0aGlzLnF1YWxpdHlcclxuICAgIH0sXHJcblxyXG4gICAgY29tcHV0ZWRQbGFjZWhvbGRlckZvbnRTaXplICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMucGxhY2Vob2xkZXJGb250U2l6ZSAqIHRoaXMucXVhbGl0eVxyXG4gICAgfSxcclxuXHJcbiAgICBhc3BlY3RSYXRpbyAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm5hdHVyYWxXaWR0aCAvIHRoaXMubmF0dXJhbEhlaWdodFxyXG4gICAgfSxcclxuXHJcbiAgICBsb2FkaW5nU3R5bGUgKCkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHdpZHRoOiB0aGlzLmxvYWRpbmdTaXplICsgJ3B4JyxcclxuICAgICAgICBoZWlnaHQ6IHRoaXMubG9hZGluZ1NpemUgKyAncHgnLFxyXG4gICAgICAgIHJpZ2h0OiAnMTVweCcsXHJcbiAgICAgICAgYm90dG9tOiAnMTBweCdcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIG1vdW50ZWQgKCkge1xyXG4gICAgdGhpcy5faW5pdGlhbGl6ZSgpXHJcbiAgICB1LnJBRlBvbHlmaWxsKClcclxuICAgIHUudG9CbG9iUG9seWZpbGwoKVxyXG5cclxuICAgIGxldCBzdXBwb3J0cyA9IHRoaXMuc3VwcG9ydERldGVjdGlvbigpXHJcbiAgICBpZiAoIXN1cHBvcnRzLmJhc2ljKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybignWW91ciBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgdnVlLWNyb3BwYSBmdW5jdGlvbmFsaXR5LicpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMucGFzc2l2ZSkge1xyXG4gICAgICB0aGlzLiR3YXRjaCgndmFsdWUuX2RhdGEnLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGxldCBzZXQgPSBmYWxzZVxyXG4gICAgICAgIGlmICghZGF0YSkgcmV0dXJuXHJcbiAgICAgICAgZm9yIChsZXQga2V5IGluIGRhdGEpIHtcclxuICAgICAgICAgIGlmIChzeW5jRGF0YS5pbmRleE9mKGtleSkgPj0gMCkge1xyXG4gICAgICAgICAgICBsZXQgdmFsID0gZGF0YVtrZXldXHJcbiAgICAgICAgICAgIGlmICh2YWwgIT09IHRoaXNba2V5XSkge1xyXG4gICAgICAgICAgICAgIHRoaXMuJHNldCh0aGlzLCBrZXksIHZhbClcclxuICAgICAgICAgICAgICBzZXQgPSB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHNldCkge1xyXG4gICAgICAgICAgaWYgKCF0aGlzLmltZykge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZSgpXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5fZHJhdygpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCB7XHJcbiAgICAgICAgICBkZWVwOiB0cnVlXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9hdXRvU2l6aW5nSW5pdCgpXHJcbiAgfSxcclxuXHJcbiAgYmVmb3JlRGVzdHJveSAoKSB7XHJcbiAgICB0aGlzLl9hdXRvU2l6aW5nUmVtb3ZlKClcclxuICB9LFxyXG5cclxuICB3YXRjaDoge1xyXG4gICAgb3V0cHV0V2lkdGg6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5vbkRpbWVuc2lvbkNoYW5nZSgpXHJcbiAgICB9LFxyXG4gICAgb3V0cHV0SGVpZ2h0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMub25EaW1lbnNpb25DaGFuZ2UoKVxyXG4gICAgfSxcclxuICAgIGNhbnZhc0NvbG9yOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmICghdGhpcy5pbWcpIHtcclxuICAgICAgICB0aGlzLl9zZXRQbGFjZWhvbGRlcnMoKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuX2RyYXcoKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgaW1hZ2VCb3JkZXJSYWRpdXM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKHRoaXMuaW1nKSB7XHJcbiAgICAgICAgdGhpcy5fZHJhdygpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBwbGFjZWhvbGRlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAoIXRoaXMuaW1nKSB7XHJcbiAgICAgICAgdGhpcy5fc2V0UGxhY2Vob2xkZXJzKClcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHBsYWNlaG9sZGVyQ29sb3I6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKCF0aGlzLmltZykge1xyXG4gICAgICAgIHRoaXMuX3NldFBsYWNlaG9sZGVycygpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBjb21wdXRlZFBsYWNlaG9sZGVyRm9udFNpemU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKCF0aGlzLmltZykge1xyXG4gICAgICAgIHRoaXMuX3NldFBsYWNlaG9sZGVycygpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBwcmV2ZW50V2hpdGVTcGFjZSAodmFsKSB7XHJcbiAgICAgIGlmICh2YWwpIHtcclxuICAgICAgICB0aGlzLmltYWdlU2V0ID0gZmFsc2VcclxuICAgICAgfVxyXG4gICAgICB0aGlzLl9wbGFjZUltYWdlKClcclxuICAgIH0sXHJcbiAgICBzY2FsZVJhdGlvICh2YWwsIG9sZFZhbCkge1xyXG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuXHJcbiAgICAgIGlmICghdS5udW1iZXJWYWxpZCh2YWwpKSByZXR1cm5cclxuXHJcbiAgICAgIHZhciB4ID0gMVxyXG4gICAgICBpZiAodS5udW1iZXJWYWxpZChvbGRWYWwpICYmIG9sZFZhbCAhPT0gMCkge1xyXG4gICAgICAgIHggPSB2YWwgLyBvbGRWYWxcclxuICAgICAgfVxyXG4gICAgICB2YXIgcG9zID0gdGhpcy5jdXJyZW50UG9pbnRlckNvb3JkIHx8IHtcclxuICAgICAgICB4OiB0aGlzLmltZ0RhdGEuc3RhcnRYICsgdGhpcy5pbWdEYXRhLndpZHRoIC8gMixcclxuICAgICAgICB5OiB0aGlzLmltZ0RhdGEuc3RhcnRZICsgdGhpcy5pbWdEYXRhLmhlaWdodCAvIDJcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLm5hdHVyYWxXaWR0aCAqIHZhbFxyXG4gICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5uYXR1cmFsSGVpZ2h0ICogdmFsXHJcblxyXG4gICAgICBpZiAoIXRoaXMudXNlck1ldGFkYXRhICYmIHRoaXMuaW1hZ2VTZXQgJiYgIXRoaXMucm90YXRpbmcpIHtcclxuICAgICAgICBsZXQgb2Zmc2V0WCA9ICh4IC0gMSkgKiAocG9zLnggLSB0aGlzLmltZ0RhdGEuc3RhcnRYKVxyXG4gICAgICAgIGxldCBvZmZzZXRZID0gKHggLSAxKSAqIChwb3MueSAtIHRoaXMuaW1nRGF0YS5zdGFydFkpXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IHRoaXMuaW1nRGF0YS5zdGFydFggLSBvZmZzZXRYXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IHRoaXMuaW1nRGF0YS5zdGFydFkgLSBvZmZzZXRZXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLnByZXZlbnRXaGl0ZVNwYWNlKSB7XHJcbiAgICAgICAgdGhpcy5fcHJldmVudFpvb21pbmdUb1doaXRlU3BhY2UoKVxyXG4gICAgICAgIHRoaXMuX3ByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UoKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgJ2ltZ0RhdGEud2lkdGgnOiBmdW5jdGlvbiAodmFsLCBvbGRWYWwpIHtcclxuICAgICAgLy8gaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgIGlmICghdS5udW1iZXJWYWxpZCh2YWwpKSByZXR1cm5cclxuICAgICAgdGhpcy5zY2FsZVJhdGlvID0gdmFsIC8gdGhpcy5uYXR1cmFsV2lkdGhcclxuICAgICAgaWYgKHRoaXMuaGFzSW1hZ2UoKSkge1xyXG4gICAgICAgIGlmIChNYXRoLmFicyh2YWwgLSBvbGRWYWwpID4gKHZhbCAqICgxIC8gMTAwMDAwKSkpIHtcclxuICAgICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLlpPT01fRVZFTlQpXHJcbiAgICAgICAgICB0aGlzLl9kcmF3KClcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICAnaW1nRGF0YS5oZWlnaHQnOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIC8vIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICBpZiAoIXUubnVtYmVyVmFsaWQodmFsKSkgcmV0dXJuXHJcbiAgICAgIHRoaXMuc2NhbGVSYXRpbyA9IHZhbCAvIHRoaXMubmF0dXJhbEhlaWdodFxyXG4gICAgfSxcclxuICAgICdpbWdEYXRhLnN0YXJ0WCc6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgLy8gaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgIGlmICh0aGlzLmhhc0ltYWdlKCkpIHtcclxuICAgICAgICB0aGlzLiRuZXh0VGljayh0aGlzLl9kcmF3KVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgJ2ltZ0RhdGEuc3RhcnRZJzogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAvLyBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgaWYgKHRoaXMuaGFzSW1hZ2UoKSkge1xyXG4gICAgICAgIHRoaXMuJG5leHRUaWNrKHRoaXMuX2RyYXcpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBsb2FkaW5nICh2YWwpIHtcclxuICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgIGlmICh2YWwpIHtcclxuICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5MT0FESU5HX1NUQVJUKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLkxPQURJTkdfRU5EKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgYXV0b1NpemluZyAodmFsKSB7XHJcbiAgICAgIGlmICh2YWwpIHtcclxuICAgICAgICB0aGlzLl9hdXRvU2l6aW5nSW5pdCgpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG5cclxuICBtZXRob2RzOiB7XHJcbiAgICBnZXRDYW52YXMgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5jYW52YXNcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0Q29udGV4dCAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmN0eFxyXG4gICAgfSxcclxuXHJcbiAgICBnZXRDaG9zZW5GaWxlICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuY2hvc2VuRmlsZSB8fCB0aGlzLiRyZWZzLmZpbGVJbnB1dC5maWxlc1swXVxyXG4gICAgfSxcclxuXHJcbiAgICBtb3ZlIChvZmZzZXQpIHtcclxuICAgICAgaWYgKCFvZmZzZXQgfHwgdGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgbGV0IG9sZFggPSB0aGlzLmltZ0RhdGEuc3RhcnRYXHJcbiAgICAgIGxldCBvbGRZID0gdGhpcy5pbWdEYXRhLnN0YXJ0WVxyXG4gICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYICs9IG9mZnNldC54XHJcbiAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgKz0gb2Zmc2V0LnlcclxuICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcclxuICAgICAgICB0aGlzLl9wcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlKClcclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy5pbWdEYXRhLnN0YXJ0WCAhPT0gb2xkWCB8fCB0aGlzLmltZ0RhdGEuc3RhcnRZICE9PSBvbGRZKSB7XHJcbiAgICAgICAgdGhpcy4kZW1pdChldmVudHMuTU9WRV9FVkVOVClcclxuICAgICAgICB0aGlzLl9kcmF3KClcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBtb3ZlVXB3YXJkcyAoYW1vdW50ID0gMSkge1xyXG4gICAgICB0aGlzLm1vdmUoeyB4OiAwLCB5OiAtYW1vdW50IH0pXHJcbiAgICB9LFxyXG5cclxuICAgIG1vdmVEb3dud2FyZHMgKGFtb3VudCA9IDEpIHtcclxuICAgICAgdGhpcy5tb3ZlKHsgeDogMCwgeTogYW1vdW50IH0pXHJcbiAgICB9LFxyXG5cclxuICAgIG1vdmVMZWZ0d2FyZHMgKGFtb3VudCA9IDEpIHtcclxuICAgICAgdGhpcy5tb3ZlKHsgeDogLWFtb3VudCwgeTogMCB9KVxyXG4gICAgfSxcclxuXHJcbiAgICBtb3ZlUmlnaHR3YXJkcyAoYW1vdW50ID0gMSkge1xyXG4gICAgICB0aGlzLm1vdmUoeyB4OiBhbW91bnQsIHk6IDAgfSlcclxuICAgIH0sXHJcblxyXG4gICAgem9vbSAoem9vbUluID0gdHJ1ZSwgYWNjZWxlcmF0aW9uID0gMSkge1xyXG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgbGV0IHJlYWxTcGVlZCA9IHRoaXMuem9vbVNwZWVkICogYWNjZWxlcmF0aW9uXHJcbiAgICAgIGxldCBzcGVlZCA9ICh0aGlzLm91dHB1dFdpZHRoICogUENUX1BFUl9aT09NKSAqIHJlYWxTcGVlZFxyXG4gICAgICBsZXQgeCA9IDFcclxuICAgICAgaWYgKHpvb21Jbikge1xyXG4gICAgICAgIHggPSAxICsgc3BlZWRcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLmltZ0RhdGEud2lkdGggPiBNSU5fV0lEVEgpIHtcclxuICAgICAgICB4ID0gMSAtIHNwZWVkXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuc2NhbGVSYXRpbyAqPSB4XHJcbiAgICB9LFxyXG5cclxuICAgIHpvb21JbiAoKSB7XHJcbiAgICAgIHRoaXMuem9vbSh0cnVlKVxyXG4gICAgfSxcclxuXHJcbiAgICB6b29tT3V0ICgpIHtcclxuICAgICAgdGhpcy56b29tKGZhbHNlKVxyXG4gICAgfSxcclxuXHJcbiAgICByb3RhdGUgKHN0ZXAgPSAxKSB7XHJcbiAgICAgIGlmICh0aGlzLmRpc2FibGVSb3RhdGlvbiB8fCB0aGlzLmRpc2FibGVkIHx8IHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgIHN0ZXAgPSBwYXJzZUludChzdGVwKVxyXG4gICAgICBpZiAoaXNOYU4oc3RlcCkgfHwgc3RlcCA+IDMgfHwgc3RlcCA8IC0zKSB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKCdJbnZhbGlkIGFyZ3VtZW50IGZvciByb3RhdGUoKSBtZXRob2QuIEl0IHNob3VsZCBvbmUgb2YgdGhlIGludGVnZXJzIGZyb20gLTMgdG8gMy4nKVxyXG4gICAgICAgIHN0ZXAgPSAxXHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5fcm90YXRlQnlTdGVwKHN0ZXApXHJcbiAgICB9LFxyXG5cclxuICAgIGZsaXBYICgpIHtcclxuICAgICAgaWYgKHRoaXMuZGlzYWJsZVJvdGF0aW9uIHx8IHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgdGhpcy5fc2V0T3JpZW50YXRpb24oMilcclxuICAgIH0sXHJcblxyXG4gICAgZmxpcFkgKCkge1xyXG4gICAgICBpZiAodGhpcy5kaXNhYmxlUm90YXRpb24gfHwgdGhpcy5kaXNhYmxlZCB8fCB0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICB0aGlzLl9zZXRPcmllbnRhdGlvbig0KVxyXG4gICAgfSxcclxuXHJcbiAgICByZWZyZXNoICgpIHtcclxuICAgICAgdGhpcy4kbmV4dFRpY2sodGhpcy5faW5pdGlhbGl6ZSlcclxuICAgIH0sXHJcblxyXG4gICAgaGFzSW1hZ2UgKCkge1xyXG4gICAgICByZXR1cm4gISF0aGlzLmltYWdlU2V0XHJcbiAgICB9LFxyXG5cclxuICAgIGFwcGx5TWV0YWRhdGEgKG1ldGFkYXRhKSB7XHJcbiAgICAgIGlmICghbWV0YWRhdGEgfHwgdGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgdGhpcy51c2VyTWV0YWRhdGEgPSBtZXRhZGF0YVxyXG4gICAgICB2YXIgb3JpID0gbWV0YWRhdGEub3JpZW50YXRpb24gfHwgdGhpcy5vcmllbnRhdGlvbiB8fCAxXHJcbiAgICAgIHRoaXMuX3NldE9yaWVudGF0aW9uKG9yaSwgdHJ1ZSlcclxuICAgIH0sXHJcbiAgICBnZW5lcmF0ZURhdGFVcmwgKHR5cGUsIGNvbXByZXNzaW9uUmF0ZSkge1xyXG4gICAgICBpZiAoIXRoaXMuaGFzSW1hZ2UoKSkgcmV0dXJuICcnXHJcbiAgICAgIHJldHVybiB0aGlzLmNhbnZhcy50b0RhdGFVUkwodHlwZSwgY29tcHJlc3Npb25SYXRlKVxyXG4gICAgfSxcclxuXHJcbiAgICBnZW5lcmF0ZUJsb2IgKGNhbGxiYWNrLCBtaW1lVHlwZSwgcXVhbGl0eUFyZ3VtZW50KSB7XHJcbiAgICAgIGlmICghdGhpcy5oYXNJbWFnZSgpKSB7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbClcclxuICAgICAgICByZXR1cm5cclxuICAgICAgfVxyXG4gICAgICB0aGlzLmNhbnZhcy50b0Jsb2IoY2FsbGJhY2ssIG1pbWVUeXBlLCBxdWFsaXR5QXJndW1lbnQpXHJcbiAgICB9LFxyXG5cclxuICAgIHByb21pc2VkQmxvYiAoLi4uYXJncykge1xyXG4gICAgICBpZiAodHlwZW9mIFByb21pc2UgPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICBjb25zb2xlLndhcm4oJ05vIFByb21pc2Ugc3VwcG9ydC4gUGxlYXNlIGFkZCBQcm9taXNlIHBvbHlmaWxsIGlmIHlvdSB3YW50IHRvIHVzZSB0aGlzIG1ldGhvZC4nKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIHRoaXMuZ2VuZXJhdGVCbG9iKChibG9iKSA9PiB7XHJcbiAgICAgICAgICAgIHJlc29sdmUoYmxvYilcclxuICAgICAgICAgIH0sIC4uLmFyZ3MpXHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICByZWplY3QoZXJyKVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0TWV0YWRhdGEgKCkge1xyXG4gICAgICBpZiAoIXRoaXMuaGFzSW1hZ2UoKSkgcmV0dXJuIHt9XHJcbiAgICAgIGxldCB7IHN0YXJ0WCwgc3RhcnRZIH0gPSB0aGlzLmltZ0RhdGFcclxuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgc3RhcnRYLFxyXG4gICAgICAgIHN0YXJ0WSxcclxuICAgICAgICBzY2FsZTogdGhpcy5zY2FsZVJhdGlvLFxyXG4gICAgICAgIG9yaWVudGF0aW9uOiB0aGlzLm9yaWVudGF0aW9uXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgc3VwcG9ydERldGVjdGlvbiAoKSB7XHJcbiAgICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykgcmV0dXJuXHJcbiAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgICdiYXNpYyc6IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgJiYgd2luZG93LkZpbGUgJiYgd2luZG93LkZpbGVSZWFkZXIgJiYgd2luZG93LkZpbGVMaXN0ICYmIHdpbmRvdy5CbG9iLFxyXG4gICAgICAgICdkbmQnOiAnb25kcmFnc3RhcnQnIGluIGRpdiAmJiAnb25kcm9wJyBpbiBkaXZcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBjaG9vc2VGaWxlICgpIHtcclxuICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgIHRoaXMuJHJlZnMuZmlsZUlucHV0LmNsaWNrKClcclxuICAgIH0sXHJcblxyXG4gICAgcmVtb3ZlICgpIHtcclxuICAgICAgdGhpcy5fc2V0UGxhY2Vob2xkZXJzKClcclxuXHJcbiAgICAgIGxldCBoYWRJbWFnZSA9IHRoaXMuaW1nICE9IG51bGxcclxuICAgICAgdGhpcy5vcmlnaW5hbEltYWdlID0gbnVsbFxyXG4gICAgICB0aGlzLmltZyA9IG51bGxcclxuICAgICAgdGhpcy4kcmVmcy5maWxlSW5wdXQudmFsdWUgPSAnJ1xyXG4gICAgICB0aGlzLmltZ0RhdGEgPSB7XHJcbiAgICAgICAgd2lkdGg6IDAsXHJcbiAgICAgICAgaGVpZ2h0OiAwLFxyXG4gICAgICAgIHN0YXJ0WDogMCxcclxuICAgICAgICBzdGFydFk6IDBcclxuICAgICAgfVxyXG4gICAgICB0aGlzLm9yaWVudGF0aW9uID0gMVxyXG4gICAgICB0aGlzLnNjYWxlUmF0aW8gPSBudWxsXHJcbiAgICAgIHRoaXMudXNlck1ldGFkYXRhID0gbnVsbFxyXG4gICAgICB0aGlzLmltYWdlU2V0ID0gZmFsc2VcclxuICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2VcclxuICAgICAgdGhpcy5jaG9zZW5GaWxlID0gbnVsbFxyXG4gICAgICBpZiAodGhpcy52aWRlbykge1xyXG4gICAgICAgIHRoaXMudmlkZW8ucGF1c2UoKVxyXG4gICAgICAgIHRoaXMudmlkZW8gPSBudWxsXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChoYWRJbWFnZSkge1xyXG4gICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLklNQUdFX1JFTU9WRV9FVkVOVClcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBhZGRDbGlwUGx1Z2luIChwbHVnaW4pIHtcclxuICAgICAgaWYgKCF0aGlzLmNsaXBQbHVnaW5zKSB7XHJcbiAgICAgICAgdGhpcy5jbGlwUGx1Z2lucyA9IFtdXHJcbiAgICAgIH1cclxuICAgICAgaWYgKHR5cGVvZiBwbHVnaW4gPT09ICdmdW5jdGlvbicgJiYgdGhpcy5jbGlwUGx1Z2lucy5pbmRleE9mKHBsdWdpbikgPCAwKSB7XHJcbiAgICAgICAgdGhpcy5jbGlwUGx1Z2lucy5wdXNoKHBsdWdpbilcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aHJvdyBFcnJvcignQ2xpcCBwbHVnaW5zIHNob3VsZCBiZSBmdW5jdGlvbnMnKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGVtaXROYXRpdmVFdmVudChldnQpIHtcclxuICAgICAgdGhpcy4kZW1pdChldnQudHlwZSwgZXZ0KTtcclxuICAgIH0sXHJcblxyXG4gICAgX3NldENvbnRhaW5lclNpemUgKCkge1xyXG4gICAgICBpZiAodGhpcy4kcmVmcy53cmFwcGVyICYmIGdldENvbXB1dGVkU3R5bGUpIHtcclxuICAgICAgICB0aGlzLnJlYWxXaWR0aCA9ICtnZXRDb21wdXRlZFN0eWxlKHRoaXMuJHJlZnMud3JhcHBlcikud2lkdGguc2xpY2UoMCwgLTIpXHJcbiAgICAgICAgdGhpcy5yZWFsSGVpZ2h0ID0gK2dldENvbXB1dGVkU3R5bGUodGhpcy4kcmVmcy53cmFwcGVyKS5oZWlnaHQuc2xpY2UoMCwgLTIpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgX2F1dG9TaXppbmdJbml0ICgpIHtcclxuICAgICAgaWYgKHRoaXMudXNlQXV0b1NpemluZykge1xyXG4gICAgICAgIHRoaXMuX3NldENvbnRhaW5lclNpemUoKVxyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9zZXRDb250YWluZXJTaXplKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIF9hdXRvU2l6aW5nUmVtb3ZlICgpIHtcclxuICAgICAgaWYgKHRoaXMudXNlQXV0b1NpemluZykge1xyXG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9zZXRDb250YWluZXJTaXplKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIF9pbml0aWFsaXplICgpIHtcclxuICAgICAgdGhpcy5jYW52YXMgPSB0aGlzLiRyZWZzLmNhbnZhc1xyXG4gICAgICB0aGlzLl9zZXRTaXplKClcclxuICAgICAgdGhpcy5jYW52YXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gKCF0aGlzLmNhbnZhc0NvbG9yIHx8IHRoaXMuY2FudmFzQ29sb3IgPT0gJ2RlZmF1bHQnKSA/ICd0cmFuc3BhcmVudCcgOiAodHlwZW9mIHRoaXMuY2FudmFzQ29sb3IgPT09ICdzdHJpbmcnID8gdGhpcy5jYW52YXNDb2xvciA6ICcnKVxyXG4gICAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJylcclxuICAgICAgdGhpcy5jdHgubW96SW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gdHJ1ZTtcclxuICAgICAgdGhpcy5jdHguaW1hZ2VTbW9vdGhpbmdRdWFsaXR5ID0gXCJoaWdoXCI7XHJcbiAgICAgIHRoaXMuY3R4LndlYmtpdEltYWdlU21vb3RoaW5nRW5hYmxlZCA9IHRydWU7XHJcbiAgICAgIHRoaXMuY3R4Lm1zSW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gdHJ1ZTtcclxuICAgICAgdGhpcy5jdHguaW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gdHJ1ZTtcclxuICAgICAgdGhpcy5vcmlnaW5hbEltYWdlID0gbnVsbFxyXG4gICAgICB0aGlzLmltZyA9IG51bGxcclxuICAgICAgdGhpcy5pbWFnZVNldCA9IGZhbHNlXHJcbiAgICAgIHRoaXMuY2hvc2VuRmlsZSA9IG51bGxcclxuICAgICAgdGhpcy5fc2V0SW5pdGlhbCgpXHJcbiAgICAgIGlmICghdGhpcy5wYXNzaXZlKSB7XHJcbiAgICAgICAgdGhpcy4kZW1pdChldmVudHMuSU5JVF9FVkVOVCwgdGhpcylcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBfc2V0U2l6ZSAoKSB7XHJcbiAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy5vdXRwdXRXaWR0aFxyXG4gICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLm91dHB1dEhlaWdodFxyXG4gICAgICB0aGlzLmNhbnZhcy5zdHlsZS53aWR0aCA9ICh0aGlzLnJlYWxXaWR0aCB8fCB0aGlzLndpZHRoKSArICdweCdcclxuICAgICAgdGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0ID0gKHRoaXMucmVhbEhlaWdodCB8fCB0aGlzLmhlaWdodCkgKyAncHgnXHJcbiAgICB9LFxyXG5cclxuICAgIF9yb3RhdGVCeVN0ZXAgKHN0ZXApIHtcclxuICAgICAgbGV0IG9yaWVudGF0aW9uID0gMVxyXG4gICAgICBzd2l0Y2ggKHN0ZXApIHtcclxuICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICBvcmllbnRhdGlvbiA9IDZcclxuICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgb3JpZW50YXRpb24gPSAzXHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgIG9yaWVudGF0aW9uID0gOFxyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgICBjYXNlIC0xOlxyXG4gICAgICAgICAgb3JpZW50YXRpb24gPSA4XHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICAgIGNhc2UgLTI6XHJcbiAgICAgICAgICBvcmllbnRhdGlvbiA9IDNcclxuICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgY2FzZSAtMzpcclxuICAgICAgICAgIG9yaWVudGF0aW9uID0gNlxyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLl9zZXRPcmllbnRhdGlvbihvcmllbnRhdGlvbilcclxuICAgIH0sXHJcblxyXG4gICAgX3NldEltYWdlUGxhY2Vob2xkZXIgKCkge1xyXG4gICAgICBsZXQgaW1nXHJcbiAgICAgIGlmICh0aGlzLiRzbG90cy5wbGFjZWhvbGRlciAmJiB0aGlzLiRzbG90cy5wbGFjZWhvbGRlclswXSkge1xyXG4gICAgICAgIGxldCB2Tm9kZSA9IHRoaXMuJHNsb3RzLnBsYWNlaG9sZGVyWzBdXHJcbiAgICAgICAgbGV0IHsgdGFnLCBlbG0gfSA9IHZOb2RlXHJcbiAgICAgICAgaWYgKHRhZyA9PSAnaW1nJyAmJiBlbG0pIHtcclxuICAgICAgICAgIGltZyA9IGVsbVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFpbWcpIHJldHVyblxyXG5cclxuICAgICAgdmFyIG9uTG9hZCA9ICgpID0+IHtcclxuICAgICAgICB0aGlzLmN0eC5kcmF3SW1hZ2UoaW1nLCAwLCAwLCB0aGlzLm91dHB1dFdpZHRoLCB0aGlzLm91dHB1dEhlaWdodClcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHUuaW1hZ2VMb2FkZWQoaW1nKSkge1xyXG4gICAgICAgIG9uTG9hZCgpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaW1nLm9ubG9hZCA9IG9uTG9hZFxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIF9zZXRUZXh0UGxhY2Vob2xkZXIgKCkge1xyXG4gICAgICB2YXIgY3R4ID0gdGhpcy5jdHhcclxuICAgICAgY3R4LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnXHJcbiAgICAgIGN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJ1xyXG4gICAgICBsZXQgZGVmYXVsdEZvbnRTaXplID0gdGhpcy5vdXRwdXRXaWR0aCAqIERFRkFVTFRfUExBQ0VIT0xERVJfVEFLRVVQIC8gdGhpcy5wbGFjZWhvbGRlci5sZW5ndGhcclxuICAgICAgbGV0IGZvbnRTaXplID0gKCF0aGlzLmNvbXB1dGVkUGxhY2Vob2xkZXJGb250U2l6ZSB8fCB0aGlzLmNvbXB1dGVkUGxhY2Vob2xkZXJGb250U2l6ZSA9PSAwKSA/IGRlZmF1bHRGb250U2l6ZSA6IHRoaXMuY29tcHV0ZWRQbGFjZWhvbGRlckZvbnRTaXplXHJcbiAgICAgIGN0eC5mb250ID0gZm9udFNpemUgKyAncHggc2Fucy1zZXJpZidcclxuICAgICAgY3R4LmZpbGxTdHlsZSA9ICghdGhpcy5wbGFjZWhvbGRlckNvbG9yIHx8IHRoaXMucGxhY2Vob2xkZXJDb2xvciA9PSAnZGVmYXVsdCcpID8gJyM2MDYwNjAnIDogdGhpcy5wbGFjZWhvbGRlckNvbG9yXHJcbiAgICAgIGN0eC5maWxsVGV4dCh0aGlzLnBsYWNlaG9sZGVyLCB0aGlzLm91dHB1dFdpZHRoIC8gMiwgdGhpcy5vdXRwdXRIZWlnaHQgLyAyKVxyXG4gICAgfSxcclxuXHJcbiAgICBfc2V0UGxhY2Vob2xkZXJzICgpIHtcclxuICAgICAgdGhpcy5fcGFpbnRCYWNrZ3JvdW5kKClcclxuICAgICAgdGhpcy5fc2V0SW1hZ2VQbGFjZWhvbGRlcigpXHJcbiAgICAgIHRoaXMuX3NldFRleHRQbGFjZWhvbGRlcigpXHJcbiAgICB9LFxyXG5cclxuICAgIF9zZXRJbml0aWFsICgpIHtcclxuICAgICAgbGV0IHNyYywgaW1nXHJcbiAgICAgIGlmICh0aGlzLiRzbG90cy5pbml0aWFsICYmIHRoaXMuJHNsb3RzLmluaXRpYWxbMF0pIHtcclxuICAgICAgICBsZXQgdk5vZGUgPSB0aGlzLiRzbG90cy5pbml0aWFsWzBdXHJcbiAgICAgICAgbGV0IHsgdGFnLCBlbG0gfSA9IHZOb2RlXHJcbiAgICAgICAgaWYgKHRhZyA9PSAnaW1nJyAmJiBlbG0pIHtcclxuICAgICAgICAgIGltZyA9IGVsbVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy5pbml0aWFsSW1hZ2UgJiYgdHlwZW9mIHRoaXMuaW5pdGlhbEltYWdlID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIHNyYyA9IHRoaXMuaW5pdGlhbEltYWdlXHJcbiAgICAgICAgaW1nID0gbmV3IEltYWdlKClcclxuICAgICAgICBpZiAoIS9eZGF0YTovLnRlc3Qoc3JjKSAmJiAhL15ibG9iOi8udGVzdChzcmMpKSB7XHJcbiAgICAgICAgICBpbWcuc2V0QXR0cmlidXRlKCdjcm9zc09yaWdpbicsICdhbm9ueW1vdXMnKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpbWcuc3JjID0gc3JjXHJcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMuaW5pdGlhbEltYWdlID09PSAnb2JqZWN0JyAmJiB0aGlzLmluaXRpYWxJbWFnZSBpbnN0YW5jZW9mIEltYWdlKSB7XHJcbiAgICAgICAgaW1nID0gdGhpcy5pbml0aWFsSW1hZ2VcclxuICAgICAgfVxyXG4gICAgICBpZiAoIXNyYyAmJiAhaW1nKSB7XHJcbiAgICAgICAgdGhpcy5fc2V0UGxhY2Vob2xkZXJzKClcclxuICAgICAgICByZXR1cm5cclxuICAgICAgfVxyXG4gICAgICB0aGlzLmN1cnJlbnRJc0luaXRpYWwgPSB0cnVlXHJcbiAgICAgIGlmICh1LmltYWdlTG9hZGVkKGltZykpIHtcclxuICAgICAgICAvLyB0aGlzLiRlbWl0KGV2ZW50cy5JTklUSUFMX0lNQUdFX0xPQURFRF9FVkVOVClcclxuICAgICAgICB0aGlzLl9vbmxvYWQoaW1nLCAraW1nLmRhdGFzZXRbJ2V4aWZPcmllbnRhdGlvbiddLCB0cnVlKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMubG9hZGluZyA9IHRydWVcclxuICAgICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgLy8gdGhpcy4kZW1pdChldmVudHMuSU5JVElBTF9JTUFHRV9MT0FERURfRVZFTlQpXHJcbiAgICAgICAgICB0aGlzLl9vbmxvYWQoaW1nLCAraW1nLmRhdGFzZXRbJ2V4aWZPcmllbnRhdGlvbiddLCB0cnVlKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW1nLm9uZXJyb3IgPSAoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLl9zZXRQbGFjZWhvbGRlcnMoKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBfb25sb2FkIChpbWcsIG9yaWVudGF0aW9uID0gMSwgaW5pdGlhbCkge1xyXG4gICAgICB0aGlzLm9yaWdpbmFsSW1hZ2UgPSBpbWdcclxuICAgICAgdGhpcy5pbWcgPSBpbWdcclxuXHJcbiAgICAgIGlmIChpc05hTihvcmllbnRhdGlvbikpIHtcclxuICAgICAgICBvcmllbnRhdGlvbiA9IDFcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5fc2V0T3JpZW50YXRpb24ob3JpZW50YXRpb24pXHJcblxyXG4gICAgICBpZiAoaW5pdGlhbCkge1xyXG4gICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLklOSVRJQUxfSU1BR0VfTE9BREVEX0VWRU5UKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIF9vblZpZGVvTG9hZCAodmlkZW8sIGluaXRpYWwpIHtcclxuICAgICAgdGhpcy52aWRlbyA9IHZpZGVvXHJcbiAgICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpXHJcbiAgICAgIGNvbnN0IHsgdmlkZW9XaWR0aCwgdmlkZW9IZWlnaHQgfSA9IHZpZGVvXHJcbiAgICAgIGNhbnZhcy53aWR0aCA9IHZpZGVvV2lkdGhcclxuICAgICAgY2FudmFzLmhlaWdodCA9IHZpZGVvSGVpZ2h0XHJcbiAgICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXHJcbiAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlXHJcbiAgICAgIGNvbnN0IGRyYXdGcmFtZSA9IChpbml0aWFsKSA9PiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnZpZGVvKSByZXR1cm5cclxuICAgICAgICBjdHguZHJhd0ltYWdlKHRoaXMudmlkZW8sIDAsIDAsIHZpZGVvV2lkdGgsIHZpZGVvSGVpZ2h0KVxyXG4gICAgICAgIGNvbnN0IGZyYW1lID0gbmV3IEltYWdlKClcclxuICAgICAgICBmcmFtZS5zcmMgPSBjYW52YXMudG9EYXRhVVJMKClcclxuICAgICAgICBmcmFtZS5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmltZyA9IGZyYW1lXHJcbiAgICAgICAgICAvLyB0aGlzLl9wbGFjZUltYWdlKClcclxuICAgICAgICAgIGlmIChpbml0aWFsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3BsYWNlSW1hZ2UoKVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fZHJhdygpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGRyYXdGcmFtZSh0cnVlKVxyXG4gICAgICBjb25zdCBrZWVwRHJhd2luZyA9ICgpID0+IHtcclxuICAgICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XHJcbiAgICAgICAgICBkcmF3RnJhbWUoKVxyXG4gICAgICAgICAgaWYgKCF0aGlzLnZpZGVvIHx8IHRoaXMudmlkZW8uZW5kZWQgfHwgdGhpcy52aWRlby5wYXVzZWQpIHJldHVyblxyXG4gICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGtlZXBEcmF3aW5nKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgICAgdGhpcy52aWRlby5hZGRFdmVudExpc3RlbmVyKCdwbGF5JywgKCkgPT4ge1xyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShrZWVwRHJhd2luZylcclxuICAgICAgfSlcclxuICAgIH0sXHJcblxyXG4gICAgX2hhbmRsZUNsaWNrIChldnQpIHtcclxuICAgICAgdGhpcy5lbWl0TmF0aXZlRXZlbnQoZXZ0KVxyXG4gICAgICBpZiAoIXRoaXMuaGFzSW1hZ2UoKSAmJiAhdGhpcy5kaXNhYmxlQ2xpY2tUb0Nob29zZSAmJiAhdGhpcy5kaXNhYmxlZCAmJiAhdGhpcy5zdXBwb3J0VG91Y2ggJiYgIXRoaXMucGFzc2l2ZSkge1xyXG4gICAgICAgIHRoaXMuY2hvb3NlRmlsZSgpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgX2hhbmRsZURibENsaWNrIChldnQpIHtcclxuICAgICAgdGhpcy5lbWl0TmF0aXZlRXZlbnQoZXZ0KVxyXG4gICAgICBpZiAodGhpcy52aWRlb0VuYWJsZWQgJiYgdGhpcy52aWRlbykge1xyXG4gICAgICAgIGlmICh0aGlzLnZpZGVvLnBhdXNlZCB8fCB0aGlzLnZpZGVvLmVuZGVkKSB7XHJcbiAgICAgICAgICB0aGlzLnZpZGVvLnBsYXkoKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLnZpZGVvLnBhdXNlKClcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgX2hhbmRsZUlucHV0Q2hhbmdlICgpIHtcclxuICAgICAgbGV0IGlucHV0ID0gdGhpcy4kcmVmcy5maWxlSW5wdXRcclxuICAgICAgaWYgKCFpbnB1dC5maWxlcy5sZW5ndGggfHwgdGhpcy5wYXNzaXZlKSByZXR1cm5cclxuXHJcbiAgICAgIGxldCBmaWxlID0gaW5wdXQuZmlsZXNbMF1cclxuICAgICAgdGhpcy5fb25OZXdGaWxlSW4oZmlsZSlcclxuICAgIH0sXHJcblxyXG4gICAgX29uTmV3RmlsZUluIChmaWxlKSB7XHJcbiAgICAgIHRoaXMuY3VycmVudElzSW5pdGlhbCA9IGZhbHNlXHJcbiAgICAgIHRoaXMubG9hZGluZyA9IHRydWVcclxuICAgICAgdGhpcy4kZW1pdChldmVudHMuRklMRV9DSE9PU0VfRVZFTlQsIGZpbGUpXHJcbiAgICAgIHRoaXMuY2hvc2VuRmlsZSA9IGZpbGU7XHJcbiAgICAgIGlmICghdGhpcy5fZmlsZVNpemVJc1ZhbGlkKGZpbGUpKSB7XHJcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2VcclxuICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5GSUxFX1NJWkVfRVhDRUVEX0VWRU5ULCBmaWxlKVxyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICB9XHJcbiAgICAgIGlmICghdGhpcy5fZmlsZVR5cGVJc1ZhbGlkKGZpbGUpKSB7XHJcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2VcclxuICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5GSUxFX1RZUEVfTUlTTUFUQ0hfRVZFTlQsIGZpbGUpXHJcbiAgICAgICAgbGV0IHR5cGUgPSBmaWxlLnR5cGUgfHwgZmlsZS5uYW1lLnRvTG93ZXJDYXNlKCkuc3BsaXQoJy4nKS5wb3AoKVxyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHdpbmRvdy5GaWxlUmVhZGVyICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIGxldCBmciA9IG5ldyBGaWxlUmVhZGVyKClcclxuICAgICAgICBmci5vbmxvYWQgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgbGV0IGZpbGVEYXRhID0gZS50YXJnZXQucmVzdWx0XHJcbiAgICAgICAgICBjb25zdCBiYXNlNjQgPSB1LnBhcnNlRGF0YVVybChmaWxlRGF0YSlcclxuICAgICAgICAgIGNvbnN0IGlzVmlkZW8gPSAvXnZpZGVvLy50ZXN0KGZpbGUudHlwZSlcclxuICAgICAgICAgIGlmIChpc1ZpZGVvKSB7XHJcbiAgICAgICAgICAgIGxldCB2aWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJylcclxuICAgICAgICAgICAgdmlkZW8uc3JjID0gZmlsZURhdGFcclxuICAgICAgICAgICAgZmlsZURhdGEgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAodmlkZW8ucmVhZHlTdGF0ZSA+PSB2aWRlby5IQVZFX0ZVVFVSRV9EQVRBKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5fb25WaWRlb0xvYWQodmlkZW8pXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcignY2FucGxheScsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjYW4gcGxheSBldmVudCcpXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vblZpZGVvTG9hZCh2aWRlbylcclxuICAgICAgICAgICAgICB9LCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBvcmllbnRhdGlvbiA9IDFcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICBvcmllbnRhdGlvbiA9IHUuZ2V0RmlsZU9yaWVudGF0aW9uKHUuYmFzZTY0VG9BcnJheUJ1ZmZlcihiYXNlNjQpKVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHsgfVxyXG4gICAgICAgICAgICBpZiAob3JpZW50YXRpb24gPCAxKSBvcmllbnRhdGlvbiA9IDFcclxuICAgICAgICAgICAgbGV0IGltZyA9IG5ldyBJbWFnZSgpXHJcbiAgICAgICAgICAgIGltZy5zcmMgPSBmaWxlRGF0YVxyXG4gICAgICAgICAgICBmaWxlRGF0YSA9IG51bGw7XHJcbiAgICAgICAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5fb25sb2FkKGltZywgb3JpZW50YXRpb24pXHJcbiAgICAgICAgICAgICAgdGhpcy4kZW1pdChldmVudHMuTkVXX0lNQUdFKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZyLnJlYWRBc0RhdGFVUkwoZmlsZSlcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBfZmlsZVNpemVJc1ZhbGlkIChmaWxlKSB7XHJcbiAgICAgIGlmICghZmlsZSkgcmV0dXJuIGZhbHNlXHJcbiAgICAgIGlmICghdGhpcy5maWxlU2l6ZUxpbWl0IHx8IHRoaXMuZmlsZVNpemVMaW1pdCA9PSAwKSByZXR1cm4gdHJ1ZVxyXG5cclxuICAgICAgcmV0dXJuIGZpbGUuc2l6ZSA8IHRoaXMuZmlsZVNpemVMaW1pdFxyXG4gICAgfSxcclxuXHJcbiAgICBfZmlsZVR5cGVJc1ZhbGlkIChmaWxlKSB7XHJcbiAgICAgIGNvbnN0IGFjY2VwdGFibGVNaW1lVHlwZSA9ICh0aGlzLnZpZGVvRW5hYmxlZCAmJiAvXnZpZGVvLy50ZXN0KGZpbGUudHlwZSkgJiYgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKS5jYW5QbGF5VHlwZShmaWxlLnR5cGUpKSB8fCAvXmltYWdlLy50ZXN0KGZpbGUudHlwZSlcclxuICAgICAgaWYgKCFhY2NlcHRhYmxlTWltZVR5cGUpIHJldHVybiBmYWxzZVxyXG4gICAgICBpZiAoIXRoaXMuYWNjZXB0KSByZXR1cm4gdHJ1ZVxyXG4gICAgICBsZXQgYWNjZXB0ID0gdGhpcy5hY2NlcHRcclxuICAgICAgbGV0IGJhc2VNaW1ldHlwZSA9IGFjY2VwdC5yZXBsYWNlKC9cXC8uKiQvLCAnJylcclxuICAgICAgbGV0IHR5cGVzID0gYWNjZXB0LnNwbGl0KCcsJylcclxuICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHR5cGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgbGV0IHR5cGUgPSB0eXBlc1tpXVxyXG4gICAgICAgIGxldCB0ID0gdHlwZS50cmltKClcclxuICAgICAgICBpZiAodC5jaGFyQXQoMCkgPT0gJy4nKSB7XHJcbiAgICAgICAgICBpZiAoZmlsZS5uYW1lLnRvTG93ZXJDYXNlKCkuc3BsaXQoJy4nKS5wb3AoKSA9PT0gdC50b0xvd2VyQ2FzZSgpLnNsaWNlKDEpKSByZXR1cm4gdHJ1ZVxyXG4gICAgICAgIH0gZWxzZSBpZiAoL1xcL1xcKiQvLnRlc3QodCkpIHtcclxuICAgICAgICAgIHZhciBmaWxlQmFzZVR5cGUgPSBmaWxlLnR5cGUucmVwbGFjZSgvXFwvLiokLywgJycpXHJcbiAgICAgICAgICBpZiAoZmlsZUJhc2VUeXBlID09PSBiYXNlTWltZXR5cGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKGZpbGUudHlwZSA9PT0gdHlwZSkge1xyXG4gICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfSxcclxuXHJcbiAgICBfcGxhY2VJbWFnZSAoYXBwbHlNZXRhZGF0YSkge1xyXG4gICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm5cclxuICAgICAgdmFyIGltZ0RhdGEgPSB0aGlzLmltZ0RhdGFcclxuXHJcbiAgICAgIHRoaXMubmF0dXJhbFdpZHRoID0gdGhpcy5pbWcubmF0dXJhbFdpZHRoXHJcbiAgICAgIHRoaXMubmF0dXJhbEhlaWdodCA9IHRoaXMuaW1nLm5hdHVyYWxIZWlnaHRcclxuXHJcbiAgICAgIGltZ0RhdGEuc3RhcnRYID0gdS5udW1iZXJWYWxpZChpbWdEYXRhLnN0YXJ0WCkgPyBpbWdEYXRhLnN0YXJ0WCA6IDBcclxuICAgICAgaW1nRGF0YS5zdGFydFkgPSB1Lm51bWJlclZhbGlkKGltZ0RhdGEuc3RhcnRZKSA/IGltZ0RhdGEuc3RhcnRZIDogMFxyXG5cclxuICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcclxuICAgICAgICB0aGlzLl9hc3BlY3RGaWxsKClcclxuICAgICAgfSBlbHNlIGlmICghdGhpcy5pbWFnZVNldCkge1xyXG4gICAgICAgIGlmICh0aGlzLmluaXRpYWxTaXplID09ICdjb250YWluJykge1xyXG4gICAgICAgICAgdGhpcy5fYXNwZWN0Rml0KClcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaW5pdGlhbFNpemUgPT0gJ25hdHVyYWwnKSB7XHJcbiAgICAgICAgICB0aGlzLl9uYXR1cmFsU2l6ZSgpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuX2FzcGVjdEZpbGwoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLm5hdHVyYWxXaWR0aCAqIHRoaXMuc2NhbGVSYXRpb1xyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLm5hdHVyYWxIZWlnaHQgKiB0aGlzLnNjYWxlUmF0aW9cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCF0aGlzLmltYWdlU2V0KSB7XHJcbiAgICAgICAgaWYgKC90b3AvLnRlc3QodGhpcy5pbml0aWFsUG9zaXRpb24pKSB7XHJcbiAgICAgICAgICBpbWdEYXRhLnN0YXJ0WSA9IDBcclxuICAgICAgICB9IGVsc2UgaWYgKC9ib3R0b20vLnRlc3QodGhpcy5pbml0aWFsUG9zaXRpb24pKSB7XHJcbiAgICAgICAgICBpbWdEYXRhLnN0YXJ0WSA9IHRoaXMub3V0cHV0SGVpZ2h0IC0gaW1nRGF0YS5oZWlnaHRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgvbGVmdC8udGVzdCh0aGlzLmluaXRpYWxQb3NpdGlvbikpIHtcclxuICAgICAgICAgIGltZ0RhdGEuc3RhcnRYID0gMFxyXG4gICAgICAgIH0gZWxzZSBpZiAoL3JpZ2h0Ly50ZXN0KHRoaXMuaW5pdGlhbFBvc2l0aW9uKSkge1xyXG4gICAgICAgICAgaW1nRGF0YS5zdGFydFggPSB0aGlzLm91dHB1dFdpZHRoIC0gaW1nRGF0YS53aWR0aFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKC9eLT9cXGQrJSAtP1xcZCslJC8udGVzdCh0aGlzLmluaXRpYWxQb3NpdGlvbikpIHtcclxuICAgICAgICAgIHZhciByZXN1bHQgPSAvXigtP1xcZCspJSAoLT9cXGQrKSUkLy5leGVjKHRoaXMuaW5pdGlhbFBvc2l0aW9uKVxyXG4gICAgICAgICAgdmFyIHggPSArcmVzdWx0WzFdIC8gMTAwXHJcbiAgICAgICAgICB2YXIgeSA9ICtyZXN1bHRbMl0gLyAxMDBcclxuICAgICAgICAgIGltZ0RhdGEuc3RhcnRYID0geCAqICh0aGlzLm91dHB1dFdpZHRoIC0gaW1nRGF0YS53aWR0aClcclxuICAgICAgICAgIGltZ0RhdGEuc3RhcnRZID0geSAqICh0aGlzLm91dHB1dEhlaWdodCAtIGltZ0RhdGEuaGVpZ2h0KVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgYXBwbHlNZXRhZGF0YSAmJiB0aGlzLl9hcHBseU1ldGFkYXRhKClcclxuXHJcbiAgICAgIGlmIChhcHBseU1ldGFkYXRhICYmIHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcclxuICAgICAgICB0aGlzLnpvb20oZmFsc2UsIDApXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5tb3ZlKHsgeDogMCwgeTogMCB9KVxyXG4gICAgICAgIHRoaXMuX2RyYXcoKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIF9hc3BlY3RGaWxsICgpIHtcclxuICAgICAgbGV0IGltZ1dpZHRoID0gdGhpcy5uYXR1cmFsV2lkdGhcclxuICAgICAgbGV0IGltZ0hlaWdodCA9IHRoaXMubmF0dXJhbEhlaWdodFxyXG4gICAgICBsZXQgY2FudmFzUmF0aW8gPSB0aGlzLm91dHB1dFdpZHRoIC8gdGhpcy5vdXRwdXRIZWlnaHRcclxuICAgICAgbGV0IHNjYWxlUmF0aW9cclxuXHJcbiAgICAgIGlmICh0aGlzLmFzcGVjdFJhdGlvID4gY2FudmFzUmF0aW8pIHtcclxuICAgICAgICBzY2FsZVJhdGlvID0gaW1nSGVpZ2h0IC8gdGhpcy5vdXRwdXRIZWlnaHRcclxuICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSBpbWdXaWR0aCAvIHNjYWxlUmF0aW9cclxuICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5vdXRwdXRIZWlnaHRcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLm91dHB1dFdpZHRoKSAvIDJcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gMFxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNjYWxlUmF0aW8gPSBpbWdXaWR0aCAvIHRoaXMub3V0cHV0V2lkdGhcclxuICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gaW1nSGVpZ2h0IC8gc2NhbGVSYXRpb1xyXG4gICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMub3V0cHV0V2lkdGhcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gLSh0aGlzLmltZ0RhdGEuaGVpZ2h0IC0gdGhpcy5vdXRwdXRIZWlnaHQpIC8gMlxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAwXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgX2FzcGVjdEZpdCAoKSB7XHJcbiAgICAgIGxldCBpbWdXaWR0aCA9IHRoaXMubmF0dXJhbFdpZHRoXHJcbiAgICAgIGxldCBpbWdIZWlnaHQgPSB0aGlzLm5hdHVyYWxIZWlnaHRcclxuICAgICAgbGV0IGNhbnZhc1JhdGlvID0gdGhpcy5vdXRwdXRXaWR0aCAvIHRoaXMub3V0cHV0SGVpZ2h0XHJcbiAgICAgIGxldCBzY2FsZVJhdGlvXHJcbiAgICAgIGlmICh0aGlzLmFzcGVjdFJhdGlvID4gY2FudmFzUmF0aW8pIHtcclxuICAgICAgICBzY2FsZVJhdGlvID0gaW1nV2lkdGggLyB0aGlzLm91dHB1dFdpZHRoXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IGltZ0hlaWdodCAvIHNjYWxlUmF0aW9cclxuICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLm91dHB1dFdpZHRoXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IC0odGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMub3V0cHV0SGVpZ2h0KSAvIDJcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gMFxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNjYWxlUmF0aW8gPSBpbWdIZWlnaHQgLyB0aGlzLm91dHB1dEhlaWdodFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IGltZ1dpZHRoIC8gc2NhbGVSYXRpb1xyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLm91dHB1dEhlaWdodFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAtKHRoaXMuaW1nRGF0YS53aWR0aCAtIHRoaXMub3V0cHV0V2lkdGgpIC8gMlxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAwXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgX25hdHVyYWxTaXplICgpIHtcclxuICAgICAgbGV0IGltZ1dpZHRoID0gdGhpcy5uYXR1cmFsV2lkdGhcclxuICAgICAgbGV0IGltZ0hlaWdodCA9IHRoaXMubmF0dXJhbEhlaWdodFxyXG4gICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSBpbWdXaWR0aFxyXG4gICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gaW1nSGVpZ2h0XHJcbiAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAtKHRoaXMuaW1nRGF0YS53aWR0aCAtIHRoaXMub3V0cHV0V2lkdGgpIC8gMlxyXG4gICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gLSh0aGlzLmltZ0RhdGEuaGVpZ2h0IC0gdGhpcy5vdXRwdXRIZWlnaHQpIC8gMlxyXG4gICAgfSxcclxuXHJcbiAgICBfaGFuZGxlUG9pbnRlclN0YXJ0IChldnQpIHtcclxuICAgICAgdGhpcy5lbWl0TmF0aXZlRXZlbnQoZXZ0KSAgICAgIFxyXG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgdGhpcy5zdXBwb3J0VG91Y2ggPSB0cnVlXHJcbiAgICAgIHRoaXMucG9pbnRlck1vdmVkID0gZmFsc2VcclxuICAgICAgbGV0IHBvaW50ZXJDb29yZCA9IHUuZ2V0UG9pbnRlckNvb3JkcyhldnQsIHRoaXMpXHJcbiAgICAgIHRoaXMucG9pbnRlclN0YXJ0Q29vcmQgPSBwb2ludGVyQ29vcmRcclxuXHJcbiAgICAgIGlmICh0aGlzLmRpc2FibGVkKSByZXR1cm5cclxuICAgICAgLy8gc2ltdWxhdGUgY2xpY2sgd2l0aCB0b3VjaCBvbiBtb2JpbGUgZGV2aWNlc1xyXG4gICAgICBpZiAoIXRoaXMuaGFzSW1hZ2UoKSAmJiAhdGhpcy5kaXNhYmxlQ2xpY2tUb0Nob29zZSkge1xyXG4gICAgICAgIHRoaXMudGFiU3RhcnQgPSBuZXcgRGF0ZSgpLnZhbHVlT2YoKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgICB9XHJcbiAgICAgIC8vIGlnbm9yZSBtb3VzZSByaWdodCBjbGljayBhbmQgbWlkZGxlIGNsaWNrXHJcbiAgICAgIGlmIChldnQud2hpY2ggJiYgZXZ0LndoaWNoID4gMSkgcmV0dXJuXHJcblxyXG4gICAgICBpZiAoIWV2dC50b3VjaGVzIHx8IGV2dC50b3VjaGVzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSB0cnVlXHJcbiAgICAgICAgdGhpcy5waW5jaGluZyA9IGZhbHNlXHJcbiAgICAgICAgbGV0IGNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICB0aGlzLmxhc3RNb3ZpbmdDb29yZCA9IGNvb3JkXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChldnQudG91Y2hlcyAmJiBldnQudG91Y2hlcy5sZW5ndGggPT09IDIgJiYgIXRoaXMuZGlzYWJsZVBpbmNoVG9ab29tKSB7XHJcbiAgICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy5waW5jaGluZyA9IHRydWVcclxuICAgICAgICB0aGlzLnBpbmNoRGlzdGFuY2UgPSB1LmdldFBpbmNoRGlzdGFuY2UoZXZ0LCB0aGlzKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgY2FuY2VsRXZlbnRzID0gWydtb3VzZXVwJywgJ3RvdWNoZW5kJywgJ3RvdWNoY2FuY2VsJywgJ3BvaW50ZXJlbmQnLCAncG9pbnRlcmNhbmNlbCddXHJcbiAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBjYW5jZWxFdmVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICBsZXQgZSA9IGNhbmNlbEV2ZW50c1tpXVxyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZSwgdGhpcy5faGFuZGxlUG9pbnRlckVuZClcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBfaGFuZGxlUG9pbnRlckVuZCAoZXZ0KSB7XHJcbiAgICAgIHRoaXMuZW1pdE5hdGl2ZUV2ZW50KGV2dCkgICAgICBcclxuICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgIGxldCBwb2ludGVyTW92ZURpc3RhbmNlID0gMFxyXG4gICAgICBpZiAodGhpcy5wb2ludGVyU3RhcnRDb29yZCkge1xyXG4gICAgICAgIGxldCBwb2ludGVyQ29vcmQgPSB1LmdldFBvaW50ZXJDb29yZHMoZXZ0LCB0aGlzKVxyXG4gICAgICAgIHBvaW50ZXJNb3ZlRGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3cocG9pbnRlckNvb3JkLnggLSB0aGlzLnBvaW50ZXJTdGFydENvb3JkLngsIDIpICsgTWF0aC5wb3cocG9pbnRlckNvb3JkLnkgLSB0aGlzLnBvaW50ZXJTdGFydENvb3JkLnksIDIpKSB8fCAwXHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHJldHVyblxyXG4gICAgICBpZiAoIXRoaXMuaGFzSW1hZ2UoKSAmJiAhdGhpcy5kaXNhYmxlQ2xpY2tUb0Nob29zZSkge1xyXG4gICAgICAgIGxldCB0YWJFbmQgPSBuZXcgRGF0ZSgpLnZhbHVlT2YoKVxyXG4gICAgICAgIGlmICgocG9pbnRlck1vdmVEaXN0YW5jZSA8IENMSUNLX01PVkVfVEhSRVNIT0xEKSAmJiB0YWJFbmQgLSB0aGlzLnRhYlN0YXJ0IDwgTUlOX01TX1BFUl9DTElDSyAmJiB0aGlzLnN1cHBvcnRUb3VjaCkge1xyXG4gICAgICAgICAgdGhpcy5jaG9vc2VGaWxlKClcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy50YWJTdGFydCA9IDBcclxuICAgICAgICByZXR1cm5cclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlXHJcbiAgICAgIHRoaXMucGluY2hpbmcgPSBmYWxzZVxyXG4gICAgICB0aGlzLnBpbmNoRGlzdGFuY2UgPSAwXHJcbiAgICAgIHRoaXMubGFzdE1vdmluZ0Nvb3JkID0gbnVsbFxyXG4gICAgICB0aGlzLnBvaW50ZXJNb3ZlZCA9IGZhbHNlXHJcbiAgICAgIHRoaXMucG9pbnRlclN0YXJ0Q29vcmQgPSBudWxsXHJcbiAgICB9LFxyXG5cclxuICAgIF9oYW5kbGVQb2ludGVyTW92ZSAoZXZ0KSB7XHJcbiAgICAgIHRoaXMuZW1pdE5hdGl2ZUV2ZW50KGV2dClcclxuICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgIHRoaXMucG9pbnRlck1vdmVkID0gdHJ1ZVxyXG4gICAgICBpZiAoIXRoaXMuaGFzSW1hZ2UoKSkgcmV0dXJuXHJcbiAgICAgIGxldCBjb29yZCA9IHUuZ2V0UG9pbnRlckNvb3JkcyhldnQsIHRoaXMpXHJcbiAgICAgIHRoaXMuY3VycmVudFBvaW50ZXJDb29yZCA9IGNvb3JkXHJcblxyXG4gICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVEcmFnVG9Nb3ZlKSByZXR1cm5cclxuXHJcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgIGlmICghZXZ0LnRvdWNoZXMgfHwgZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmRyYWdnaW5nKSByZXR1cm5cclxuICAgICAgICBpZiAodGhpcy5sYXN0TW92aW5nQ29vcmQpIHtcclxuICAgICAgICAgIHRoaXMubW92ZSh7XHJcbiAgICAgICAgICAgIHg6IGNvb3JkLnggLSB0aGlzLmxhc3RNb3ZpbmdDb29yZC54LFxyXG4gICAgICAgICAgICB5OiBjb29yZC55IC0gdGhpcy5sYXN0TW92aW5nQ29vcmQueVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5sYXN0TW92aW5nQ29vcmQgPSBjb29yZFxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZXZ0LnRvdWNoZXMgJiYgZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAyICYmICF0aGlzLmRpc2FibGVQaW5jaFRvWm9vbSkge1xyXG4gICAgICAgIGlmICghdGhpcy5waW5jaGluZykgcmV0dXJuXHJcbiAgICAgICAgbGV0IGRpc3RhbmNlID0gdS5nZXRQaW5jaERpc3RhbmNlKGV2dCwgdGhpcylcclxuICAgICAgICBsZXQgZGVsdGEgPSBkaXN0YW5jZSAtIHRoaXMucGluY2hEaXN0YW5jZVxyXG4gICAgICAgIHRoaXMuem9vbShkZWx0YSA+IDAsIFBJTkNIX0FDQ0VMRVJBVElPTilcclxuICAgICAgICB0aGlzLnBpbmNoRGlzdGFuY2UgPSBkaXN0YW5jZVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIF9oYW5kbGVQb2ludGVyTGVhdmUgKGV2dCkge1xyXG4gICAgICB0aGlzLmVtaXROYXRpdmVFdmVudChldnQpXHJcbiAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICB0aGlzLmN1cnJlbnRQb2ludGVyQ29vcmQgPSBudWxsXHJcbiAgICB9LFxyXG5cclxuICAgIF9oYW5kbGVXaGVlbCAoZXZ0KSB7XHJcbiAgICAgIHRoaXMuZW1pdE5hdGl2ZUV2ZW50KGV2dCkgICAgICBcclxuICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZVNjcm9sbFRvWm9vbSB8fCAhdGhpcy5oYXNJbWFnZSgpKSByZXR1cm5cclxuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KClcclxuICAgICAgdGhpcy5zY3JvbGxpbmcgPSB0cnVlXHJcbiAgICAgIGlmIChldnQud2hlZWxEZWx0YSA8IDAgfHwgZXZ0LmRlbHRhWSA+IDAgfHwgZXZ0LmRldGFpbCA+IDApIHtcclxuICAgICAgICB0aGlzLnpvb20odGhpcy5yZXZlcnNlU2Nyb2xsVG9ab29tKVxyXG4gICAgICB9IGVsc2UgaWYgKGV2dC53aGVlbERlbHRhID4gMCB8fCBldnQuZGVsdGFZIDwgMCB8fCBldnQuZGV0YWlsIDwgMCkge1xyXG4gICAgICAgIHRoaXMuem9vbSghdGhpcy5yZXZlcnNlU2Nyb2xsVG9ab29tKVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcclxuICAgICAgICB0aGlzLnNjcm9sbGluZyA9IGZhbHNlXHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG5cclxuICAgIF9oYW5kbGVEcmFnRW50ZXIgKGV2dCkge1xyXG4gICAgICB0aGlzLmVtaXROYXRpdmVFdmVudChldnQpICAgICAgXHJcbiAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVEcmFnQW5kRHJvcCB8fCAhdS5ldmVudEhhc0ZpbGUoZXZ0KSkgcmV0dXJuXHJcbiAgICAgIGlmICh0aGlzLmhhc0ltYWdlKCkgJiYgIXRoaXMucmVwbGFjZURyb3ApIHJldHVyblxyXG4gICAgICB0aGlzLmZpbGVEcmFnZ2VkT3ZlciA9IHRydWVcclxuICAgIH0sXHJcblxyXG4gICAgX2hhbmRsZURyYWdMZWF2ZSAoZXZ0KSB7XHJcbiAgICAgIHRoaXMuZW1pdE5hdGl2ZUV2ZW50KGV2dCkgICAgICBcclxuICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgIGlmICghdGhpcy5maWxlRHJhZ2dlZE92ZXIgfHwgIXUuZXZlbnRIYXNGaWxlKGV2dCkpIHJldHVyblxyXG4gICAgICB0aGlzLmZpbGVEcmFnZ2VkT3ZlciA9IGZhbHNlXHJcbiAgICB9LFxyXG5cclxuICAgIF9oYW5kbGVEcmFnT3ZlciAoZXZ0KSB7XHJcbiAgICAgIHRoaXMuZW1pdE5hdGl2ZUV2ZW50KGV2dCkgICAgICBcclxuICAgIH0sXHJcblxyXG4gICAgX2hhbmRsZURyb3AgKGV2dCkge1xyXG4gICAgICB0aGlzLmVtaXROYXRpdmVFdmVudChldnQpICAgICAgXHJcbiAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICBpZiAoIXRoaXMuZmlsZURyYWdnZWRPdmVyIHx8ICF1LmV2ZW50SGFzRmlsZShldnQpKSByZXR1cm5cclxuICAgICAgaWYgKHRoaXMuaGFzSW1hZ2UoKSAmJiB0aGlzLnJlcGxhY2VEcm9wKSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmUoKVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuZmlsZURyYWdnZWRPdmVyID0gZmFsc2VcclxuXHJcbiAgICAgIGxldCBmaWxlXHJcbiAgICAgIGxldCBkdCA9IGV2dC5kYXRhVHJhbnNmZXJcclxuICAgICAgaWYgKCFkdCkgcmV0dXJuXHJcbiAgICAgIGlmIChkdC5pdGVtcykge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBkdC5pdGVtcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgbGV0IGl0ZW0gPSBkdC5pdGVtc1tpXVxyXG4gICAgICAgICAgaWYgKGl0ZW0ua2luZCA9PSAnZmlsZScpIHtcclxuICAgICAgICAgICAgZmlsZSA9IGl0ZW0uZ2V0QXNGaWxlKClcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZmlsZSA9IGR0LmZpbGVzWzBdXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChmaWxlKSB7XHJcbiAgICAgICAgdGhpcy5fb25OZXdGaWxlSW4oZmlsZSlcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBfcHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSAoKSB7XHJcbiAgICAgIGlmICh0aGlzLmltZ0RhdGEuc3RhcnRYID4gMCkge1xyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAwXHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMuaW1nRGF0YS5zdGFydFkgPiAwKSB7XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IDBcclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy5vdXRwdXRXaWR0aCAtIHRoaXMuaW1nRGF0YS5zdGFydFggPiB0aGlzLmltZ0RhdGEud2lkdGgpIHtcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLm91dHB1dFdpZHRoKVxyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLm91dHB1dEhlaWdodCAtIHRoaXMuaW1nRGF0YS5zdGFydFkgPiB0aGlzLmltZ0RhdGEuaGVpZ2h0KSB7XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IC0odGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMub3V0cHV0SGVpZ2h0KVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIF9wcmV2ZW50Wm9vbWluZ1RvV2hpdGVTcGFjZSAoKSB7XHJcbiAgICAgIGlmICh0aGlzLmltZ0RhdGEud2lkdGggPCB0aGlzLm91dHB1dFdpZHRoKSB7XHJcbiAgICAgICAgdGhpcy5zY2FsZVJhdGlvID0gdGhpcy5vdXRwdXRXaWR0aCAvIHRoaXMubmF0dXJhbFdpZHRoXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLmltZ0RhdGEuaGVpZ2h0IDwgdGhpcy5vdXRwdXRIZWlnaHQpIHtcclxuICAgICAgICB0aGlzLnNjYWxlUmF0aW8gPSB0aGlzLm91dHB1dEhlaWdodCAvIHRoaXMubmF0dXJhbEhlaWdodFxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIF9zZXRPcmllbnRhdGlvbiAob3JpZW50YXRpb24gPSA2LCBhcHBseU1ldGFkYXRhKSB7XHJcbiAgICAgIHZhciB1c2VPcmlnaW5hbCA9IGFwcGx5TWV0YWRhdGFcclxuICAgICAgaWYgKG9yaWVudGF0aW9uID4gMSB8fCB1c2VPcmlnaW5hbCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHJldHVyblxyXG4gICAgICAgIHRoaXMucm90YXRpbmcgPSB0cnVlXHJcbiAgICAgICAgLy8gdS5nZXRSb3RhdGVkSW1hZ2VEYXRhKHVzZU9yaWdpbmFsID8gdGhpcy5vcmlnaW5hbEltYWdlIDogdGhpcy5pbWcsIG9yaWVudGF0aW9uKVxyXG4gICAgICAgIHZhciBfaW1nID0gdS5nZXRSb3RhdGVkSW1hZ2UodXNlT3JpZ2luYWwgPyB0aGlzLm9yaWdpbmFsSW1hZ2UgOiB0aGlzLmltZywgb3JpZW50YXRpb24pXHJcbiAgICAgICAgX2ltZy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmltZyA9IF9pbWdcclxuICAgICAgICAgIHRoaXMuX3BsYWNlSW1hZ2UoYXBwbHlNZXRhZGF0YSlcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5fcGxhY2VJbWFnZShhcHBseU1ldGFkYXRhKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAob3JpZW50YXRpb24gPT0gMikge1xyXG4gICAgICAgIC8vIGZsaXAgeFxyXG4gICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB1LmZsaXBYKHRoaXMub3JpZW50YXRpb24pXHJcbiAgICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT0gNCkge1xyXG4gICAgICAgIC8vIGZsaXAgeVxyXG4gICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB1LmZsaXBZKHRoaXMub3JpZW50YXRpb24pXHJcbiAgICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT0gNikge1xyXG4gICAgICAgIC8vIDkwIGRlZ1xyXG4gICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB1LnJvdGF0ZTkwKHRoaXMub3JpZW50YXRpb24pXHJcbiAgICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT0gMykge1xyXG4gICAgICAgIC8vIDE4MCBkZWdcclxuICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gdS5yb3RhdGU5MCh1LnJvdGF0ZTkwKHRoaXMub3JpZW50YXRpb24pKVxyXG4gICAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09IDgpIHtcclxuICAgICAgICAvLyAyNzAgZGVnXHJcbiAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IHUucm90YXRlOTAodS5yb3RhdGU5MCh1LnJvdGF0ZTkwKHRoaXMub3JpZW50YXRpb24pKSlcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gb3JpZW50YXRpb25cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHVzZU9yaWdpbmFsKSB7XHJcbiAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgX3BhaW50QmFja2dyb3VuZCAoKSB7XHJcbiAgICAgIGxldCBiYWNrZ3JvdW5kQ29sb3IgPSAoIXRoaXMuY2FudmFzQ29sb3IgfHwgdGhpcy5jYW52YXNDb2xvciA9PSAnZGVmYXVsdCcpID8gJ3RyYW5zcGFyZW50JyA6IHRoaXMuY2FudmFzQ29sb3JcclxuICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gYmFja2dyb3VuZENvbG9yXHJcbiAgICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLm91dHB1dFdpZHRoLCB0aGlzLm91dHB1dEhlaWdodClcclxuICAgICAgdGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgdGhpcy5vdXRwdXRXaWR0aCwgdGhpcy5vdXRwdXRIZWlnaHQpXHJcbiAgICB9LFxyXG5cclxuICAgIF9kcmF3ICgpIHtcclxuICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xyXG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB7XHJcbiAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fZHJhd0ZyYW1lKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLl9kcmF3RnJhbWUoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH0sXHJcblxyXG4gICAgX2RyYXdGcmFtZSAoKSB7XHJcbiAgICAgIGlmICghdGhpcy5pbWcpIHJldHVyblxyXG4gICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZVxyXG4gICAgICBsZXQgY3R4ID0gdGhpcy5jdHhcclxuICAgICAgbGV0IHsgc3RhcnRYLCBzdGFydFksIHdpZHRoLCBoZWlnaHQgfSA9IHRoaXMuaW1nRGF0YVxyXG5cclxuICAgICAgdGhpcy5fcGFpbnRCYWNrZ3JvdW5kKClcclxuICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLmltZywgc3RhcnRYLCBzdGFydFksIHdpZHRoLCBoZWlnaHQpXHJcblxyXG4gICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgIHRoaXMuX2NsaXAodGhpcy5fY3JlYXRlQ29udGFpbmVyQ2xpcFBhdGgpXHJcbiAgICAgICAgLy8gdGhpcy5fY2xpcCh0aGlzLl9jcmVhdGVJbWFnZUNsaXBQYXRoKVxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLiRlbWl0KGV2ZW50cy5EUkFXLCBjdHgpXHJcbiAgICAgIGlmICghdGhpcy5pbWFnZVNldCkge1xyXG4gICAgICAgIHRoaXMuaW1hZ2VTZXQgPSB0cnVlXHJcbiAgICAgICAgdGhpcy4kZW1pdChldmVudHMuTkVXX0lNQUdFX0RSQVdOKVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMucm90YXRpbmcgPSBmYWxzZVxyXG4gICAgfSxcclxuXHJcbiAgICBfY2xpcFBhdGhGYWN0b3J5ICh4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICAgIGxldCBjdHggPSB0aGlzLmN0eFxyXG4gICAgICBsZXQgcmFkaXVzID0gdHlwZW9mIHRoaXMuaW1hZ2VCb3JkZXJSYWRpdXMgPT09ICdudW1iZXInID9cclxuICAgICAgICB0aGlzLmltYWdlQm9yZGVyUmFkaXVzIDpcclxuICAgICAgICAhaXNOYU4oTnVtYmVyKHRoaXMuaW1hZ2VCb3JkZXJSYWRpdXMpKSA/IE51bWJlcih0aGlzLmltYWdlQm9yZGVyUmFkaXVzKSA6IDBcclxuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICBjdHgubW92ZVRvKHggKyByYWRpdXMsIHkpO1xyXG4gICAgICBjdHgubGluZVRvKHggKyB3aWR0aCAtIHJhZGl1cywgeSk7XHJcbiAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHggKyB3aWR0aCwgeSwgeCArIHdpZHRoLCB5ICsgcmFkaXVzKTtcclxuICAgICAgY3R4LmxpbmVUbyh4ICsgd2lkdGgsIHkgKyBoZWlnaHQgLSByYWRpdXMpO1xyXG4gICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyh4ICsgd2lkdGgsIHkgKyBoZWlnaHQsIHggKyB3aWR0aCAtIHJhZGl1cywgeSArIGhlaWdodCk7XHJcbiAgICAgIGN0eC5saW5lVG8oeCArIHJhZGl1cywgeSArIGhlaWdodCk7XHJcbiAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHgsIHkgKyBoZWlnaHQsIHgsIHkgKyBoZWlnaHQgLSByYWRpdXMpO1xyXG4gICAgICBjdHgubGluZVRvKHgsIHkgKyByYWRpdXMpO1xyXG4gICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyh4LCB5LCB4ICsgcmFkaXVzLCB5KTtcclxuICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICBfY3JlYXRlQ29udGFpbmVyQ2xpcFBhdGggKCkge1xyXG4gICAgICB0aGlzLl9jbGlwUGF0aEZhY3RvcnkoMCwgMCwgdGhpcy5vdXRwdXRXaWR0aCwgdGhpcy5vdXRwdXRIZWlnaHQpXHJcbiAgICAgIGlmICh0aGlzLmNsaXBQbHVnaW5zICYmIHRoaXMuY2xpcFBsdWdpbnMubGVuZ3RoKSB7XHJcbiAgICAgICAgdGhpcy5jbGlwUGx1Z2lucy5mb3JFYWNoKGZ1bmMgPT4ge1xyXG4gICAgICAgICAgZnVuYyh0aGlzLmN0eCwgMCwgMCwgdGhpcy5vdXRwdXRXaWR0aCwgdGhpcy5vdXRwdXRIZWlnaHQpXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBfY3JlYXRlSW1hZ2VDbGlwUGF0aCAoKSB7XHJcbiAgICAvLyAgIGxldCB7IHN0YXJ0WCwgc3RhcnRZLCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzLmltZ0RhdGFcclxuICAgIC8vICAgbGV0IHcgPSB3aWR0aFxyXG4gICAgLy8gICBsZXQgaCA9IGhlaWdodFxyXG4gICAgLy8gICBsZXQgeCA9IHN0YXJ0WFxyXG4gICAgLy8gICBsZXQgeSA9IHN0YXJ0WVxyXG4gICAgLy8gICBpZiAodyA8IGgpIHtcclxuICAgIC8vICAgICBoID0gdGhpcy5vdXRwdXRIZWlnaHQgKiAod2lkdGggLyB0aGlzLm91dHB1dFdpZHRoKVxyXG4gICAgLy8gICB9XHJcbiAgICAvLyAgIGlmIChoIDwgdykge1xyXG4gICAgLy8gICAgIHcgPSB0aGlzLm91dHB1dFdpZHRoICogKGhlaWdodCAvIHRoaXMub3V0cHV0SGVpZ2h0KVxyXG4gICAgLy8gICAgIHggPSBzdGFydFggKyAod2lkdGggLSB0aGlzLm91dHB1dFdpZHRoKSAvIDJcclxuICAgIC8vICAgfVxyXG4gICAgLy8gICB0aGlzLl9jbGlwUGF0aEZhY3RvcnkoeCwgc3RhcnRZLCB3LCBoKVxyXG4gICAgLy8gfSxcclxuXHJcbiAgICBfY2xpcCAoY3JlYXRlUGF0aCkge1xyXG4gICAgICBsZXQgY3R4ID0gdGhpcy5jdHhcclxuICAgICAgY3R4LnNhdmUoKVxyXG4gICAgICBjdHguZmlsbFN0eWxlID0gJyNmZmYnXHJcbiAgICAgIGN0eC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnZGVzdGluYXRpb24taW4nXHJcbiAgICAgIGNyZWF0ZVBhdGgoKVxyXG4gICAgICBjdHguZmlsbCgpXHJcbiAgICAgIGN0eC5yZXN0b3JlKClcclxuICAgIH0sXHJcblxyXG4gICAgX2FwcGx5TWV0YWRhdGEgKCkge1xyXG4gICAgICBpZiAoIXRoaXMudXNlck1ldGFkYXRhKSByZXR1cm5cclxuICAgICAgdmFyIHsgc3RhcnRYLCBzdGFydFksIHNjYWxlIH0gPSB0aGlzLnVzZXJNZXRhZGF0YVxyXG5cclxuICAgICAgaWYgKHUubnVtYmVyVmFsaWQoc3RhcnRYKSkge1xyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSBzdGFydFhcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHUubnVtYmVyVmFsaWQoc3RhcnRZKSkge1xyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSBzdGFydFlcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHUubnVtYmVyVmFsaWQoc2NhbGUpKSB7XHJcbiAgICAgICAgdGhpcy5zY2FsZVJhdGlvID0gc2NhbGVcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xyXG4gICAgICAgIHRoaXMudXNlck1ldGFkYXRhID0gbnVsbFxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuXHJcbiAgICBvbkRpbWVuc2lvbkNoYW5nZSAoKSB7XHJcbiAgICAgIGlmICghdGhpcy5pbWcpIHtcclxuICAgICAgICB0aGlzLl9pbml0aWFsaXplKClcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgdGhpcy5pbWFnZVNldCA9IGZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3NldFNpemUoKVxyXG4gICAgICAgIHRoaXMuX3BsYWNlSW1hZ2UoKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbjwvc2NyaXB0PlxyXG5cclxuPHN0eWxlIGxhbmc9XCJzdHlsdXNcIj5cclxuLmNyb3BwYS1jb250YWluZXJcclxuICBkaXNwbGF5IGlubGluZS1ibG9ja1xyXG4gIGN1cnNvciBwb2ludGVyXHJcbiAgdHJhbnNpdGlvbiBhbGwgMC4zc1xyXG4gIHBvc2l0aW9uIHJlbGF0aXZlXHJcbiAgZm9udC1zaXplIDBcclxuICBhbGlnbi1zZWxmIGZsZXgtc3RhcnRcclxuICBiYWNrZ3JvdW5kLWNvbG9yICNlNmU2ZTZcclxuXHJcbiAgY2FudmFzXHJcbiAgICB0cmFuc2l0aW9uIGFsbCAwLjNzXHJcblxyXG4gICY6aG92ZXJcclxuICAgIG9wYWNpdHkgMC43XHJcblxyXG4gICYuY3JvcHBhLS1kcm9wem9uZVxyXG4gICAgYm94LXNoYWRvdyBpbnNldCAwIDAgMTBweCBsaWdodG5lc3MoYmxhY2ssIDIwJSlcclxuXHJcbiAgICBjYW52YXNcclxuICAgICAgb3BhY2l0eSAwLjVcclxuXHJcbiAgJi5jcm9wcGEtLWRpc2FibGVkLWNjXHJcbiAgICBjdXJzb3IgZGVmYXVsdFxyXG5cclxuICAgICY6aG92ZXJcclxuICAgICAgb3BhY2l0eSAxXHJcblxyXG4gICYuY3JvcHBhLS1oYXMtdGFyZ2V0XHJcbiAgICBjdXJzb3IgbW92ZVxyXG5cclxuICAgICY6aG92ZXJcclxuICAgICAgb3BhY2l0eSAxXHJcblxyXG4gICAgJi5jcm9wcGEtLWRpc2FibGVkLW16XHJcbiAgICAgIGN1cnNvciBkZWZhdWx0XHJcblxyXG4gICYuY3JvcHBhLS1kaXNhYmxlZFxyXG4gICAgY3Vyc29yIG5vdC1hbGxvd2VkXHJcblxyXG4gICAgJjpob3ZlclxyXG4gICAgICBvcGFjaXR5IDFcclxuXHJcbiAgJi5jcm9wcGEtLXBhc3NpdmVcclxuICAgIGN1cnNvciBkZWZhdWx0XHJcblxyXG4gICAgJjpob3ZlclxyXG4gICAgICBvcGFjaXR5IDFcclxuXHJcbiAgc3ZnLmljb24tcmVtb3ZlXHJcbiAgICBwb3NpdGlvbiBhYnNvbHV0ZVxyXG4gICAgYmFja2dyb3VuZCB3aGl0ZVxyXG4gICAgYm9yZGVyLXJhZGl1cyA1MCVcclxuICAgIGZpbHRlciBkcm9wLXNoYWRvdygtMnB4IDJweCAycHggcmdiYSgwLCAwLCAwLCAwLjcpKVxyXG4gICAgei1pbmRleCAxMFxyXG4gICAgY3Vyc29yIHBvaW50ZXJcclxuICAgIGJvcmRlciAycHggc29saWQgd2hpdGVcclxuPC9zdHlsZT5cclxuXHJcbjxzdHlsZSBsYW5nPVwic2Nzc1wiPlxyXG4vLyBodHRwczovL2dpdGh1Yi5jb20vdG9iaWFzYWhsaW4vU3BpbktpdC9ibG9iL21hc3Rlci9zY3NzL3NwaW5uZXJzLzEwLWZhZGluZy1jaXJjbGUuc2Nzc1xyXG4uc2stZmFkaW5nLWNpcmNsZSB7XHJcbiAgJGNpcmNsZUNvdW50OiAxMjtcclxuICAkYW5pbWF0aW9uRHVyYXRpb246IDFzO1xyXG5cclxuICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcblxyXG4gIC5zay1jaXJjbGUge1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgdG9wOiAwO1xyXG4gIH1cclxuXHJcbiAgLnNrLWNpcmNsZSAuc2stY2lyY2xlLWluZGljYXRvciB7XHJcbiAgICBkaXNwbGF5OiBibG9jaztcclxuICAgIG1hcmdpbjogMCBhdXRvO1xyXG4gICAgd2lkdGg6IDE1JTtcclxuICAgIGhlaWdodDogMTUlO1xyXG4gICAgYm9yZGVyLXJhZGl1czogMTAwJTtcclxuICAgIGFuaW1hdGlvbjogc2stY2lyY2xlRmFkZURlbGF5ICRhbmltYXRpb25EdXJhdGlvbiBpbmZpbml0ZSBlYXNlLWluLW91dCBib3RoO1xyXG4gIH1cclxuXHJcbiAgQGZvciAkaSBmcm9tIDIgdGhyb3VnaCAkY2lyY2xlQ291bnQge1xyXG4gICAgLnNrLWNpcmNsZSN7JGl9IHtcclxuICAgICAgdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnIC8gJGNpcmNsZUNvdW50ICogKCRpIC0gMSkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgQGZvciAkaSBmcm9tIDIgdGhyb3VnaCAkY2lyY2xlQ291bnQge1xyXG4gICAgLnNrLWNpcmNsZSN7JGl9IC5zay1jaXJjbGUtaW5kaWNhdG9yIHtcclxuICAgICAgYW5pbWF0aW9uLWRlbGF5OiAtICRhbmltYXRpb25EdXJhdGlvbiArICRhbmltYXRpb25EdXJhdGlvbiAvICRjaXJjbGVDb3VudCAqXHJcbiAgICAgICAgKFxyXG4gICAgICAgICAgJGkgLSAxXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuQGtleWZyYW1lcyBzay1jaXJjbGVGYWRlRGVsYXkge1xyXG4gIDAlLFxyXG4gIDM5JSxcclxuICAxMDAlIHtcclxuICAgIG9wYWNpdHk6IDA7XHJcbiAgfVxyXG4gIDQwJSB7XHJcbiAgICBvcGFjaXR5OiAxO1xyXG4gIH1cclxufVxyXG48L3N0eWxlPlxyXG5cclxuIiwiLypcbm9iamVjdC1hc3NpZ25cbihjKSBTaW5kcmUgU29yaHVzXG5AbGljZW5zZSBNSVRcbiovXG5cbid1c2Ugc3RyaWN0Jztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG52YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcHJvcElzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkVXNlTmF0aXZlKCkge1xuXHR0cnkge1xuXHRcdGlmICghT2JqZWN0LmFzc2lnbikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIERldGVjdCBidWdneSBwcm9wZXJ0eSBlbnVtZXJhdGlvbiBvcmRlciBpbiBvbGRlciBWOCB2ZXJzaW9ucy5cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTQxMThcblx0XHR2YXIgdGVzdDEgPSBuZXcgU3RyaW5nKCdhYmMnKTsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3LXdyYXBwZXJzXG5cdFx0dGVzdDFbNV0gPSAnZGUnO1xuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MSlbMF0gPT09ICc1Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDIgPSB7fTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspIHtcblx0XHRcdHRlc3QyWydfJyArIFN0cmluZy5mcm9tQ2hhckNvZGUoaSldID0gaTtcblx0XHR9XG5cdFx0dmFyIG9yZGVyMiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QyKS5tYXAoZnVuY3Rpb24gKG4pIHtcblx0XHRcdHJldHVybiB0ZXN0MltuXTtcblx0XHR9KTtcblx0XHRpZiAob3JkZXIyLmpvaW4oJycpICE9PSAnMDEyMzQ1Njc4OScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QzID0ge307XG5cdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAobGV0dGVyKSB7XG5cdFx0XHR0ZXN0M1tsZXR0ZXJdID0gbGV0dGVyO1xuXHRcdH0pO1xuXHRcdGlmIChPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LCB0ZXN0MykpLmpvaW4oJycpICE9PVxuXHRcdFx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdC8vIFdlIGRvbid0IGV4cGVjdCBhbnkgb2YgdGhlIGFib3ZlIHRvIHRocm93LCBidXQgYmV0dGVyIHRvIGJlIHNhZmUuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvdWxkVXNlTmF0aXZlKCkgPyBPYmplY3QuYXNzaWduIDogZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIgdG8gPSB0b09iamVjdCh0YXJnZXQpO1xuXHR2YXIgc3ltYm9scztcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBPYmplY3QoYXJndW1lbnRzW3NdKTtcblxuXHRcdGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG5cdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG5cdFx0XHRcdHRvW2tleV0gPSBmcm9tW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKGdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0c3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9scyhmcm9tKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3ltYm9scy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAocHJvcElzRW51bWVyYWJsZS5jYWxsKGZyb20sIHN5bWJvbHNbaV0pKSB7XG5cdFx0XHRcdFx0dG9bc3ltYm9sc1tpXV0gPSBmcm9tW3N5bWJvbHNbaV1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcbiIsImltcG9ydCBjb21wb25lbnQgZnJvbSAnLi9jcm9wcGVyLnZ1ZSdcclxuaW1wb3J0IGFzc2lnbiBmcm9tICdvYmplY3QtYXNzaWduJ1xyXG5cclxuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XHJcbiAgY29tcG9uZW50TmFtZTogJ2Nyb3BwYSdcclxufVxyXG5cclxuY29uc3QgVnVlQ3JvcHBhID0ge1xyXG4gIGluc3RhbGw6IGZ1bmN0aW9uIChWdWUsIG9wdGlvbnMpIHtcclxuICAgIG9wdGlvbnMgPSBhc3NpZ24oe30sIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKVxyXG4gICAgbGV0IHZlcnNpb24gPSBOdW1iZXIoVnVlLnZlcnNpb24uc3BsaXQoJy4nKVswXSlcclxuICAgIGlmICh2ZXJzaW9uIDwgMikge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHZ1ZS1jcm9wcGEgc3VwcG9ydHMgdnVlIHZlcnNpb24gMi4wIGFuZCBhYm92ZS4gWW91IGFyZSB1c2luZyBWdWVAJHt2ZXJzaW9ufS4gUGxlYXNlIHVwZ3JhZGUgdG8gdGhlIGxhdGVzdCB2ZXJzaW9uIG9mIFZ1ZS5gKVxyXG4gICAgfVxyXG4gICAgbGV0IGNvbXBvbmVudE5hbWUgPSBvcHRpb25zLmNvbXBvbmVudE5hbWUgfHwgJ2Nyb3BwYSdcclxuXHJcbiAgICAvLyByZWdpc3RyYXRpb25cclxuICAgIFZ1ZS5jb21wb25lbnQoY29tcG9uZW50TmFtZSwgY29tcG9uZW50KVxyXG4gIH0sXHJcblxyXG4gIGNvbXBvbmVudFxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IFZ1ZUNyb3BwYSJdLCJuYW1lcyI6WyJkZWZpbmUiLCJ0aGlzIiwicG9pbnQiLCJ2bSIsImNhbnZhcyIsInF1YWxpdHkiLCJyZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiY2xpZW50WCIsImNsaWVudFkiLCJsZWZ0IiwidG9wIiwiZXZ0IiwicG9pbnRlciIsInRvdWNoZXMiLCJjaGFuZ2VkVG91Y2hlcyIsIm9uZVBvaW50Q29vcmQiLCJwb2ludGVyMSIsInBvaW50ZXIyIiwiY29vcmQxIiwiY29vcmQyIiwiTWF0aCIsInNxcnQiLCJwb3ciLCJ4IiwieSIsImltZyIsImNvbXBsZXRlIiwibmF0dXJhbFdpZHRoIiwiZG9jdW1lbnQiLCJ3aW5kb3ciLCJsYXN0VGltZSIsInZlbmRvcnMiLCJsZW5ndGgiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsImNhbGxiYWNrIiwiY3VyclRpbWUiLCJEYXRlIiwiZ2V0VGltZSIsInRpbWVUb0NhbGwiLCJtYXgiLCJpZCIsInNldFRpbWVvdXQiLCJhcmciLCJpc0FycmF5IiwiT2JqZWN0IiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJjYWxsIiwiSFRNTENhbnZhc0VsZW1lbnQiLCJiaW5TdHIiLCJsZW4iLCJhcnIiLCJ0b0Jsb2IiLCJkZWZpbmVQcm9wZXJ0eSIsInR5cGUiLCJhdG9iIiwidG9EYXRhVVJMIiwic3BsaXQiLCJVaW50OEFycmF5IiwiaSIsImNoYXJDb2RlQXQiLCJCbG9iIiwiZHQiLCJkYXRhVHJhbnNmZXIiLCJvcmlnaW5hbEV2ZW50IiwidHlwZXMiLCJhcnJheUJ1ZmZlciIsInZpZXciLCJEYXRhVmlldyIsImdldFVpbnQxNiIsImJ5dGVMZW5ndGgiLCJvZmZzZXQiLCJtYXJrZXIiLCJnZXRVaW50MzIiLCJsaXR0bGUiLCJ0YWdzIiwidXJsIiwicmVnIiwiZXhlYyIsImJhc2U2NCIsImJpbmFyeVN0cmluZyIsImJ5dGVzIiwiYnVmZmVyIiwib3JpZW50YXRpb24iLCJfY2FudmFzIiwiQ2FudmFzRXhpZk9yaWVudGF0aW9uIiwiZHJhd0ltYWdlIiwiX2ltZyIsIkltYWdlIiwic3JjIiwib3JpIiwibWFwIiwibiIsImlzTmFOIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwidmFsdWUiLCJpc0Zpbml0ZSIsImZsb29yIiwiaW5pdGlhbEltYWdlVHlwZSIsIlN0cmluZyIsInZhbCIsIkJvb2xlYW4iLCJ2YWxpZHMiLCJldmVyeSIsImluZGV4T2YiLCJ3b3JkIiwidGVzdCIsIlBDVF9QRVJfWk9PTSIsIk1JTl9NU19QRVJfQ0xJQ0siLCJDTElDS19NT1ZFX1RIUkVTSE9MRCIsIk1JTl9XSURUSCIsIkRFRkFVTFRfUExBQ0VIT0xERVJfVEFLRVVQIiwiUElOQ0hfQUNDRUxFUkFUSU9OIiwic3luY0RhdGEiLCJyZW5kZXIiLCJldmVudHMiLCJJTklUX0VWRU5UIiwicHJvcHMiLCJ3IiwiYXV0b1NpemluZyIsInJlYWxXaWR0aCIsIndpZHRoIiwiaCIsInJlYWxIZWlnaHQiLCJoZWlnaHQiLCJwbGFjZWhvbGRlckZvbnRTaXplIiwibmF0dXJhbEhlaWdodCIsImxvYWRpbmdTaXplIiwiX2luaXRpYWxpemUiLCJyQUZQb2x5ZmlsbCIsInRvQmxvYlBvbHlmaWxsIiwic3VwcG9ydHMiLCJzdXBwb3J0RGV0ZWN0aW9uIiwiYmFzaWMiLCJ3YXJuIiwicGFzc2l2ZSIsIiR3YXRjaCIsImRhdGEiLCJzZXQiLCJrZXkiLCIkc2V0IiwicmVtb3ZlIiwiJG5leHRUaWNrIiwiX2RyYXciLCJfYXV0b1NpemluZ0luaXQiLCJfYXV0b1NpemluZ1JlbW92ZSIsIm9uRGltZW5zaW9uQ2hhbmdlIiwiX3NldFBsYWNlaG9sZGVycyIsImltYWdlU2V0IiwiX3BsYWNlSW1hZ2UiLCJvbGRWYWwiLCJ1IiwibnVtYmVyVmFsaWQiLCJwb3MiLCJjdXJyZW50UG9pbnRlckNvb3JkIiwiaW1nRGF0YSIsInN0YXJ0WCIsInN0YXJ0WSIsInVzZXJNZXRhZGF0YSIsInJvdGF0aW5nIiwib2Zmc2V0WCIsIm9mZnNldFkiLCJwcmV2ZW50V2hpdGVTcGFjZSIsIl9wcmV2ZW50Wm9vbWluZ1RvV2hpdGVTcGFjZSIsIl9wcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlIiwic2NhbGVSYXRpbyIsImhhc0ltYWdlIiwiYWJzIiwiJGVtaXQiLCJaT09NX0VWRU5UIiwiTE9BRElOR19TVEFSVCIsIkxPQURJTkdfRU5EIiwiY3R4IiwiY2hvc2VuRmlsZSIsIiRyZWZzIiwiZmlsZUlucHV0IiwiZmlsZXMiLCJvbGRYIiwib2xkWSIsIk1PVkVfRVZFTlQiLCJhbW91bnQiLCJtb3ZlIiwiem9vbUluIiwiYWNjZWxlcmF0aW9uIiwicmVhbFNwZWVkIiwiem9vbVNwZWVkIiwic3BlZWQiLCJvdXRwdXRXaWR0aCIsInpvb20iLCJzdGVwIiwiZGlzYWJsZVJvdGF0aW9uIiwiZGlzYWJsZWQiLCJwYXJzZUludCIsIl9yb3RhdGVCeVN0ZXAiLCJfc2V0T3JpZW50YXRpb24iLCJtZXRhZGF0YSIsImNvbXByZXNzaW9uUmF0ZSIsIm1pbWVUeXBlIiwicXVhbGl0eUFyZ3VtZW50IiwiYXJncyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZ2VuZXJhdGVCbG9iIiwiYmxvYiIsImVyciIsImRpdiIsImNyZWF0ZUVsZW1lbnQiLCJGaWxlIiwiRmlsZVJlYWRlciIsIkZpbGVMaXN0IiwiY2xpY2siLCJoYWRJbWFnZSIsIm9yaWdpbmFsSW1hZ2UiLCJsb2FkaW5nIiwidmlkZW8iLCJwYXVzZSIsIklNQUdFX1JFTU9WRV9FVkVOVCIsInBsdWdpbiIsImNsaXBQbHVnaW5zIiwicHVzaCIsIkVycm9yIiwid3JhcHBlciIsImdldENvbXB1dGVkU3R5bGUiLCJzbGljZSIsInVzZUF1dG9TaXppbmciLCJfc2V0Q29udGFpbmVyU2l6ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiX3NldFNpemUiLCJzdHlsZSIsImJhY2tncm91bmRDb2xvciIsImNhbnZhc0NvbG9yIiwiZ2V0Q29udGV4dCIsIm1vekltYWdlU21vb3RoaW5nRW5hYmxlZCIsImltYWdlU21vb3RoaW5nUXVhbGl0eSIsIndlYmtpdEltYWdlU21vb3RoaW5nRW5hYmxlZCIsIm1zSW1hZ2VTbW9vdGhpbmdFbmFibGVkIiwiaW1hZ2VTbW9vdGhpbmdFbmFibGVkIiwiX3NldEluaXRpYWwiLCJvdXRwdXRIZWlnaHQiLCIkc2xvdHMiLCJwbGFjZWhvbGRlciIsInZOb2RlIiwidGFnIiwiZWxtIiwib25Mb2FkIiwiaW1hZ2VMb2FkZWQiLCJvbmxvYWQiLCJ0ZXh0QmFzZWxpbmUiLCJ0ZXh0QWxpZ24iLCJkZWZhdWx0Rm9udFNpemUiLCJmb250U2l6ZSIsImNvbXB1dGVkUGxhY2Vob2xkZXJGb250U2l6ZSIsImZvbnQiLCJmaWxsU3R5bGUiLCJwbGFjZWhvbGRlckNvbG9yIiwiZmlsbFRleHQiLCJfcGFpbnRCYWNrZ3JvdW5kIiwiX3NldEltYWdlUGxhY2Vob2xkZXIiLCJfc2V0VGV4dFBsYWNlaG9sZGVyIiwiaW5pdGlhbCIsImluaXRpYWxJbWFnZSIsInNldEF0dHJpYnV0ZSIsImJhYmVsSGVscGVycy50eXBlb2YiLCJjdXJyZW50SXNJbml0aWFsIiwiX29ubG9hZCIsImRhdGFzZXQiLCJvbmVycm9yIiwiSU5JVElBTF9JTUFHRV9MT0FERURfRVZFTlQiLCJ2aWRlb1dpZHRoIiwidmlkZW9IZWlnaHQiLCJkcmF3RnJhbWUiLCJmcmFtZSIsImtlZXBEcmF3aW5nIiwiZW5kZWQiLCJwYXVzZWQiLCJlbWl0TmF0aXZlRXZlbnQiLCJkaXNhYmxlQ2xpY2tUb0Nob29zZSIsInN1cHBvcnRUb3VjaCIsImNob29zZUZpbGUiLCJ2aWRlb0VuYWJsZWQiLCJwbGF5IiwiaW5wdXQiLCJmaWxlIiwiX29uTmV3RmlsZUluIiwiRklMRV9DSE9PU0VfRVZFTlQiLCJfZmlsZVNpemVJc1ZhbGlkIiwiRklMRV9TSVpFX0VYQ0VFRF9FVkVOVCIsIl9maWxlVHlwZUlzVmFsaWQiLCJGSUxFX1RZUEVfTUlTTUFUQ0hfRVZFTlQiLCJuYW1lIiwidG9Mb3dlckNhc2UiLCJwb3AiLCJmciIsImUiLCJmaWxlRGF0YSIsInRhcmdldCIsInJlc3VsdCIsInBhcnNlRGF0YVVybCIsImlzVmlkZW8iLCJyZWFkeVN0YXRlIiwiSEFWRV9GVVRVUkVfREFUQSIsIl9vblZpZGVvTG9hZCIsImxvZyIsImdldEZpbGVPcmllbnRhdGlvbiIsImJhc2U2NFRvQXJyYXlCdWZmZXIiLCJORVdfSU1BR0UiLCJyZWFkQXNEYXRhVVJMIiwiZmlsZVNpemVMaW1pdCIsInNpemUiLCJhY2NlcHRhYmxlTWltZVR5cGUiLCJjYW5QbGF5VHlwZSIsImFjY2VwdCIsImJhc2VNaW1ldHlwZSIsInJlcGxhY2UiLCJ0IiwidHJpbSIsImNoYXJBdCIsImZpbGVCYXNlVHlwZSIsImFwcGx5TWV0YWRhdGEiLCJfYXNwZWN0RmlsbCIsImluaXRpYWxTaXplIiwiX2FzcGVjdEZpdCIsIl9uYXR1cmFsU2l6ZSIsImluaXRpYWxQb3NpdGlvbiIsIl9hcHBseU1ldGFkYXRhIiwiaW1nV2lkdGgiLCJpbWdIZWlnaHQiLCJjYW52YXNSYXRpbyIsImFzcGVjdFJhdGlvIiwicG9pbnRlck1vdmVkIiwicG9pbnRlckNvb3JkIiwiZ2V0UG9pbnRlckNvb3JkcyIsInBvaW50ZXJTdGFydENvb3JkIiwidGFiU3RhcnQiLCJ2YWx1ZU9mIiwid2hpY2giLCJkcmFnZ2luZyIsInBpbmNoaW5nIiwiY29vcmQiLCJsYXN0TW92aW5nQ29vcmQiLCJkaXNhYmxlUGluY2hUb1pvb20iLCJwaW5jaERpc3RhbmNlIiwiZ2V0UGluY2hEaXN0YW5jZSIsImNhbmNlbEV2ZW50cyIsIl9oYW5kbGVQb2ludGVyRW5kIiwicG9pbnRlck1vdmVEaXN0YW5jZSIsInRhYkVuZCIsImRpc2FibGVEcmFnVG9Nb3ZlIiwicHJldmVudERlZmF1bHQiLCJkaXN0YW5jZSIsImRlbHRhIiwiZGlzYWJsZVNjcm9sbFRvWm9vbSIsInNjcm9sbGluZyIsIndoZWVsRGVsdGEiLCJkZWx0YVkiLCJkZXRhaWwiLCJyZXZlcnNlU2Nyb2xsVG9ab29tIiwiZGlzYWJsZURyYWdBbmREcm9wIiwiZXZlbnRIYXNGaWxlIiwicmVwbGFjZURyb3AiLCJmaWxlRHJhZ2dlZE92ZXIiLCJpdGVtcyIsIml0ZW0iLCJraW5kIiwiZ2V0QXNGaWxlIiwidXNlT3JpZ2luYWwiLCJnZXRSb3RhdGVkSW1hZ2UiLCJmbGlwWCIsImZsaXBZIiwicm90YXRlOTAiLCJjbGVhclJlY3QiLCJmaWxsUmVjdCIsIl9kcmF3RnJhbWUiLCJfY2xpcCIsIl9jcmVhdGVDb250YWluZXJDbGlwUGF0aCIsIkRSQVciLCJORVdfSU1BR0VfRFJBV04iLCJyYWRpdXMiLCJpbWFnZUJvcmRlclJhZGl1cyIsImJlZ2luUGF0aCIsIm1vdmVUbyIsImxpbmVUbyIsInF1YWRyYXRpY0N1cnZlVG8iLCJjbG9zZVBhdGgiLCJfY2xpcFBhdGhGYWN0b3J5IiwiZm9yRWFjaCIsImNyZWF0ZVBhdGgiLCJzYXZlIiwiZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uIiwiZmlsbCIsInJlc3RvcmUiLCJzY2FsZSIsImRlZmF1bHRPcHRpb25zIiwiVnVlQ3JvcHBhIiwiVnVlIiwib3B0aW9ucyIsImFzc2lnbiIsInZlcnNpb24iLCJjb21wb25lbnROYW1lIiwiY29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsQ0FBQyxVQUFVLElBQUksRUFBRSxPQUFPLEVBQUU7SUFDdEIsSUFBSSxPQUFPQSxTQUFNLEtBQUssVUFBVSxJQUFJQSxTQUFNLENBQUMsR0FBRyxFQUFFO1FBQzVDQSxTQUFNLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ3ZCLE1BQU0sQUFBaUM7UUFDcEMsY0FBYyxHQUFHLE9BQU8sRUFBRSxDQUFDO0tBQzlCLEFBRUY7Q0FDRixDQUFDQyxjQUFJLEVBQUUsWUFBWTtFQUNsQixZQUFZLENBQUM7O0VBRWIsU0FBUyxTQUFTLENBQUMsR0FBRyxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUU7SUFDeEQsSUFBSSxDQUFDLFNBQVMsQ0FB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
