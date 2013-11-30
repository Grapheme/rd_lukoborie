<<<<<<< HEAD
var $countClasses 	= 0;
var $classes 		= [];
var $counts 		= [];
var $product_min 	= 0;
var $video_min;
var $image_min;

$('.fotos img').each(function(){
	$counts[$countClasses] = $countClasses;
	$classes[$countClasses] = $(this).attr('class');
	$countClasses++;
});

console.log($classes);

$(function(){
	$.each($classes, function(key, value) {
      if(value == 'video') {
      		$video_min = key;
      }
      if(value == 'image') {
      		$image_min = key;
      }
	});
});


var $fotoramaDiv = $('.fotos').fotorama();
var fotorama = $fotoramaDiv.data('fotorama');

$('.slider-nav a[data-to="product"]').click(function(){
	fotorama.show($product_min);
	return false;
});

$('.slider-nav a[data-to="video"]').click(function(){
	fotorama.show($video_min);
	return false;
});

$('.slider-nav a[data-to="image"]').click(function(){
	fotorama.show($image_min);
	return false;
});

$('.fotos').on('fotorama:show',function(){
	setActiveLink(fotorama.activeIndex);
});

$('.slider-to-right').click(function() {
	fotorama.show('>');
	return false;
});

$('.slider-to-left').click(function() {
	fotorama.show('<');
	return false;
});

function setActiveLink(id) {
	this.idclass = $classes[id];
	$('.slider-nav a').removeClass('active');
	$('.slider-nav a[data-to=' + idclass + ']').addClass('active');
}
=======
$(document).ready( function(){
	$('.gallery-item .likes-thumb').click( function(){
		$(this).parent().parent().find('.overlay').css({ display: 'block', opacity: 1 });
	});
});
>>>>>>> fixes
