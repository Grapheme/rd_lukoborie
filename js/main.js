		

$(document).ready( function(){
	$('.gallery-item .likes-thumb').click( function(){
		$(this).parent().parent().find('.overlay').css({ display: 'block', opacity: 1 });	
	});

	$(".fancybox").fancybox({
		padding: 25,
		helpers: {
	   		overlay: {
	   			locked: false
	   		},
	   		title: {
	   			type: 'outside'
	   		}
		}
	});
	
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
});


$(window).load(function() {
	window.scrollTo(0,0);
});

$(function() {
	var itemTemplate = Handlebars.compile( $("#gallery-item-template").html() );
	var photographTemplate = Handlebars.compile( $("#gallery-photograph-template").html() );


	function fetchFromServer(callback) {


		var items = [];
		for(var i = 0; i < 20; ++i) {
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
		}, 1000);
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
