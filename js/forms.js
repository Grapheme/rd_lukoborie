$('.sect-form .line-submit').click( function() {
		//TODO: дописать submit
		$(this).parent().hide();
		$('.sect-form-header').text('Проверь электронную почту и покупай Lumix GX7 со скидкой');
	});
	$('#sect-form').submit( function() {
		$(this).hide();
		$('.sect-form-header').text('Проверь электронную почту и покупай Lumix GX7 со скидкой');		
		return false;
	});
	$(document).on('click', '.camera .line-submit', function(e) {
		var prevHeight = $(this).parent().parent().height();
		$(this).parent().parent().find('.dc-form-capt').html('Проверьте e-mail и покупай Lumix GX7 со скидкой <a href="http://panasoniceplaza.ru/products/digital_av/digital_still_camera/lumix/DMC-GX7K/" class="buy-btn">Купить</a>');
		$(this).parent().hide();
		$(this).parent().parent().height(prevHeight);
	});
	$(document).on('submit', '.discount-form', function(e) {
		var prevHeight = $(this).parent().height();
		$(this).parent().find('.dc-form-capt').html('Проверьте e-mail и покупай Lumix GX7 со скидкой <a href="http://panasoniceplaza.ru/products/digital_av/digital_still_camera/lumix/DMC-GX7K/" class="buy-btn">Купить</a>');
		$(this).hide();
		$(this).parent().height(prevHeight);
	});