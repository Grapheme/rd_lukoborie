$('.sect-form .line-submit').click( function() {
		//TODO: дописать submit
		$(this).parent().hide();
		$('.sect-form-header').text('Спасибо за подписку');
	});
	$('#sect-form').submit( function() {
		$(this).hide();
		$('.sect-form-header').text('Проверьте электронную почту и покупайте Lumix GX7 со скидкой');		
		return false;
	});
	$(document).on('click', '.camera .line-submit', function(e) {
		var prevHeight = $(this).parent().parent().height();
		$(this).parent().parent().find('.dc-form-capt').html('Проверьте email и покупайте Lumix GX7 со скидкой <a href="http://panasoniceplaza.ru/products/digital_av/digital_still_camera/lumix/DMC-GX7K/?utm_source=lookatme&utm_medium=promosite&utm_campaign=lumixgx7" class="buy-btn">Купить</a>');
		$(this).parent().hide();
		$(this).parent().parent().height(prevHeight);
	});
	$(document).on('submit', '.discount-form', function(e) {
		e.preventDefault();
		var prevHeight = $(this).parent().height();
		$(this).parent().find('.dc-form-capt').html('Проверьте email и покупайте Lumix GX7 со скидкой <a href="http://panasoniceplaza.ru/products/digital_av/digital_still_camera/lumix/DMC-GX7K/?utm_source=lookatme&utm_medium=promosite&utm_campaign=lumixgx7" class="buy-btn">Купить</a>');
		$(this).hide();
		$(this).parent().height(prevHeight);
	});