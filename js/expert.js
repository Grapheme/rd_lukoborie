var $expert = 0;

$('.expert-foto img').each(function(){
	$expert++;
});

$(function(){
	$('.all-slides').html($expert);
	
	animateOnLoad();
	function animateOnLoad() {			
		/* Анимация происходит при помощи transition */		
		var $leftElems = $('.left_dir');
		var $rightelems = $('.right_dir');					
		
		timeOutFade($leftElems, 0, 400);
		timeOutFade($rightelems, 0, 300);
	}
});

var $fotoramaDiv = $('.expert-foto').fotorama();
var fotorama = $fotoramaDiv.data('fotorama');

$('.slider-to-right').click(function() {
	fotorama.show('>');
	getCurrentSlideId();
	return false;
});

$('.slider-to-left').click(function() {
	fotorama.show('<');
	getCurrentSlideId();
	return false;
});

function getCurrentSlideId() {
	$('.current-slide').html(fotorama.activeIndex+1);
}