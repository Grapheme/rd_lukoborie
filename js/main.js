
$(function() {

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

	// // Обработчик клика на лук
	// $(".gallery-list").on("click", ".state.normal-state",  function() {
	// 	var parent = $(this).parents(".gallery-item");

	// 	// TODO: Показывать модальное окно!
	// });

	// $(".gallery-list").on("click", ".state.vote-state",  function() {
	// 	var parent = $(this).parents(".gallery-item");

	// 	parent.find(".state.thank-vote-state").show();
	// 	parent.find(".state:not(.thank-vote-state)").hide();
	// });

	// $(".gallery-list").on("click", ".state.thank-vote-state",  function() {
	// 	var parent = $(this).parents(".gallery-item");

	// 	parent.find(".state.email-state").show();
	// 	parent.find(".state:not(.email-state)").hide();
	// });


	// Обработчик клика на кнопку "лайк"
	$(".gallery-list").on("click", ".state.normal-state .likes-thumb",  function(event) {
		event.stopPropagation();
		var parent = $(this).parents(".gallery-item");

		parent.find(".state.vote-state").show();
		parent.find(".state:not(.vote-state)").hide();
	});

	// Обработчик клика на одну из социальных кнопок
	$(".gallery-list").on("click", ".state.vote-state .social-button",  function(event) {
		event.stopPropagation();
		var parent = $(this).parents(".gallery-item");

		parent.find(".state.thank-vote-state").show();
		parent.find(".state:not(.thank-vote-state)").hide();

		setTimeout(function() {	
			parent.find(".state.email-state").show();
			parent.find(".state:not(.email-state)").hide();
		}, 2000);
	});

	// Обработчик на нажатие кнопки при указании email
	$(".gallery-list").on("click", ".state.email-state .ok-button",  function() {
		event.stopPropagation();
		var parent = $(this).parents(".gallery-item");

		parent.find(".state.thank-email-state").show();
		parent.find(".state:not(.thank-email-state)").hide();
	});




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
		minDuration : 0.1,
		maxDuration : 0.6,
		viewportFactor : 0.3,
		itemSelector : "li"
	});	

	// Если дошли до конца, подгружаем новые элементы, которые изначально скрыты
	var busy = false;
	$(window).scroll(function() {
	   if($(window).scrollTop() + $(window).height() == $(document).height()) {

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
				var renderedElement = $("<li>").addClass("gallery-item");
				var model = items[i];

				if(model.type === "look") {
					renderedElement.html( itemTemplate( model ));
				}

				if(model.type === "photograph") {
					renderedElement.html( photographTemplate( model ));
				}

				renderedElement.data("model", model);
				elems.push(renderedElement[0])
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
