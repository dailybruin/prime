/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _main = __webpack_require__(1);

var _main2 = _interopRequireDefault(_main);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _main2.default)();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = main;

var _comic = __webpack_require__(2);

var _comic2 = _interopRequireDefault(_comic);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function main() {
  $(document).ready(function () {
    var $window = $(window);
    var ratio = $window.height() / $window.width();

    var $topbar = $('#top-bar');
    var $topBarLogoElem = $('#top-bar-logo');
    var $leftBarLogoElem = $('#left-bar-logo');
    var scrollThres = ratio > 1.2 ? 150 : 800;

    $(window).resize(function () {
      ratio = $window.height() / $window.width();
      scrollThres = ratio > 1.2 ? 150 : 800;
    });

    $(window).scroll(function () {
      if ($(window).scrollTop() >= scrollThres) {
        if (!$topBarLogoElem.hasClass('logo-hidden')) {
          $topBarLogoElem.addClass('logo-hidden');
        }
        if ($leftBarLogoElem.hasClass('logo-hidden')) {
          $leftBarLogoElem.removeClass('logo-hidden');
        }
        if ($topbar.hasClass('hidden')) {
          $topbar.removeClass('hidden');
        }
      } else {
        if ($topBarLogoElem.hasClass('logo-hidden')) {
          $topBarLogoElem.removeClass('logo-hidden');
        }
        if (!$leftBarLogoElem.hasClass('logo-hidden')) {
          $leftBarLogoElem.addClass('logo-hidden');
        }
        if (!$topbar.hasClass('hidden')) {
          $topbar.addClass('hidden');
        }
      }
    });

    (0, _comic2.default)();
  });
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = initComics;
function initComics() {
  var $pswp = $('.pswp')[0];
  var image = [];

  $('.picture').each(function () {
    var $pic = $(this),
        getItems = function getItems() {
      var items = [];
      $pic.find('a').each(function () {
        var $href = $(this).attr('href'),
            $size = $(this).data('size').split('x'),
            $width = $size[0],
            $height = $size[1];

        var item = {
          src: $href,
          w: $width,
          h: $height
        };

        items.push(item);
      });
      return items;
    };

    var items = getItems();

    $.each(items, function (index, value) {
      image[index] = new Image();
      image[index].src = value['src'];
    });

    $pic.on('click', 'figure', function (event) {
      event.preventDefault();
      var $index = $(this).index();
      var options = {
        index: $index,
        bgOpacity: 0.7,
        showHideOpacity: true
      };

      var lightBox = new PhotoSwipe($pswp, PhotoSwipeUI_Default, items, options);
      lightBox.init();
    });
  });
}

/***/ })
/******/ ]);