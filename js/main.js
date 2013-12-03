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

	var photographTemplate = Handlebars.compile( 
		$("#gallery-photograph-template").html() );
	

	// ----------------------------------------------------------------------------
	// Интерфейсная часть : фильтры
	// ----------------------------------------------------------------------------
	var $fDateFilter = $('.f-date .date-table');
	var $fSalonFilter = $('.f-salon .shop-list');
	
	function hideVisibleFilter() {		
		if( $('.active-filter')[0] ) { $('.active-filter').removeClass('active-filter').slideToggle(100); };
	};	
	
	$('body').click( function(){
		hideVisibleFilter();
	});
	$('.f-date').click( function( event ){
		event.stopPropagation();		
		if ($(this).find('.date-table').hasClass('active-filter')) {
			$(this).find('.date-table').addClass('active-filter').slideToggle(100).removeClass('active-filter');
		} else {
			hideVisibleFilter();
			$(this).find('.date-table').addClass('active-filter').slideToggle(100);
		}		
	});
	$('.f-salon').click( function( event ){
		event.stopPropagation();
		if ($(this).find('.chop-list').hasClass('active-filter')) {
			$(this).find('.chop-list').addClass('active-filter').slideToggle(100).removeClass('active-filter');
		} else {
			hideVisibleFilter();
			$(this).find('.chop-list').addClass('active-filter').slideToggle(100);
		}
	});

	$('.chop-place').click( function(){
		var parentBlock = $('.f-salon');
		var resetCross = parentBlock.find('.cross');
		var selectedValue = parentBlock.find('.chosen-value');
		
		var placeName = $(this).find('.chop-name').text();
		selectedValue.text(placeName);
		resetCross.show();
	});

	$('.date-trigger').click( function(){
		var parentBlock = $('.f-date');
		var resetCross = parentBlock.find('.cross');
		var selectedValue = parentBlock.find('.chosen-value');
		
		var placeName = $(this).text() + ' декабря';
		selectedValue.text(placeName);
		resetCross.show();
	});

	$('.f-salon .cross').click( function(e) {
		e.stopPropagation();
		var parentBlock = $('.f-salon');
		var defaultSelectedValue = 'Все салоны';
		var selectedValue = parentBlock.find('.chosen-value');
		selectedValue.text(defaultSelectedValue);
		$(this).hide();
	});

	$('.f-date .cross').click( function(e) {
		e.stopPropagation();
		var parentBlock = $('.f-date');
		var defaultSelectedValue = 'Любая';
		var selectedValue = parentBlock.find('.chosen-value');
		selectedValue.text(defaultSelectedValue);
		$(this).hide();
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

		parent.find(".fancybox").html(
			makeLookModalView(model)[0]
		);

		parent.data("model", model);

		// Обработчик клика на лук
		parent.on("click", ".normal-state", function(event) {
			event.stopPropagation();

			router.navigate( model.id, { trigger : true });
		});


		// Обработчик клика на кнопку "лайк"
		parent.on("click", ".normal-state .likes-thumb",  
		function(event) {
			event.stopPropagation();

			changeState(parent, "vote-state");
		});

		// Обработчик клика на одну из социальных кнопок
		parent.on("click", ".vote-state .social-button",  
		function(event) {
			event.stopPropagation();

			// Увеличиваем количество лайков
			// TODO: анимация перехода
			parent.find(".likes-count").text(model.likes + 1);
			parent.find(".likes-container").text(model.likes + 1);

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

		parent.on("click", ".normal-state .likes-thumb", 
			function(event) {

			event.stopPropagation();
			changeState(parent, "vote-state");
		});
		
		parent.on("click", ".email-state .ok-button",  
		function(event) {
			event.stopPropagation();

			changeState(parent, "thank-email-state");
		});
		
		// Обработчик клика на одну из социальных кнопок
		parent.on("click", ".vote-state .social-button", 
			function(event) {
			
			event.stopPropagation();
			var model = parent.data("model");

			// Увеличиваем количество лайков
			// TODO: анимация перехода
			parent.find(".likes-count").text(model.likes + 1);
			parent.find(".likes-container").text(model.likes + 1);

			changeState(parent, "email-state");			
		});

		// Обработчик на нажатие крестика
		parent.on("click", ".state-cross",  
			function(event) {

			event.stopPropagation();

			//router.navigate("");
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
	scrollHandler();
	infinite._scrollPage();

	// Некрасивый быстрофикс :(
	$("body").on("click", ".slider-to-left", 
    	function(event) {
    		event.stopPropagation();
    		$.fancybox.prev();
    });

    $("body").on("click", ".slider-to-right", 
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

				// TODO: фотоаппарат?!
			}

			var elements = $( elems );

			elements.imagesLoaded(function() {
				// Добавляем элемент в masonry
				galleryList.append( elements );	

				$(".fancybox").fancybox({
					minWidth : 450,
					padding: [40, 20, 15, 20],
					closeBtn : true, 
					arrows : false,
					afterLoad : function() {
						
						var model = 
							this.content.find(".gallery-item").data("model");

    					this.title = fancyboxTitleTemplate({
							current : this.index + 1,
							total : this.group.length,
							model : model
    					});
					},
					helpers  : {
					   title : { type : 'inside' },
					   buttons : {},
					   overlay : {
					      css : {
					      	 'background' : 'transparent' 				
					      }		
					   }					   
					}					
				});

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
			":id" : "showModal"
		},

		showModal : function(id) {
			var model = generateRandomItem();
			var view = makeLookModalView( model );

			var title = fancyboxTitleTemplate( {
				current : 1, 
				total : 1,
				model : model
			});

			$.fancybox.open( view, {
				minWidth : 450,
				padding: [40, 20, 15, 20],
				closeBtn : true, 
				arrows : false,
				title : title,
				helpers  : {
				   title : { type : 'inside' },
				   buttons : {},
				   overlay : { css : { 'background' : 'transparent' } }
				}					
			});

		}
	});

	window.router = new Router;
	Backbone.history.start();
});
