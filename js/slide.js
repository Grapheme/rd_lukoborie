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

var $text_to_top	= 133; 	// px

/*
 * each
 */

// Counting numbers of slides
$('.fotos a').each(function(){
	$counts[$countClasses] = $countClasses;
	$classes[$countClasses] = $(this).attr('class');
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

/*
 * Document ready
 */

$(function(){
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

function toRight() {
	if (!sliderOn() && !textBlockOn()) {
		textDown();
		setTimeout(function(){
			addSlideBlock('right');
			textSlide('right');
			textToTop('right');
			changeText('right');
		},$text_top_speed);
	}
	fotorama.show('>');
}

function toLeft() {
	if (!sliderOn() && !textBlockOn()) {
		addSlideBlock('left');
		textSlide('left');
		changeText('left');
		setTimeout(function(){
			textToTop('left');
		}, $tblock_speed);
	}
	fotorama.show('<');
}

function changeText(direct) {
	if(direct == 'right') {
		this.textid = $($text_block+":eq(1)").attr('data-text-id');
	}
	if(direct == 'left') {
		this.textid = $($text_block+":eq(1)").attr('data-text-id');
	}
	if($('.active-text')[0])
	{
		$('.active-text').animate({top:$('.slide-texts').height()},500,function(){
			$('.active-text').css('display','none').removeClass('active-text');
			$('.slide-left-text[data-lid=' + textid + ']').css('display','inline-block').animate({top: -10},$left_anim_speed,function(){
				$('.slide-left-text[data-lid=' + textid + ']').animate({top:0}, {duration: $left_anim_speed, easing: 'easeOutBounce'}, 100);
				getLeftWidth();
			}).addClass('active-text');
		});
	} else {
		$('.active-text').css('display','none').removeClass('active-text');
		$('.slide-left-text[data-lid=' + textid + ']').css('display','inline-block').animate({top: -10},300,function(){
			$('.slide-left-text[data-lid=' + textid + ']').animate({top:0}, {duration: $left_anim_speed, easing: 'easeOutBounce'}, 100);
			getLeftWidth();
		}).addClass('active-text');
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
			fotorama.show($video_min+1);
			break;
		case 'image':
			fotorama.show($image_min+1);
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