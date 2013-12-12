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

$(document).scroll(function(){
	fadeit('.exp-anim-1');
	fadeit('.exp-anim-2');
	fadeitOf('.exp-anim-3', '.exp-anim-for-3');
	fadeit('.exp-anim-4');
	if(isScrolled('.exp-anim-4')) {
		setTimeout(function(){justFade('.exp-anim-5');},500);
		setTimeout(function(){justFade('.exp-anim-6');},1000);
		setTimeout(function(){justFade('.exp-anim-7');},2000);
	}
	fadeit('.exp-anim-8');
	if(isScrolled('.exp-anim-8')) {
		setTimeout(function(){justFade('.exp-anim-9');},500);
		setTimeout(function(){justFade('.exp-anim-10');},1000);
	}
});

var animload = false;

function fadeit(el) {
	if(isScrolled(el)) {
		$(el).css('opacity', 1);
	}
}

function fadeItAfter(el, time) {
	setTimeout(function(){ fadeit(el); }, time);
}

function fadeitOf(el, of) {
	if(isExScrolled(of)) {
		$(el).css('opacity', 1);
	}
}

function justFade(el) {
	$(el).css('opacity', 1);
}

function getCurrentSlideId() {
	$('.current-slide').html(fotorama.activeIndex+1);
}

function isScrolled(elem)
{
    var $topp = $(elem).position().top;
    var $bottomp = $topp + $(elem).height();
    var $windowh = $(window).height();
    var $amountw = $windowh*0.2;
    if($(document).scrollTop() > $topp-$amountw-100 && $(document).scrollTop() < $bottomp ) {
    	return true;
    } else {
    	return false;
    }
}

function isExScrolled(elem) {
	var $topp = $(elem).position().top;
    var $bottomp = $topp + $(elem).height();
    var $windowh = $(window).height();
    if($(document).scrollTop() > $bottomp-$windowh+300 && $(document).scrollTop() < $bottomp ) {
    	return true;
    } else {
    	return false;
    }
}