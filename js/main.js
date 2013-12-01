$(function() {

	// Шаблонизация
	var fancyboxTemplate = Handlebars.compile( 
		$("#fancybox-template").html() );

	var itemTemplate = Handlebars.compile( 
		$("#gallery-item-template").html() );

	var photographTemplate = Handlebars.compile( 
		$("#gallery-photograph-template").html() );


// ----------------------------------------------------------------------------
// Интерфейсная часть
// ----------------------------------------------------------------------------

// Обработчик клика на лук
$(".gallery-list").on("click", ".gallery-item",  function() {
	var model = $(this).data("model");

	alert("Clicked photo", model.image);
});


// Обработчик клика на кнопку "лайк"
$(".gallery-list").on("click", ".likes-thumb",  function(event) {
	event.stopPropagation();
	var model = $(this).data("model");

	alert("Clicked thumb");

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
			avatar : "img/gallery_example/Gallery_" + numStr + ".jpg",
			likes  :  Math.floor(Math.random() * 30) 
		});
	} 

	setTimeout(function() {
		defer.resolve(items);
	}, randomRange(500, 2500));

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
				var model = {
					image : items[i].avatar,
					likes : items[i].likes
				};

				var item = $("<li>").addClass("gallery-item");

				item.html( itemTemplate( model ));

				$(item).data("model", model);

				elems.push(item[0])
			}

			var elements = $( elems );

			elements.imagesLoaded(function() {
				galleryList.append( elements );	
				masonry.appended( elements );
				defer.resolve();
			});
		});

		return defer.promise();
	};
});
