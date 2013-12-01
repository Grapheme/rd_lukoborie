/*
 * Vars
 */

var $countClasses 	= 0;
var $classes 		= [];
var $counts 		= [];
var $text_blocks 	= 0; 	//last block id
var $product_min 	= 0;	//product first id
var $video_min;				//video first id
var $image_min;				//image first id
var $images_all;			//amount of all slides
var $step			= $('.wrapper').width()/4;

/*
 * each
 */

//Counting numbers of slides
$('.fotos img').each(function(){
	$counts[$countClasses] = $countClasses;
	$classes[$countClasses] = $(this).attr('class');
	$countClasses++;
});

$('.slider-under-block').each(function(){
	$(this).attr('data-text',$text_blocks);
	$text_blocks++;
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
	addSlideBlock('right');
	textSlide('right');
	fotorama.show('>');
	return false;
});

$('.slider-to-left').click(function() {
	addSlideBlock('left');
	textSlide('left');
	fotorama.show('<');
	return false;
});

/*
 * Functions
 */

//Adding new block before slide
function addSlideBlock(direct) {
	this.block_width = $('.slider-text .slider-under-block').first().width();
	this.before_first_block = $('.slider-text .slider-under-block').first().attr('data-text-id');
	this.before_last_block = $('.slider-text .slider-under-block').last().attr('data-text-id');
	
	if(direct == 'right') {
		$('.slider-text .slider-under-block').last().after(getBlockOfId(parseInt(before_last_block)+1));
		$('.slider-text .slider-under-block').last().css({ 'width': $step });
		$('.slider-text .slider-under-block').first().remove();
		$('.slider-text').css('left',0);
	}
	if(direct == 'left') {
		$('.slider-text .slider-under-block').first().before(getBlockOfId(parseInt(before_first_block)-1));
		$('.slider-text .slider-under-block').first().css({ 'width': $step });
		$('.slider-text .slider-under-block').last().remove();
		$('.slider-text').css('left', -2*$step);
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
	this.block_str = '<div class="slider-text">' + blocks + '</div>'; 
	$('.slider-text .slider-under-block').last().addClass('right-block');
	$('.slider-text-blocks').after(block_str);
	$('.slider-text').css({ 'left': -$('.slider-text .slider-under-block').width() , 'width': $('.slider-text .slider-under-block').width()*6 });
	$('.slider-text .slider-under-block').css({ 'width': $('.slider-text').width()/6 });
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
			fotorama.show($video_min);
			break;
		case 'image':
			fotorama.show($image_min);
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
	if (!$('.slider-text').is(':animated')) {
			//$(this).animate({ left: parseInt($(this).css('left')) + text_width }, 1000);
			$('.slider-text').animate({ left: parseInt($('.slider-text').css('left')) + text_width });
		//setTimeout(function(){addSlideBlock();},1000);
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