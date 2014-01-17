$(function() {	
	// Вызываем функцию анимации элементов
	animateOnLoad();
	function animateOnLoad() {			
		/* Анимация происходит при помощи transition */		
		var $leftElems = $('.left_dir');
		var $rightelems = $('.right_dir');					
		
		timeOutFade($leftElems, 0, 400);
		timeOutFade($rightelems, 0, 300);
	};
});