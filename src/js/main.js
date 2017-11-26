export default function main() {
  const $window = $(window);
  let ratio = $window.height() / $window.width();

  $(document).ready(() => {
    const $topbar = $('#top-bar');
    const $topBarLogoElem = $('#top-bar-logo');
    const $leftBarLogoElem = $('#left-bar-logo');

    $(window).scroll(() => {
      if ($(window).scrollTop() >= 800) {
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
  });
}
