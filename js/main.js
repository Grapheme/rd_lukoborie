$(function() {
	
	// Вызываем функцию анимации элементов
	animateOnLoad();
	function animateOnLoad() {			
		/* Анимация происходит при помощи transition */		
		var $leftElems = $('.left_dir');
		var $rightelems = $('.right_dir');					
		
		timeOutFade($leftElems, 0, 400);
		timeOutFade($rightelems, 0, 300);
	}

	
	// ----------------------------------------------------------------------------
	// Настройки
	// ----------------------------------------------------------------------------
	var options = {
		changeStateDuration : 400,

		// Расстояние в пикскелях от конца страницы, когда срабыватыет 
		// подгрузка новых элементов 
		scrollToggleHeight : 200
	};


	// ----------------------------------------------------------------------------
	// Шаблоны
	// ----------------------------------------------------------------------------
	var fancyboxTemplate = Handlebars.compile( 
		$("#fancybox-template").html() );

	var fancyboxTitleTemplate = Handlebars.compile( 
		$("#fancybox-title-template").html() );

	var itemTemplate = Handlebars.compile( 
		$("#gallery-item-template").html() );

	var cameraTemplate = Handlebars.compile( 
		$("#gallery-camera-template").html() );

	var photographTemplate = Handlebars.compile( 
		$("#gallery-photograph-template").html() );
	

	// ----------------------------------------------------------------------------
	// Интерфейсная часть : фильтры
	// ----------------------------------------------------------------------------
	var $fDateFilter = $('.f-date .date-table');
	var $fSalonFilter = $('.f-salon .shop-list');
	
	function hideVisibleFilter() {		
		if( $('.active-filter')[0] ) 
		{
			$('.active-filter').removeClass('active-filter').slideToggle(100);
		};
	};
	
	$(document).click(function(){
		$('.f-date').find('.filter-container').removeClass('filter-gray');
		$('.f-salon').find('.filter-container').removeClass('filter-gray');
	});	
	
	$('body').click( function(){
		hideVisibleFilter();
	});
	$('.f-date').click( function( event ){
		$(this).find('.filter-container').addClass('filter-gray');
		event.stopPropagation();		
		if ($(this).find('.date-table').hasClass('active-filter')) {
			$(this).find('.filter-container').removeClass('filter-gray');
			$(this).find('.date-table').addClass('active-filter').slideToggle(100).removeClass('active-filter');
		} else {
			hideVisibleFilter();
			$(this).find('.date-table').addClass('active-filter').slideToggle(100);
		}
		$('.f-salon').find('.filter-container').removeClass('filter-gray');		
	});
	$('.f-salon').click( function( event ){
		$(this).find('.filter-container').addClass('filter-gray');
		event.stopPropagation();
		if ($(this).find('.chop-list').hasClass('active-filter')) {
			$(this).find('.chop-list').addClass('active-filter').slideToggle(100).removeClass('active-filter');
			$(this).find('.filter-container').removeClass('filter-gray');
		} else {
			hideVisibleFilter();
			$(this).find('.chop-list').addClass('active-filter').slideToggle(100);
		}
		$('.f-date').find('.filter-container').removeClass('filter-gray');
	});

	$('.chop-place').click( function(){
		var parentBlock = $('.f-salon');
		var resetCross = parentBlock.find('.cross');
		var selectedValue = parentBlock.find('.chosen-value');		
		var placeName = $(this).find('.chop-name').text();
		if($('.active-salon')[0]) $('.active-salon').removeClass('active-salon');
		
		selectedValue.text(placeName);
		resetCross.show();
		$(this).addClass('active-salon');
	});

	$('.date-trigger').click( function(){
		var parentBlock = $('.f-date');
		var resetCross = parentBlock.find('.cross');
		var selectedValue = parentBlock.find('.chosen-value');
		$('.data-active').removeClass('data-active');
		$(this).addClass('data-active');
		
		var placeName = $(this).text() + ' декабря';
		selectedValue.text(placeName);
		resetCross.show();
	});

	$('.f-salon .cross').click( function(e) {
		e.stopPropagation();
		var parentBlock = $('.f-salon');
		var defaultSelectedValue = 'Все салоны';
		var selectedValue = parentBlock.find('.chosen-value');
		$('.active-salon').removeClass('active-salon');
		selectedValue.text(defaultSelectedValue);
		$(this).hide();
	});

	$('.f-date .cross').click( function(e) {
		e.stopPropagation();
		var parentBlock = $('.f-date');
		var defaultSelectedValue = 'Любая';
		var selectedValue = parentBlock.find('.chosen-value');
		$('.data-active').removeClass('data-active');
		selectedValue.text(defaultSelectedValue);
		$(this).hide();
	});

	// ----------------------------------------------------------------------------
	// Интерфейсная часть : формы
	// ----------------------------------------------------------------------------
	$('.sect-form .line-submit').click( function() {
		//TODO: дописать submit
		$(this).parent().hide();
		$('.sect-form-header').text('Спасибо за подписку');
	});
	$('#sect-form').submit( function() {
		$(this).hide();
		$('.sect-form-header').text('Спасибо за подписку');		
		return false;
	});
	$(document).on('click', '.camera .line-submit', function(e) {
		var prevHeight = $(this).parent().parent().height();
		$(this).parent().parent().find('.dc-form-capt').text('Проверь e-mail и покупай Lumix GX7 со скидкой');
		$(this).parent().hide();
		$(this).parent().parent().height(prevHeight);
	});
	$(document).on('submit', '.discount-form', function(e) {
		var prevHeight = $(this).parent().height();
		$(this).parent().find('.dc-form-capt').text('Проверь e-mail и покупай Lumix GX7 со скидкой');
		$(this).hide();
		$(this).parent().height(prevHeight);
	});
	// ----------------------------------------------------------------------------
	// Интерфейсная часть : элементы галереи
	// ----------------------------------------------------------------------------
	
	// Меняет состояние элемента лука
	function changeState(parent, state) {
		// Показываем заданное состояние, скрываем остальные
		parent.find(".state." + state).fadeIn( options.changeStateDuration );
		parent.find(".state:not(." + state + ")").hide();
	}


	// ----------------------------------------------------------------------------
	// Отображение лука в галереи
	// ----------------------------------------------------------------------------
	function makeLookGalleryView( model ) {
		var parent = $("<li>").addClass("gallery-item");
		parent.html( itemTemplate( model ));

		parent.data("model", model);

		// Обработчик клика на лук
		parent.on("click", ".vote-state", function(event) {
			event.stopPropagation();

			router.navigate( model.id, { trigger : true });
		});

		var triggered = false;

		// Обработчик клика на кнопку "лайк"
		parent.on("mouseenter", ".normal-state",  
		function(event) {
			event.stopPropagation();
			
			if(!triggered)
			changeState(parent, "vote-state");
		});
		parent.on("mouseleave", "",  
		function(event) {
			
			event.stopPropagation();
			
			if(!triggered)
			changeState(parent, "normal-state");
		});

		// Обработчик клика на одну из социальных кнопок
		parent.on("click", ".vote-state .social-button",  
		function(event) {
			triggered = true;
			
			event.stopPropagation();
			
            changeState(parent, "email-state");			
		});

		// Обработчик на нажатие кнопки при указании email
		parent.on("click", ".email-state .ok-button",  
		function(event) {
			event.stopPropagation();

			changeState(parent, "thank-email-state");
		});

		// Обработчик на нажатие крестика
		parent.on("click", ".state-cross",  function(event) {
			event.stopPropagation();
			triggered = false;
			changeState(parent, "normal-state");
		});
		return parent;
	}


	// ----------------------------------------------------------------------------
	// Отображение лука в модальном окне
	// ----------------------------------------------------------------------------
	function makeLookModalView( model ) {

		var parent = $("<div>")
			.addClass("gallery-item fancybox")
			.html( fancyboxTemplate(model) );

		parent.data("model", model);

		parent.on("click", ".normal-state .social-button", 
			function(event) {

			event.stopPropagation();
			changeState(parent, "email-state");
		});
		
		parent.on("click", ".email-state .ok-button",  
		function(event) {
			event.stopPropagation();

			changeState(parent, "thank-email-state");
		});

		return parent;
	}


	// ----------------------------------------------------------------------------
	// Отображение фотографа в галереи
	// ----------------------------------------------------------------------------
	function makePhotographGalleryView(model) {
		var parent = $("<li>").addClass("gallery-item");
		parent.html( photographTemplate( model ));

		return parent;
	}


	// ----------------------------------------------------------------------------
	// Отображение камеры в галереи
	// ----------------------------------------------------------------------------
	function makeCameraGalleryView(model) {
		var parent = $("<li>").addClass("gallery-item");
		parent.html( cameraTemplate( model ));

		return parent;
	}


// ----------------------------------------------------------------------------
// Функция имитирует подргузку данных с лицами с сервера
// ----------------------------------------------------------------------------

function randomRange(a, b) {
	return Math.floor((Math.random() * (b-a))) + a;
}
function generateRandomItem() {
	// Генерируем произвольную картинку
	var num = randomRange(1, 19);
	var numStr = (num < 10) ? "0" + num.toString() : num.toString();

	return 	{
		id     : randomRange(1, 10000).toString(),
		type   : "look",
		avatar : "img/gallery_example/Gallery_" + numStr + ".jpg",
		likes  :  Math.floor(Math.random() * 30),
		photograph : {
			name : "Авдотий Переверзиев",
			avatar : "img/avatars/avd.jpg"
		}
	}
}
function fetchGalleryItems() {
	var itemsCount = 40;
	var items = [];

	var defer = new $.Deferred();

	for(var i = 0; i < itemsCount; ++i) {
	
		items.push( generateRandomItem() );

		// Переодически разбавляем ленту фотографом
		if(i % 7 === 0) {	
			items.push({
				type : "photograph",
				name :  "Авдотий Переверзиев",
				desc : "Lumix GX7 -\n потрясающий \n фотоаппарат.\n А этот конкурс \n стал для меня \n венцом \nкарьеры.",
				avatar : "img/avatars/avd.jpg",
			});
		}

		if( i % 13 === 0) {
			items.push({
				type : "camera",
				name :  "Авдотий Переверзиев",
				desc : "Lumix GX7 -\n потрясающий \n фотоаппарат.\n А этот конкурс \n стал для меня \n венцом \nкарьеры.",
				avatar : "img/avatars/avd.jpg",
			});
		}
	} 

	setTimeout(function() {
		defer.resolve(items);
	}, randomRange(500, 600));

	return defer.promise();
};

// ----------------------------------------------------------------------------
// Бесконечный скролл
// ----------------------------------------------------------------------------
	// При загрузке странице всегда скрол вверху
	$(window).load(function() {
		window.scrollTo(0,0);
	});

	var galleryList = $(".gallery-list");
	
	// Укладка элементов галереи в 4 колонки
	var masonry = new Masonry( 
	galleryList[0], {
		itemSelector: "li",
		columnWidth: galleryList.width() / 4,
		transitionDuration : 0
	});

	// Делает видимыми элементы по мере скрола
	var infinite = new InfiniteScroll(
	galleryList[0], {
		minDuration 	: 0.1,
		maxDuration 	: 0.6,
		viewportFactor 	: 0,
		itemSelector 	: "li"
	});	

	// Если дошли до конца, подгружаем новые элементы, которые изначально скрыты
	var busy = false;
	function scrollHandler() {
	   if($(window).scrollTop() + $(window).height() > 
	   		$(document).height() - options.scrollToggleHeight ) {

	   	// Флаг загрузки, TODO: сделать умнее!
	   	if(!busy) {
	   	  busy = true;
	      loadItems()
			.done(function() {
				busy = false;
				infinite.toggle();
			});
	   	}
	   }
	};

	$(window).scroll(scrollHandler);

	// Первую пачку из галереи подгружаем насильно
	loadItems()
	.done(function() {
		galleryList.find("li").addClass("animate");
	});

	// Некрасивый быстрофикс :(
	$("body").on("click", ".fancy-to-left", 
    	function(event) {
    		event.stopPropagation();
    		$.fancybox.prev();
    });

    $("body").on("click", ".fancy-to-right", 
    	function(event) {
    		event.stopPropagation();
    		$.fancybox.next();
    });

// ----------------------------------------------------------------------------
// Подгрузка новых элементов, рендеринг и добавление в DOM
// ----------------------------------------------------------------------------
	function loadItems() {
		var defer = new $.Deferred();

		fetchGalleryItems()
		.done(function(items) {
			var elems = [];

			for(var i = 0; i < items.length; ++i) {
				var renderedElement = null; 
				var model = items[i];

				// Элемент галереи Лук
				if(model.type === "look") {

					elems.push( makeLookGalleryView(model)[0] );
				}

				// Элемент галереи Фотограф
				if(model.type === "photograph") {
					elems.push( makePhotographGalleryView(model)[0] );
				}

				// Элемент галереи Камера
				if(model.type === "camera" ) {
					elems.push( makeCameraGalleryView(model) [0]); 
				}
			}

			var elements = $( elems );

			elements.imagesLoaded(function() {
				// Добавляем элемент в masonry
				galleryList.append( elements );	

				masonry.appended( elements );
				defer.resolve();
			});
		});

		return defer.promise();
	};
	


	// ----------------------------------------------------------------------------
	// Роутинг на стороне клиента
	// Используем роутер из библитеки Backbone
	// ----------------------------------------------------------------------------
	window.Router = Backbone.Router.extend({
		routes: {
			"!" : "index",
			":id" : "showModal"
		},

		index : function() {},

		showModal : function(id) {
			var model = generateRandomItem();
			var view = makeLookModalView( model );

			var title = fancyboxTitleTemplate( {
				current : 1, 
				total : 1,
				model : model
			});

			$.fancybox.open( view, {
				afterClose : function() {
					router.navigate("!");
				},
				minWidth : 450,
				minHeight : 599,
				padding: [40, 20, 15, 20],
				closeBtn : true, 
				arrows : false,
				title : title,
				helpers  : {
				   title : { type : 'inside' },
				   buttons : {},
				   overlay : { 
				   	  css : { 'background' : 'transparent' }
				   }
				}					
			});

		}
	});

	window.router = new Router;
	Backbone.history.start();
});
