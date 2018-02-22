import initComics from './comic';

export default function main() {
  $(document).ready(() => {
    const $window = $(window);
    let ratio = $window.height() / $window.width();

    const $topbar = $('#top-bar');
    const $topBarLogoElem = $('#top-bar-logo');
    const $leftBarLogoElem = $('#left-bar-logo');
    let scrollThres = ratio > 1.2 ? 150 : 800;

    $(window).resize(() => {
      ratio = $window.height() / $window.width();
      scrollThres = ratio > 1.2 ? 150 : 800;
    });

    $(window).scroll(() => {
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

    initComics();
  });
}
