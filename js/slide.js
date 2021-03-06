/*
 * Vars
 */

var $countClasses 	= 0;
var $classes 		= [];
var $counts 		= [];
var $text_blocks 	= 0; 	// Last block id
var $product_min 	= 0;	// Product first id
var $video_min;				// Video first id
var $image_min;				// Image first id
var $images_all;			// Amount of all slides
var $step			= ($('.wrapper').width()-40)/4;
var $slider_text	= '.slider-text';
var $text_block 	= '.slider-text .slider-under-block';
var $left_text		= 0;

var $tblock_speed 	= 400; // Speed of text blocks animation
var $text_top_speed = 250; // Speed of text getting top
var $left_anim_speed= 250; // Speed of left text animation

var $text_to_top	= 142; 	// px
var $nav			= 0;

/*
 * each
 */

var $video_b = true;
var $image_b = true;
var $video_first;
var $image_first;

// Counting numbers of slides
$('.fotos a').each(function(){
	$counts[$countClasses] = $countClasses;
	$classes[$countClasses] = $(this).attr('class');
	if($(this).attr('class') == 'video' && $video_b == true)
	{
		$video_first = $countClasses;
		$video_b = false;
	}
	if($(this).attr('class') == 'image' && $image_b == true)
	{
		$image_first = $countClasses;
		$image_b = false;
	}
	$countClasses++;
});

// Set id for text blocks
$('.slider-under-block').each(function(){
	$(this).attr('data-text',$text_blocks);
	$text_blocks++;
});

$('.slide-left-text').each(function(){
	if($left_text != 0) {
		$(this).css('display', 'none');
		$(this).css('top', $('.slide-texts').height());
	} else {
		$(this).addClass('active-text');
	}
	$(this).attr('data-lid',$left_text);
	$left_text++;
});

$('.slider-nav a').each(function(){
	$(this).attr('data-link',$nav);
	$nav++;
});

/*
 * Document ready
 */

$(function(){
	
	animateNav();
	
	$.each($classes, function(key, value) {
		if(value == 'video') {
			$video_min = key-1;
		}
		if(value == 'image') {
			$image_min = key-1;
		}
		$images_all = key;
	});
	getImagesCount();
	setNewBlocks();
	getLeftWidth();
	
	/*-------------------------------------------------
	 * Form events
	 --------------------------------------------------*/
	
	$('#prodDiscount .buy-submit').click( function() {
		//TODO: дописать submit
		$(this).parent().hide();
		$('.buy-form-capt').html('Проверьте электронную почту <br/>и покупайте Lumix GX7 со скидкой').css({'white-space':'nowrap'});
	});
	$('#prodDiscount').submit( function() {
		$(this).hide();
		$('.buy-form-capt').html('Проверьте электронную почту <br/>и покупайте Lumix GX7 со скидкой').css({'white-space':'nowrap'});		
		return false;
	});
	
});

/*
 * fotorama init
 */

var $fotoramaDiv = $('.fotos').fotorama();
var fotorama = $fotoramaDiv.data('fotorama');

/*
 * Events
 */

$('.slider-nav a').click(function(){
	navToSlider(this);
	goToCategory(this);
	return false;
});

$('.fotos').on('fotorama:show',function(){
	setActiveLink(fotorama.activeIndex);
	getCurrentSlideId();
});

$('.slider-to-right').click(function() {
	toRight();
	return false;
});

$('.slider-to-left').click(function() {
	toLeft();
	return false;
});

/*
 * Functions
 */

function toRight(isfotorama) {
	if (!sliderOn() && !textBlockOn()) {
		textDown();
		changeText('right');
		setTimeout(function(){
			addSlideBlock('right');
			textSlide('right');
			textToTop('right');
		},$text_top_speed);
	}
	if(typeof(fotorama) != "undefined" && fotorama !== null) {
		fotorama.show('>');
	}
}

function toLeft(isfotorama) {
	if (!sliderOn() && !textBlockOn()) {
		addSlideBlock('left');
		textSlide('left');
		changeText('left');
		setTimeout(function(){
			textToTop('left');
		}, $tblock_speed);
	}
	if(typeof(fotorama) != "undefined" && fotorama !== null) {
		fotorama.show('<');
	}
}

function navToSlider(link) {
	var to = $(link).attr('data-link');
	var active = $('a.active').attr('data-link');
	if(to<active)
	{
		toLeft(true);
	} else 
	if (to>active) {
		toRight(true);
	}
}

function changeText(direct) {
	if(direct == 'right') {
		this.textid = $($text_block+":eq(2)").attr('data-text-id');
	}
	if(direct == 'left') {
		this.textid = $($text_block+":eq(1)").attr('data-text-id');
	}
	if($('.active-text')[0])
	{
		$('.active-text').animate({top:$('.slide-texts').height()},500,function(){
			$('.active-text').css('display','none').removeClass('active-text');
			$('.slide-left-text[data-lid=' + textid + ']').addClass('active-text');
			getLeftWidth();
			$('.slide-left-text[data-lid=' + textid + ']').css('display','inline-block').animate({top: -10},300,function(){
				$('.slide-left-text[data-lid=' + textid + ']').animate({top:0}, 100);
			});
		});
	} else {
		$('.active-text').css('display','none').removeClass('active-text');
		$('.slide-left-text[data-lid=' + textid + ']').addClass('active-text');
		getLeftWidth();
		$('.slide-left-text[data-lid=' + textid + ']').css('display','inline-block').animate({top: -10},300,function(){
			$('.slide-left-text[data-lid=' + textid + ']').animate({top:0}, 100);
		});
	}
	
}

function getLeftWidth() {
	$('.slide-left-line').animate({ width: $('.active-text').width() }, $left_anim_speed);
}

// Right text block to top
function textToTop(direct) {
	if(direct == 'right') {
		this.text_id = parseInt($($text_block).last().attr('data-text-id'));
		if(text_id == $text_blocks)
		{
			text_id = 0;
		}
		$($text_block + "[data-text-id=" + text_id + "]").css('top', -$text_to_top).addClass('text-top');
	}
	if(direct == 'left') {
		this.text_id = parseInt($($text_block).last().attr('data-text-id'))-1;
		if(text_id == -1)
		{
			text_id = $text_blocks-1;
		}
		$($text_block + "[data-text-id=" + text_id + "]").animate({top: -$text_to_top}, $text_top_speed).addClass('text-top');
	}
}

function textDown() {
	$('.text-top').first().animate({ top: 0 }, $text_top_speed);
	$('.text-top').first().removeClass('text-top');
}

//Adding new block before slide
function addSlideBlock(direct) {
	this.block_width 		= $($text_block).first().width();
	this.before_last_block 	= $($text_block).last().attr('data-text-id');
	this.before_first_block = $($text_block).first().attr('data-text-id');
	
	if(parseInt(before_last_block)+1<$text_blocks)
	{
		this.lastId = parseInt(before_last_block)+1;
	} else {
		this.lastId = 0;
	}
	
	if(parseInt(before_last_block)==5)
	{
		this.firstId = $text_blocks-1;
	} else {
		this.firstId = parseInt(before_first_block)-1;
	}
	
	if(direct == 'right') {
		$($text_block).last().after(getBlockOfId(lastId));
		$($text_block).last().css({ 'width': $step });
		$($text_block).first().remove();
		$($slider_text).css('left',0);
	}
	if(direct == 'left') {
		$($text_block).first().before(getBlockOfId(firstId));
		$($text_block).first().css({ 'width': $step });
		$($text_block).last().remove();
		$($slider_text).css('left', -2*$step);
	}
}

function setNewBlocks() {
	$('.slider-text-blocks').css('display','none');
	this.i = 0;
	this.blocks = '';
	blocks += getBlockOfId($text_blocks-1);
	for(this.i; i < 4; i++) {
		blocks += getBlockOfId(i);
	}
	blocks += getBlockOfId(4);
	this.block_str = '<div class="slider-text"><div class="slider-in">' + blocks + '</div></div>'; 
	$('.slider-text-blocks').after(block_str);
	$($slider_text).css({ 'left': -$($text_block).width() , 'width': $step*6+40 });
	$($text_block).css({ 'width': $step });
	$($text_block).last().css('top', -$text_to_top).addClass('text-top');
	$($text_block + "[data-text-id=3]").css('top', -$text_to_top).addClass('text-top');
}

//geting block of id
function getBlockOfId(id) {
	return '<div class="slider-under-block" data-text-id=' + id + '>' + $('.slider-under-block[data-text=' + id + ']').html() + '</div>';
}

//Fly to first image of category
function goToCategory(link) {
	this.datalink = $(link).attr('data-to');
	switch (datalink) {
		case 'product':
			fotorama.show($product_min);
			break;
		case 'video':
			fotorama.show($video_first);
			break;
		case 'image':
			fotorama.show($image_first);
			break;
	}
}

//Text slide function
function textSlide(direction) {
	this.width = $('.slider-text .slider-under-block').width();
	switch (direction) {
		case 'left':
			this.text_width = $step;
			break;
		case 'right':
			this.text_width = $step*(-1);
			break;
	}
	if (!sliderOn()) {
			$($slider_text).animate({ left: parseInt($('.slider-text').css('left')) + text_width }, $tblock_speed);
	}
}

//Number of current slide
function getCurrentSlideId() {
	$('.current-slide').html(fotorama.activeIndex+1);
}

//Amount of all slides
function getImagesCount() {
	$('.all-slides').html($images_all+1);
}

//Set active categories link
function setActiveLink(id) {
	this.idclass = $classes[id];
	$('.slider-nav a').removeClass('active');
	$('.slider-nav a[data-to=' + idclass + ']').addClass('active');
}

//if slider of text blocks is animated
function sliderOn() {
	if ($($slider_text).is(':animated')) {
		return true;
	} else {
		return false;
	}
}

function textBlockOn() {
	if ($('.slider-under-block').is(':animated')) {
		return true;
	} else {
		return false;
	}
}

function animateNav() {
	var $leftElems = $('.main-header .left_dir');
	var $rightElems = $('.main-header .right_dir');
	
	timeOutFade($leftElems, 0, 400);
	timeOutFade($rightElems, 0, 300);
}
function animateOnLoad() {			
	/*Анимация происходит при помощи transition*/		
	var $leftElems = $('.product-description .left_dir').not('.bottom-group').not('.top-group');
	var $rightelems = $('.product-description .right_dir');
	var $fadeElems = $('.product-description .w_fade');	
	var $columnLeft = $('.product-description .bottom-group');
						
	//$elems.css({ '-moz-transform': 'translate(0px, 0px)', '-o-transform': 'translate(0px, 0px)', '-webkit-transform': 'translate3d(0px, 0px, 0px)', '-ms-transform': 'translate(0px, 0px)', 'transform': 'translate(0px, 0px)'}); 
	timeOutFade($leftElems, 0, 400);
	timeOutFade($rightelems, 0, 300);
	timeOutFade($columnLeft, 0, 200);
}

function animateOnLoadTwo() {
	timeOutFade($('.bottom_dir'), 0, 400);
	timeOutFade($('.top-group'), 0, 400);
}

function gx_show() {
	$('.anim-left-black-line').animate({width: $('.anim-from-bottom').width()}, 300, function(){
		$('.anim-from-bottom').animate({top: -10},300,function(){
			$('.anim-from-bottom').animate({top:0}, 150);
		});
	});
}

function mega_show() {
	$('.right-black-line').animate({width:$('.pxl-size-span').width()}, 500, function(){
		$('.mega-anim').css({ 'top': 0 });
	});
}
function animStart() {
	/*Вызываем функцию анимации элементтов*/
	if(isScrolled('.product-description') && $scrollanim) {
		gx_show();
		animateOnLoadTwo();
		$scrollanim = false;
	}
}

function animStart2() {
	/*Вызываем функцию анимации элементтов*/
	if(isScrolled('.bottom-group') && $scrollanim2) {
		mega_show();
		animateOnLoad();
		$scrollanim2 = false;
	}
}

function isScrolled(elem)
{
    var $topp = $(elem).position().top;
    var $bottomp = $topp + $(elem).height();
    var $windowh = $(window).height();
    var $amountw = $windowh*0.2;
    if($(document).scrollTop() > $topp-$windowh+$amountw && $(document).scrollTop() < $bottomp ) {
    	return true;
    } else {
    	return false;
    }
}


var $scrollanim = true;
var $scrollanim2 = true;

$(document).scroll(function(){
	animStart();
	animStart2();
});

$(function(){
	animStart();
	animStart2();
});