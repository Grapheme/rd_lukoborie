$(document).ready( function(){
	$('.gallery-item .likes-thumb').click( function(){
		$(this).parent().parent().find('.overlay').css({ display: 'block', opacity: 1 });
	});
});
