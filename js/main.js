$(window).load(function() {
	window.scrollTo(0,0);
});
$(function() {
	var itemTemplate = Handlebars.compile( $("#gallery-item-template").html() );
	var photographTemplate = Handlebars.compile( $("#gallery-photograph-template").html() );


	function fetchFromServer(callback) {


		var items = [];
		for(var i = 0; i < 30; ++i) {
			var num = Math.floor((Math.random()*19)) + 1;
			var numStr = num.toString();
			if(num < 10) {
				numStr = "0"+num;
			}


			items.push({
				avatar : "img/gallery_example/Gallery_" + numStr + ".jpg",
				likes  :  Math.floor(Math.random() * 30) 

			});
		} 

		setTimeout(function() {
			callback(items);
		}, 400);
	};


	function loadItems(callback) {

		fetchFromServer(function(items) {
			var elems = [];

			for(var i = 0; i < items.length; ++i) {

				var item = $("<li>").addClass("gallery-item");

				item.html( itemTemplate({
					image : items[i].avatar,
					likes : items[i].likes
				}));

				elems.push(item[0])
			}

			var elements = $( elems );

			elements.imagesLoaded(function() {
				galleryList.append( elements );
				masonry.appended( elems );

				callback();
			});
		});
	};


	var galleryList = $(".gallery-list");
	var masonry = new Masonry( galleryList[0], {
		itemSelector: "li",
		columnWidth: galleryList.width() / 4,
		transitionDuration : 0
	});

	var infinite = new InfiniteScroll(galleryList[0], {
		itemSelector : "li",
		done : loadNewPortion
	});	

	function loadNewPortion() {
		loadItems(function() {
			infinite.toggle();
		});
	};
	
});
