!(function(e) {
  function n(o) {
    if (t[o]) return t[o].exports;
    var i = (t[o] = { i: o, l: !1, exports: {} });
    return e[o].call(i.exports, i, i.exports, n), (i.l = !0), i.exports;
  }
  var t = {};
  (n.m = e),
    (n.c = t),
    (n.d = function(e, t, o) {
      n.o(e, t) ||
        Object.defineProperty(e, t, {
          configurable: !1,
          enumerable: !0,
          get: o,
        });
    }),
    (n.n = function(e) {
      var t =
        e && e.__esModule
          ? function() {
              return e.default;
            }
          : function() {
              return e;
            };
      return n.d(t, 'a', t), t;
    }),
    (n.o = function(e, n) {
      return Object.prototype.hasOwnProperty.call(e, n);
    }),
    (n.p = ''),
    n((n.s = 0));
})([
  function(e, n, t) {
    'use strict';
    (0,
    (function(e) {
      return e && e.__esModule ? e : { default: e };
    })(t(1)).default)();
  },
  function(e, n, t) {
    'use strict';
    Object.defineProperty(n, '__esModule', { value: !0 }),
      (n.default = function() {
        $(document).ready(function() {
          var e = $(window),
            n = e.height() / e.width(),
            t = $('#top-bar'),
            i = $('#top-bar-logo'),
            r = $('#left-bar-logo'),
            s = n > 1.2 ? 150 : 800;
          $(window).resize(function() {
            (n = e.height() / e.width()), (s = n > 1.2 ? 150 : 800);
          }),
            $(window).scroll(function() {
              $(window).scrollTop() >= s
                ? (i.hasClass('logo-hidden') || i.addClass('logo-hidden'),
                  r.hasClass('logo-hidden') && r.removeClass('logo-hidden'),
                  t.hasClass('hidden') && t.removeClass('hidden'))
                : (i.hasClass('logo-hidden') && i.removeClass('logo-hidden'),
                  r.hasClass('logo-hidden') || r.addClass('logo-hidden'),
                  t.hasClass('hidden') || t.addClass('hidden'));
            }),
            (0, o.default)();
        });
      });
    var o = (function(e) {
      return e && e.__esModule ? e : { default: e };
    })(t(2));
  },
  function(e, n, t) {
    'use strict';
    Object.defineProperty(n, '__esModule', { value: !0 }),
      (n.default = function() {
        var e = $('.pswp')[0],
          n = [];
        $('.picture').each(function() {
          var t = $(this),
            o = (function() {
              var e = [];
              return (
                t.find('a').each(function() {
                  var n = $(this).attr('href'),
                    t = $(this)
                      .data('size')
                      .split('x'),
                    o = { src: n, w: t[0], h: t[1] };
                  e.push(o);
                }),
                e
              );
            })();
          $.each(o, function(e, t) {
            (n[e] = new Image()), (n[e].src = t.src);
          }),
            t.on('click', 'figure', function(n) {
              n.preventDefault();
              var t = {
                index: $(this).index(),
                bgOpacity: 0.7,
                showHideOpacity: !0,
              };
              new PhotoSwipe(e, PhotoSwipeUI_Default, o, t).init();
            });
        });
      });
  },
]);
