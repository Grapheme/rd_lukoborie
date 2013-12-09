// ----------------------------------------------------------------------------
// Функция анимации элементов
// ----------------------------------------------------------------------------
	
function timeOutFade($elems, timer, step) {
	if($elems[0]) {		
		$elems.each( function(){
			var that = $(this);
			setTimeout( function(){
				that.css({ 'opacity': '1', '-moz-transform': 'translate(0px, 0px)', '-o-transform': 'translate(0px, 0px)', '-webkit-transform': 'translate3d(0px, 0px, 0px)', '-ms-transform': 'translate(0px, 0px)', 'transform': 'translate(0px, 0px)'}); 
			}, timer);	
			timer += step;
		});			
	}
}

$('.rules-link').click(function(){
	$('.rules').slideToggle('fast');
	return false;
});

$('.rules-close').click(function(){
	$('.rules').slideToggle('fast');
	return false;
});

$('.rules-link-bottom').click(function(){
	$('.rules').slideDown('fast');
	$("html, body").animate({scrollTop: $('.rules').position().top});
	return false;
});

$(function()
{
	$('.scroll-simple').scrollbar();
});
