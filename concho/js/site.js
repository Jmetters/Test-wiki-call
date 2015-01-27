Array.prototype.remove = function(v) {
    return $.grep(this, function(e) {
        return e !== v;
    });
};

var homeFeaturedCarousel = {
	pagination : ".slide-slideshow .owl-controls",
	slideshow : ".slide-slideshow .slideshow",
	next : ".slide-slideshow .slideshowouter .next",
	prev : ".slide-slideshow .slideshowouter .prev",
	item : ".slide-slideshow .item",
	owlControls : ".slide-slideshow .owl-controls",
	
	init : function(){
		if($().owlCarousel){
			var owl = $(homeFeaturedCarousel.slideshow).owlCarousel({
					"items"	: 1,
					"singleItem" : true,
					"autoPlay" : true,
					"transitionStyle" : "fade",
					"stopOnHover": true,
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
		gridToggle.init();
		offCanvasNav.calcOffCanvasHeight();

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
	mobileNav : '.sidebar-offcanvas .menu.nav',
	mobileNavLiWChildren : '.sidebar-offcanvas .menu.nav li.has-children a',
	
	init: function() {
		sq.jsCenterContent.init();
		sq.mobileNavClick.init();
		
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
	
	mobileNavClick: {
		init: function(){
			$(sq.mobileNavLiWChildren).click(function(){
				if($(this).parent().hasClass('off')){
					$(this).parent().removeClass('off').addClass('on');
					$(this).parent().find('> ul.sub-menu').removeClass('off').addClass('on');
				}else if($(this).parent().hasClass('on')){
					$(this).parent().removeClass('on').addClass('off');
					$(this).parent().find('> ul.sub-menu').removeClass('on').addClass('off');
				}
			});
		}
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
	init : function(){
		gridToggle.reset();//Reset heights to get correct values

		items = $('.grid-post-details .details');
		var highestCol = Math.max.apply( null, $(items).map(function(){ return $(this).height(); }).get() );
		//sq.log(items.length + " items, highest is " + highestCol);
		$( '.grid-post-details .details' )
			.css({transition: ''}).height(highestCol);

		quickLinks = $('.quick-links .item');
		var highestCol = Math.max.apply( null, $(quickLinks).map(function(){ return $(this).height(); }).get() );
		//sq.log(items.length + " items, highest is " + highestCol);
		$( '.quick-links .item' )
			.css({transition: ''}).height(highestCol);

		quickNews = $('.quick-news .item .inner-wrap');
		var highestCol = Math.max.apply( null, $(quickNews).map(function(){ return $(this).height(); }).get() );
		//sq.log(items.length + " items, highest is " + highestCol);
		$( '.quick-news .item .inner-wrap' )
			.css({transition: ''}).height(highestCol);

	},
	reset : function(){
		$('.grid-post-details .details,.quick-links .item,.quick-news .item .inner-wrap').css({height: 'auto', transition: 'none'});
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