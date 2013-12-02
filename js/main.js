
$(function() {
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

	var itemTemplate = Handlebars.compile( 
		$("#gallery-item-template").html() );

	var photographTemplate = Handlebars.compile( 
		$("#gallery-photograph-template").html() );
	

	// ----------------------------------------------------------------------------
	// Интерфейсная часть : фильтры
	// ----------------------------------------------------------------------------

	$('.f-date').click( function(){
		$(this).find('.date-table').slideToggle(400);
	});

	$('.f-salon').click( function(){
		$(this).find('.chop-list').slideToggle(400);
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

		parent.data("model", model);

		// Обработчик клика на лук
		parent.on("click", ".normal-state", function(event) {
			event.stopPropagation();

			var fancyboxContent = makeLookModalView(model);

			var a = $("<a>").fancybox({
				content : fancyboxContent
			});

			a.click();
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


			setTimeout(function() {
				changeState(parent, "thank-vote-state");	

				setTimeout(function() {	
					changeState(parent, "email-state");
				}, 2000);
			}, 1000);
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
			.addClass("gallery-item")
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


			setTimeout(function() {
				changeState(parent, "thank-vote-state");

				setTimeout(function() {	
					changeState(parent, "email-state");
				}, 2000);
			}, 1000);
		});

		// Обработчик на нажатие крестика
		parent.on("click", ".state-cross",  
			function(event) {

			event.stopPropagation();

			// TODO: закрывать fancybox
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
function fetchGalleryItems() {

	function randomRange(a, b) {
		return Math.floor((Math.random() * (b-a))) + a;
	}

	var itemsCount = 40;
	var items = [];

	var defer = new $.Deferred();

	for(var i = 0; i < itemsCount; ++i) {
		// Генерируем произвольную картинку
		var num = randomRange(1, 19);
		var numStr = (num < 10) ? "0" + num.toString() : num.toString();
	
		items.push({
			type   : "look",
			avatar : "img/gallery_example/Gallery_" + numStr + ".jpg",
			likes  :  Math.floor(Math.random() * 30) 
		});

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
		viewportFactor 	: 0.3,
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
				masonry.appended( elements );
				defer.resolve();
			});
		});

		return defer.promise();
	};
});
