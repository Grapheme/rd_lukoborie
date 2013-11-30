var $countClasses 	= 0;
var $classes 		= [];
var $counts 		= [];
var $text_blocks 	= 0;
var $product_min 	= 0;
var $video_min;
var $image_min;
var $images_all;

$('.fotos img').each(function(){
	$counts[$countClasses] = $countClasses;
	$classes[$countClasses] = $(this).attr('class');
	$countClasses++;
});

$('.slider-under-block').each(function(){
	if($text_blocks > 3) {
		$(this).css('display','none');
	}
	if($text_blocks == 3) {
		$(this).addClass('text-right');
	}
	$text_blocks++;
});

$(function(){
	$.each($classes, function(key, value) {
		if(value == 'video') {
			$video_min = key;
		}
		if(value == 'image') {
			$image_min = key;
		}
		$images_all = key;
	});
	getImagesCount();
});


var $fotoramaDiv = $('.fotos').fotorama();
var fotorama = $fotoramaDiv.data('fotorama');

$('.slider-nav a').click(function(){
	goToCategory(this);
	return false;
});

function goToCategory(link) {
	this.datalink = $(link).attr('data-to');
	switch (datalink) {
		case 'product':
			fotorama.show($product_min);
			break;
		case 'video':
			fotorama.show($video_min);
			break;
		case 'image':
			fotorama.show($image_min);
			break;
	}
}

$('.fotos').on('fotorama:show',function(){
	setActiveLink(fotorama.activeIndex);
	getCurrentSlideId();
});

$('.slider-to-right').click(function() {
	textSlide('right');
	fotorama.show('>');
	return false;
});

$('.slider-to-left').click(function() {
	textSlide('left');
	fotorama.show('<');
	return false;
});

function textSlide(direction) {
	switch (direction) {
		case 'left':
			this.text_width = $('.slider-under-block').width();
			break;
		case 'right':
			this.text_width = $('.slider-under-block').width()*(-1);
			break;
	}
	if (!$('.slider-under-block').is(':animated')) {
		$('.slider-under-block').animate({ left: parseInt($('.slider-under-block').css('left')) + text_width });
	}
}

//Номер текущего слайда
function getCurrentSlideId() {
	$('.current-slide').html(fotorama.activeIndex+1);
}

//Количество слайдов
function getImagesCount() {
	$('.all-slides').html($images_all+1);
}

function setActiveLink(id) {
	this.idclass = $classes[id];
	$('.slider-nav a').removeClass('active');
	$('.slider-nav a[data-to=' + idclass + ']').addClass('active');
}

$(document).ready( function(){
	$('.gallery-item .likes-thumb').click( function(){
		$(this).parent().parent().find('.overlay').css({ display: 'block', opacity: 1 });
	});
});
