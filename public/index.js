parcelRequire=function(e,r,n,t){function i(n,t){function o(e){return i(o.resolve(e))}function c(r){return e[n][1][r]||r}if(!r[n]){if(!e[n]){var l="function"==typeof parcelRequire&&parcelRequire;if(!t&&l)return l(n,!0);if(u)return u(n,!0);if(f&&"string"==typeof n)return f(n);var p=new Error("Cannot find module '"+n+"'");throw p.code="MODULE_NOT_FOUND",p}o.resolve=c;var a=r[n]=new i.Module(n);e[n][0].call(a.exports,o,a,a.exports,this)}return r[n].exports}function o(e){this.id=e,this.bundle=i,this.exports={}}var u="function"==typeof parcelRequire&&parcelRequire,f="function"==typeof require&&require;i.isParcelRequire=!0,i.Module=o,i.modules=e,i.cache=r,i.parent=u;for(var c=0;c<n.length;c++)i(n[c]);if(n.length){var l=i(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):t&&(this[t]=l)}return i}({5:[function(require,module,exports) {
"use strict";function t(){var t=$(".pswp")[0],i=[];$(".picture").each(function(){var e=$(this),n=function(){var t=[];return e.find("a").each(function(){var i=$(this).data("img"),e=$(this).data("size").split("x"),n=(e[0],e[1],{src:i,w:$(this).find("img")[0].naturalWidth,h:$(this).find("img")[0].naturalHeight,img:$(this)});t.push(n)}),t}();$.each(n,function(t,e){i[t]=new Image,i[t].src=e.src}),$.each(n,function(i,e){$(e.img).parent().on("click",function(e){e.preventDefault(),new PhotoSwipe(t,PhotoSwipeUI_Default,n,{index:i,bgOpacity:.7,showHideOpacity:!0}).init()})})})}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=t;
},{}],3:[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=s;var d=require("./comic"),o=e(d);function e(d){return d&&d.__esModule?d:{default:d}}function s(){$(document).ready(function(){var d=$(window),e=d.height()/d.width(),s=$("#top-bar"),l=$("#top-bar-logo"),a=$("#left-bar-logo"),i=e>1.2?150:800;$(window).resize(function(){e=d.height()/d.width(),i=e>1.2?150:800}),$(window).scroll(function(){$(window).scrollTop()>=i?(l.hasClass("logo-hidden")||l.addClass("logo-hidden"),a.hasClass("logo-hidden")&&a.removeClass("logo-hidden"),s.hasClass("hidden")&&s.removeClass("hidden")):(l.hasClass("logo-hidden")&&l.removeClass("logo-hidden"),a.hasClass("logo-hidden")||a.addClass("logo-hidden"),s.hasClass("hidden")||s.addClass("hidden"))}),(0,o.default)()})}
},{"./comic":5}],1:[function(require,module,exports) {
"use strict";var e=require("./main"),u=r(e);function r(e){return e&&e.__esModule?e:{default:e}}(0,u.default)();
},{"./main":3}]},{},[1], null)
//# sourceMappingURL=/index.map