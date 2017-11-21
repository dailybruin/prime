export default function main() {
  const $window = $(window);
  let ratio = $window.height() / $window.width();

  $(document).ready(() => {
    const $topbar = $('#top-bar');
    const $topbarlogo = $('#top-bar-logo');
    if (ratio <= 0.65) {
      $topbar.removeClass('hidden');
      $topbarlogo.removeClass('top-bar-logo-fixed');
    } else {
      if (!$topbar.hasClass('hidden')) {
        $topbar.addClass('hidden');
      }
      if (!$topbarlogo.hasClass('top-bar-logo-fixed')) {
        $topbarlogo.addClass('top-bar-logo-fixed');
      }
    }

    $(window).scroll(() => {
      const $topBarLogoElem = $('#top-bar-logo');
      const $leftBarLogoElem = $('#left-bar-logo');
      if ($(window).scrollTop() >= 800) {
        if (!$topBarLogoElem.hasClass('logo-hidden')) {
          $topBarLogoElem.addClass('logo-hidden');
        }
        if ($leftBarLogoElem.hasClass('logo-hidden')) {
          $leftBarLogoElem.removeClass('logo-hidden');
        }
      } else {
        if ($topBarLogoElem.hasClass('logo-hidden')) {
          $topBarLogoElem.removeClass('logo-hidden');
        }
        if (!$leftBarLogoElem.hasClass('logo-hidden')) {
          $leftBarLogoElem.addClass('logo-hidden');
        }
      }
    });

    $window.resize(() => {
      ratio = $window.height() / $window.width();
      if (ratio <= 0.65) {
        $topbar.removeClass('hidden');
        $topbarlogo.removeClass('top-bar-logo-fixed');
      } else {
        if (!$topbar.hasClass('hidden')) {
          $topbar.addClass('hidden');
        }
        if (!$topbarlogo.hasClass('top-bar-logo-fixed')) {
          $topbarlogo.addClass('top-bar-logo-fixed');
        }
      }
    });
  });
}
