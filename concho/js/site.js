Array.prototype.remove = function(v) {
    return $.grep(this, function(e) {
        return e !== v;
    });
};

var homeFeaturedCarousel = {
	
	pagination : ".slide-slideshow-home-featured-carousel .owl-controls",
	slideshow : ".slide-slideshow-home-featured-carousel .slideshow",
	next : ".slide-slideshow-home-featured-carousel .slideshowouter .next",
	prev : ".slide-slideshow-home-featured-carousel .slideshowouter .prev",
	item : ".slide-slideshow-home-featured-carousel .item",
	owlControls : ".slide-slideshow-home-featured-carousel .owl-controls",
	
	init : function(){
		if($().owlCarousel){
			var owl = $(homeFeaturedCarousel.slideshow).owlCarousel({
					"items"	: 1,
					"singleItem" : true,
					"autoPlay" : true,
					"transitionStyle" : "fade",
					"lazyLoad" : true,
					"dragBeforeAnimFinish" : true,
					"mouseDrag" : true,
					"touchDrag" : true,
					"scrollPerPage" : true
			});
			// Custom Navigation Events
			$(homeFeaturedCarousel.next).click(function(){
				owl.trigger('owl.next');
			});
			$(homeFeaturedCarousel.prev).click(function(){
				owl.trigger('owl.prev');
			});
		}
	}
};

var careResources = {
	
	pagination : ".slide-slideshow .owl-controls",
	slideshow : ".slide-slideshow .slideshow",
	next : ".slide-slideshow .slideshowouter .next",
	prev : ".slide-slideshow .slideshowouter .prev",
	item : ".slide-slideshow .item",
	owlControls : ".slide-slideshow .owl-controls",
	
	init : function(){
		if($().owlCarousel){
			var owl = $(careResources.slideshow).owlCarousel({
					"items"	: 3,
					"transitionStyle" : "fade",
					"lazyLoad" : true,
					"dragBeforeAnimFinish" : true,
					"mouseDrag" : true,
					"touchDrag" : true,
					"scrollPerPage" : true
			});
			// Custom Navigation Events
			$(careResources.next).click(function(){
				owl.trigger('owl.next');
			});
			$(careResources.prev).click(function(){
				owl.trigger('owl.prev');
			});
			careResources.controls('first');
		}
	},
	controls : function(e){
		if($().owlCarousel){
			if( e == 'first'){
				$(careResources.next + ',' + careResources.prev).hide();
				var slideshowHeight = $(careResources.slideshow).height();
				var navHeight = $(careResources.next).outerHeight();
				var navTop = (slideshowHeight - navHeight) / 2;
				
				if(navTop >= 2){
					$(careResources.next + ',' + careResources.prev).css({'top' : navTop});
				}
				

				$(careResources.next + ',' + careResources.prev).show();
			}else{
				/*
				$('.project-top-slideshow img').bind('resize',function(){
					$(window).trigger('resize');
				});
				$(window).bind('resize', function(){
					$('.project-slide.slideshowouter .next,.project-slide.slideshowouter .prev').hide();
					var slideshowHeight = $(".project-top-slideshow").height();
					var navHeight = $('.project-slide.slideshowouter .next').outerHeight();
					var navTop = (slideshowHeight / 2) - navHeight;

					if(navTop >= 2){
						$('.project-slide.slideshowouter .next,.project-slide.slideshowouter .prev').css({'top' : navTop});
					}
					$('.project-slide.slideshowouter .next,.project-slide.slideshowouter .prev').show();
				});
				*/
			}
		}
	}
};

var offCanvasNav = {
	init : function(){
		offCanvasNav.calcOffCanvasHeight();
		$(window).resize(function(){
			offCanvasNav.calcOffCanvasHeight();
			enquireBreakPoints.docHeight();
		});
		
		$('[data-toggle=offcanvas]').click(function () {
			sq.log('offCanvasNav click');
			$('.row-offcanvas').toggleClass('active');
		});
	},
	calcOffCanvasHeight : function(){
		var mainContainer = $(document).height();
		$( '.sidebar-offcanvas' ).css({ 'height' : mainContainer });
	}
};

var lazyLoading = {
	init : function(){
		var ltIE9 = $('html').hasClass('lt-ie9');
		$(".lazy").lazyload({
			skip_invisible:false,
			effect:"fadeIn",
			event : "sporty",
			threshold: 10000,
			failure_limit:1000
		});
		$(window).bind("load", function() {
			var timeout = setTimeout(function() {
				$(".lazy").trigger("sporty")
			}, 100);
		});
		/**
		 * As images load re-calc the height of the columns
		 */
		
		$('img.lazy').load(function(){
			$(this).removeClass('lazy-logo');
			enquireBreakPoints.init();
		});
		
		//alert(navigator.appVersion);
		if ( ltIE9 ){
			setInterval(function(){
				
				enquireBreakPoints.init();
				
			}, 3000); //every 3 seconds
		}
	}
};

var enquireBreakPoints = {
	debug: false,
	init : function(){
		enquire.register("screen and (max-width: 767px)", {
			match : function(){
				$('body').addClass('mobile');
				enquireBreakPoints.reinit(true);
				sq.jsCenterContent.reset();
			},
			unmatch : function(){
				$('body').removeClass('mobile');
			}
		});

		enquire.register("screen and (min-width: 768px) and (max-width: 991px)", {
			match : function(){
				$('body').addClass('mobile');
				enquireBreakPoints.reinit();
				sq.jsCenterContent.reset();
			},
			unmatch : function(){
				$('body').removeClass('mobile');
			}
		});
		
		enquire.register("screen and (min-width: 992px) and (max-width: 1199px)", {
			match : function(){
				enquireBreakPoints.reinit();
				enquireBreakPoints.docHeight();
			}
		});
		enquire.register("screen and (min-width: 1199px)", {
			match : function(){				
				enquireBreakPoints.reinit();
			}
		});
		enquire.register("screen and (min-width: 500000px)", {
			match : function(){				
				enquireBreakPoints.reinit();
			}
		}, true);
	},
	reset : function(eq){
		$( '.col-1,.col-2,.col-3',eq ).css({'height' : 'auto'});
	},
	reinit : function(smallest) {
		/**
		 * Equal height row
		 */
		var eq = $('.row.equal-height');
		enquireBreakPoints.reset(eq);//Reset heights to get correct values
		
		if (!smallest) {
			$.each(eq,function(){
				var highestCol = Math.max($( '.col-1',this ).height(),$( '.col-2',this ).height(),$( '.col-3',this ).height());
				$( '.col-1,.col-2,.col-3',this ).height( highestCol );
			});
		}
		
		/**
		 * Equal height row
		 */
		var eqL = $('.row.equal-height-home');
		enquireBreakPoints.reset(eqL);//Reset heights to get correct values
		
		if (!smallest) {
			$.each(eqL,function(){
				var highestColList = Math.max($( '.col-1 .list-wrap',this ).height(),$( '.col-2 .list-wrap',this ).height(),$( '.col-3 .list-wrap',this ).height());
				$( '.col-1 .list-wrap,.col-2 .list-wrap,.col-3 .list-wrap',this ).height( highestColList );
			});
		}
		
		/**
		 * Grid Toggle
		 */
		gridToggle.reset();
		gridToggle.init();
		offCanvasNav.calcOffCanvasHeight();

		/**
		 * Owl Navigation positioning
		 */
		careResources.controls();

		if (smallest) {

		} else {
			//Nav shrink
			$(window).scroll(function() {
				if ($(document).scrollTop() > 50) {
				  $('nav.navbar-fixed-top').addClass('shrink');
				} else {
				  $('nav.navbar-fixed-top').removeClass('shrink');
				}
			});
		}
		
		enquireBreakPoints.docHeight();
		sq.jsCenterContent.init();
	},
	docHeight : function(){
		var docHeight = $(window).outerHeight();
		enquireBreakPoints.log("DOC HEIGHT: " + docHeight);
		//Short window height
		if(docHeight <= 764){
			$('body').addClass('short-screen');
		}else{
			$('body').removeClass('short-screen');
		}
	},
	
	log: function(message) {
		if (this.debug) {
			if (typeof console == "undefined" || typeof console.log == "undefined") {
				console = {log: function() {}};
			}
			console.log(message);
		}
	},
	
	// ===== End of Object =====
	
	endOfObject: 1

};

var sq = {
	debug: false,
	panelGroup : '.panel-group',
	panelTitle : '.panel-title',
	jsCenter : '.js-center',
	emergency : '.emergency',
	emergencyClose : '.emergency .fa-close',
	textResizer : '.textresizer a',
	
	init: function() {
		sq.jsCenterContent.init();
		
		$('[rel="popover"]').popover({
			placement: "auto left",
			html : true,
			trigger : "click",
		});
		$('[rel="popover"].open').popover('show');
		
		//Emergency box
		var showEmergency = $.cookie('emergency');
		if( showEmergency !== '1' ){
			$(sq.emergency).show();
		}
		$(sq.emergencyClose).click(function(){
			$(sq.emergency).hide();
			$.cookie('emergency', '1', { path: '/' });
		});
		
		$( sq.textResizer ).textresizer({
			target: "#content, .background-white, .background-blue-lavendar, .background-purple, .background-blue",
			type: "cssClass",
			sizes: [
				"small-text",
				"medium-text",
				"large-text",
				"larger-text"
			],
			selectedIndex: 1
		});
		
	},
	jsCenterContent: {
		init: function(){
			if( !$("body.short-screen").length ){
				$(sq.jsCenter).each(function(){
					var objectHeight = $(this).outerHeight();
					var parentHeight = $(this).parent().parent().outerHeight();
					$(this).css({ "top" : ( ( parentHeight - objectHeight ) ) / 2 });
				});
			}else{
				$(sq.jsCenter).each(function(){
					$(this).parent().css({ "height" : "auto" }).parent().css({ "height" : "auto" });
				});
			}

		},
		reset: function(){
			$(sq.jsCenter).each(function(){
				$(this).css({ "top" : "inherit" });
			});
		},
	},
	
	equalHeadings: {
		debug: false,
				
		init: function() {
			var highestCol = Math.max( $( '#content .row .col-1 h1:first' ).height(), $( '#content .row .col-1 h3:first' ).height(), $( '#content .row .col-2 h3:first' ).height(), $( '#content .row .sidebar h3:first' ).height() );
			$( '#content .row .col-1 h1:first,#content .row .col-1 h3:first,#content .row .col-2 h3:first,#content .row .sidebar h3:first' ).height(highestCol);
			$( '.page-content h3' ).css({'height' : 'auto'});
		},
		
		log: function(message) {
			if (this.debug) {
				sq.log(message);
			}
		},
		
		// ===== End of Object =====
		
		endOfObject: 1
	},
	
	log: function(message) {
		if (this.debug) {
			if (typeof console == "undefined" || typeof console.log == "undefined") {
				console = {log: function() {}};
			}
			console.log(message);
		}
	},
	
	// ===== End of Object =====
	
	endOfObject: 1
}

var gridToggle = {
	which: "b", // controls which set of selectors to use in the reset method
	init : function(){
		gridToggle.reset();//Reset heights to get correct values

		items = $('.grid-posts article[role="article"]');
		var highestCol = Math.max.apply( null, $(items).map(function(){ return $(this).height(); }).get() );
		//sq.log(items.length + " items, highest is " + highestCol);
		$( '.grid-posts article[role="article"]' )
			.css({transition: ''}).height(highestCol);

		items2 = $('.grid-posts-2 article[role="article"]');
		var highestCol2 = Math.max.apply( null, $(items2).map(function(){ return $(this).height(); }).get() );
		//sq.log(items.length + " items, highest is " + highestCol);
		$( '.grid-posts-2 article[role="article"] header' )
			.css({transition: ''}).height(highestCol2);

		items3 = $('.grid-posts-3 article[role="article"]');
		var highestCol3 = Math.max.apply( null, $(items3).map(function(){ return $(this).height(); }).get() );
		//sq.log(items.length + " items, highest is " + highestCol);
		$( '.grid-posts-3 article[role="article"] header' )
			.css({transition: ''}).height(highestCol3);
		
		events = $('.grid-posts-events article[role="article"]');
			var highestColEvents = Math.max.apply( null, $(events).map(function(){ return ( $(this).height() + $('header a.btn', this).height() ); }).get() );
			//sq.log(items.length + " items, highest is " + highestCol);
			$( '.grid-posts-events article[role="article"] header,.grid-posts-events article[role="article"] section' )
				.css({transition: ''}).height(highestColEvents);
		bios = $('.grid-post-bios article[role="article"]');
			var highestColBio = Math.max.apply( null, $(bios).map(function(){ return $(this).height(); }).get() );
			//sq.log(items.length + " items, highest is " + highestCol);
			$( '.grid-post-bios article[role="article"]' )
				.css({transition: ''}).height(highestColBio);
		bioLinks = $('.grid-post-bios article[role="article"] footer a');
			var highestColBioLink = Math.max.apply( null, $(bioLinks).map(function(){ return $(this).height(); }).get() );
			sq.log(bioLinks.length + " bioLinks, highest is " + highestColBioLink);
			$( '.grid-post-bios article[role="article"] footer a' )
				.css({transition: ''}).height(highestColBioLink);

	},
	reset : function(){
		selectors = {
			// original selectors
			a: '.grid-posts article[role="article"]',
			// original selectors, plus bio link selector
			b: '.grid-posts article[role="article"]'
		}
		$(selectors[gridToggle.which]).css({height: 'auto', transition: 'none'});
		enquireBreakPoints.reset();
	}
};

var bootstrapClassHelpers = {
	init : function(){
		$('.pull-down').each(function() {
			$(this).css('margin-top', $(this).parent().height()-$(this).height());
			$(this).fadeIn('slow');
		});
	}
};

var generalForms = {
	init : function(){
		$('#cat').change(function() {
			this.form.submit();
		});
	}
};

var analytics = {
	event : function(type, data) {
		sq.log("Analytics: type of event:" + type + ", data: " + data);
	}
};

var lbox = {
	instance : '',
	init : function(){
		lbox.instance = $('a[rel*="lightbox"]').swipebox({
				useCSS: true,
				hideBarsDelay: 6000,
				hideBarsOnMobile: false,
				initialIndexOnArray: 1
		});
	}
};

var countCSS = {
	debug : true,
	init : function() {
		var results = '',
			log = '';
		if (!document.styleSheets) {
			return;
		}
		for (var i = 0; i < document.styleSheets.length; i++) {
			countSheet(document.styleSheets[i]);
		}
		function countSheet(sheet) {
			var count = 0;
			if (sheet && sheet.cssRules) {
				for (var j = 0, l = sheet.cssRules.length; j < l; j++) {
					var rule = sheet.cssRules[j];
					if (rule instanceof CSSImportRule) {
						countSheet(rule.styleSheet);
					}
					if( !rule.selectorText ) {
						continue;
					}
					count += rule.selectorText.split(',').length;
				}

				log += '\nFile: ' + (sheet.href ? sheet.href : 'inline <style> tag');
				log += '\nRules: ' + sheet.cssRules.length;
				log += '\nSelectors: ' + count;
				log += '\n--------------------------';
				if (count >= 4096) {
					results += '\n********************************\nWARNING:\n There are ' + count + ' CSS rules in the stylesheet ' + sheet.href + ' - IE will ignore the last ' + (count - 4096) + ' rules!\n';
				}
			}
		}
		countCSS.log(log);
		countCSS.log(results);
	},
	
	log: function(message) {
		if (this.debug) {
			if (typeof console == "undefined" || typeof console.log == "undefined") {
				console = {log: function() {}};
			}
			console.log(message);
		}
	},
	
	// ===== End of Object =====
	
	endOfObject: 1
};

$(document).ready(function($) {
	sq.log("Document Ready");
	sq.init();
	careResources.init();
	homeFeaturedCarousel.init();
	lazyLoading.init();
	enquireBreakPoints.init();
	bootstrapClassHelpers.init();
	generalForms.init();
	lbox.init();
	offCanvasNav.init();	
	//countCSS.init();
	/**
	 * Temporary Chrome font fix
	 */
	$(function() { $('body').hide().show(); });
});