export default function initComics() {
  var $pswp = $('.pswp')[0];
  var image = [];

  $('.picture').each(function() {
    var $pic = $(this),
      getItems = function() {
        var items = [];
        $pic.find('a').each(function() {
          var $href = $(this).data('img'),
            $size = $(this)
              .data('size')
              .split('x'),
            $width = $size[0],
						$height = $size[1];
											
          var item = {
            src: $href,
            w: $(this).find('img')[0].naturalWidth,
						h: $(this).find('img')[0].naturalHeight,
						img: $(this)
					};
					
          items.push(item);
        });
        return items;
      };

    var items = getItems();

    $.each(items, function(index, value) {
      image[index] = new Image();
      image[index].src = value['src'];
		});
		
		$.each(items, function(index, val) {
			$(val.img).parent().on('click', function(event) {
				event.preventDefault();
				var options = {
					index: index,
					bgOpacity: 0.7,
					showHideOpacity: true,
				};
	
				var lightBox = new PhotoSwipe(
					$pswp,
					PhotoSwipeUI_Default,
					items,
					options
				);
				lightBox.init();			
			});	
		});
  });
}
