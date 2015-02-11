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
					"autoHeight" : true,
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
	timelineNav : '.history.timeline .nav-justified',
	timelineNavItem : '.history.timeline .nav-justified li a',
	timelineNavItemParents : '.history.timeline .nav-justified li',
	timelineMobileNav : '#mobileTimelineNav',
	timelineItemDetails : '.timeline.details .item',
	
	
	init: function() {
		sq.jsCenterContent.init();
		sq.mobileNavClick.init();
		sq.timelineNavClick.init();
		
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
	
	timelineNavClick: {
		init: function(){
			sq.log("timelineNavClick.init()");
			$(sq.timelineNavItem + ':first').parent().addClass("on");
			$(sq.timelineItemDetails + ':not(:first)').addClass("hidden");
			$(sq.timelineNavItem).click(sq.timelineNavClick.navClicked);
			$(sq.timelineMobileNav).change(sq.timelineNavClick.navClicked);
		},
		navClicked : function(e){
			e.preventDefault();
			
			var item = $(this).attr("href") || $(this).val();
			$(sq.timelineItemDetails).addClass("hidden");
			$(item).removeClass("hidden");
			sq.timelineNavClick.updateUI(item);
		},
		updateUI : function(which){
			$(sq.timelineNavItemParents).removeClass("on");
			$(sq.timelineNavItem).filter("[href="+ which +"]").parent().addClass("on");
			$(sq.timelineMobileNav).val(which);
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

		strategyStepsHeader = $('.strategy-steps .item h2');
		var highestCol = Math.max.apply( null, $(strategyStepsHeader).map(function(){ return $(this).height(); }).get() );
		//sq.log(items.length + " items, highest is " + highestCol);
		$( '.strategy-steps .item h2' )
			.css({transition: ''}).height(highestCol);

		strategyStepsSection = $('.strategy-steps .item section');
		var highestCol = Math.max.apply( null, $(strategyStepsSection).map(function(){ return $(this).height(); }).get() );
		//sq.log(items.length + " items, highest is " + highestCol);
		$( '.strategy-steps .item section' )
			.css({transition: ''}).height(highestCol);

	},
	reset : function(){
		$('.grid-post-details .details,.quick-links .item,.quick-news .item .inner-wrap,.strategy-steps .item h2,.strategy-steps .item section').css({height: 'auto', transition: 'none'});
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

var q4 = {
	date: {
		future: 0, // default
		past: 1,
		range: 2,
		all: 3
	},
	sort: {
		ascending: 0, // default
		descending: 1
	},
	type: {
		all: 0, // default
		webcasts: 1,
		events: 2
	},
	lang: {
		english: 1
	}
};

var irdata = {
	debug: false,
	
	host: "http://concho.q4web.com",
	feeds: {
		pressreleases: "/feed/PressRelease.svc/GetPressReleaseList",
		oneevent: "/feed/Event.svc/GetEventList",
		events: "/feed/Event.svc/GetEventList",
		onepresentation: "/feed/Presentation.svc/GetPresentationList",
		presentations: "/feed/Presentation.svc/GetPresentationList",
		documents: "/feed/FinancialReport.svc/GetFinancialReportList",
		stockquote: "/feed/StockQuote.svc/GetStockQuoteList",
	},
	params: {
		defaults: {
			apiKey: "6E8B29E93AEC435FA0E5A84CDE0FB1B2",
			languageId: q4.lang.english
		},
		pressreleases: {
			pressReleaseDateFilter: 1,
			pageSize: 3,
			includeTags: "true",
			tagList: ""
		},
		oneevent: {
			eventDateFilter: q4.date.all,			// 3
			sortOperator:    q4.sort.descending,	// 1
			pageSize: 1,
			includeTags: "true",
			tagList: ""
		},
		events: {
			eventDateFilter: q4.date.all,			// 3
			sortOperator:    q4.sort.descending,	// 1
			pageSize: 3,
			includeTags: "true",
			tagList: ""
		},
		onepresentation: {
			presentationDateFilter: q4.date.all,		// 3
			sortOperator:           q4.sort.descending,	// 1
			pageSize: 1,
			includeTags: "true",
			tagList: ""
		},
		presentations: {
			presentationDateFilter: q4.date.all,		// 3
			sortOperator:           q4.sort.descending,	// 1
			pageSize: 3,
			includeTags: "true",
			tagList: ""
		},
		documents: {
			pageSize: 3,
			includeTags: "true",
			tagList: ""
		},
		stockquote: {
			symbol: "CXO",
			exchange: "NYSE",
			pageSize: 1
		},
	},
	
	init: function() {
		irdata.log("site.js irdata.init()");
		irdata.initTimeZoneSupport();
	},
	
	getFeed: function(which) {
		irdata.log("irdata.getFeed(" + which + ")");
		return $.ajax({
			type: "GET",
			url: irdata.getURL(which),
			dataType: "jsonp"
		}).fail(function(jqXHR, errorMsg) {
			irdata.log("irdata.getFeed ajax.fail(): " + errorMsg);
		});
	},
	
	// ! ----- Date Time Entry Point Methods (call these) -----
	
	getStockDateTime: function(dateTimeString) {
		irdata.log("-----");
		irdata.log("irdata.getStockDateTime(" + dateTimeString + ")");
		if (irdata.isDST) {
			return irdata.processDateTime(dateTimeString, {toTZ: "EST"});
		} else {
			return irdata.processDateTime(dateTimeString, {toTZ: "EDT"});
		}
	},
	
	getDateTime: function (dateTimeString, fromTZ) {
		irdata.log("-----");
		if (typeof fromTZ == "undefined") {
			irdata.log("irdata.getDateTime(" + dateTimeString + ")");
			return irdata.processDateTime(dateTimeString, {});
		} else {
			irdata.log("irdata.getDateTime(" + dateTimeString + ", " + fromTZ + ")");
			return irdata.processDateTime(dateTimeString, {fromTZ: fromTZ});
		}
	},
	
	// ! ----- Date Time Process Methods -----
	
	initTimeZoneSupport: function() {
		irdata.log("irdata.initTimeZone()");
		
		// define Date.stdTimezoneOffset()
		Date.prototype.stdTimezoneOffset = function() {
			var jan = new Date(this.getFullYear(), 0, 1);
			var jul = new Date(this.getFullYear(), 6, 1);
			return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
		}
		
		// define Date.isDst()
		Date.prototype.isDst = function() {
			return this.getTimezoneOffset() < this.stdTimezoneOffset();
		}
		
		// is Daylight Saving Time currently active?
		irdata.isDST = new Date().isDst();
		
		// time zone abbreviations to their string values
		irdata.offsets = {
			EST: "-0500", CST: "-0600", MST: "-0700", PST: "-0800",
			EDT: "-0400", CDT: "-0500", MDT: "-0600", PDT: "-0700",
			UTC: "+0000", none: ""
		};
		
		// time zone abbreviations to their numeric values in hours
		irdata.hours = {
			EST: -5, CST: -6, MST: -7, PST: -8,
			EDT: -4, CDT: -5, MDT: -6, PDT: -7,
			UTC:  0
		};
		
		// determine time zone when none is specified
		if (irdata.isDST) {
			irdata.defaultFromTZ = "EST";
			irdata.defaultToTZ   = "CST";
			irdata.log("Daylight Saving Time is in effect.");
		} else {
			irdata.defaultFromTZ = "EDT";
			irdata.defaultToTZ   = "CDT";
			irdata.log("Standard Time is in effect.");
		}
		
		irdata.defaultFromOffset = irdata.offsets[irdata.defaultFromTZ];
		irdata.defaultToHours = irdata.hours[irdata.defaultToTZ];
	},
	
	processDateTime: function(rawDateTimeString, options) {
		//irdata.log("irdata.processDateTime(" + rawDateTimeString + "), options:");
		//irdata.log(options);
		
		// initialize variables
		var shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
						   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		
		// determine the offset to calculate from
		var fromOffset = irdata.defaultFromOffset;
		var fromTZ = irdata.defaultFromTZ;
		if (options && options.fromTZ
			&& typeof irdata.offsets[options.fromTZ] != "undefined") {
				fromOffset = irdata.offsets[options.fromTZ];
				fromTZ = options.fromTZ;
		}
		
		// assemble the string that gets converted into a date time
		var dateTimeString = rawDateTimeString;
		if (fromOffset != "") {
			dateTimeString += " " + fromOffset;
		}
		
		// create the input Date object with offset
		inDate = new Date(dateTimeString);
		var offsetDateWasInvalid = false;
		if (!irdata.isValidDate(inDate)) {
			//irdata.log("*** Date with offset is invalid, removing offset.");
			offsetDateWasInvalid = true;
			dateTimeString = rawDateTimeString;
			inDate = new Date(dateTimeString);
		}
		
		//irdata.log(dateTimeString + " --> " + utcDate);
		
		// ----- now we have the in Date -----
		
		// determine the hours to calculate to
		var toHours = irdata.defaultToHours;
		var toTZ    = irdata.defaultToTZ;
		if (options && options.toTZ
			&& typeof irdata.offsets[options.toTZ] != "undefined"
			&& typeof irdata.offsets[options.toTZ] != "0") {
				toHours = irdata.hours[options.toTZ];
				toTZ = options.toTZ;
		} else {
			//irdata.log("Found no options.toTZ");
		}
		if (offsetDateWasInvalid) {
			/** NOTE
			 * With the development data, invalid dates were only created when there
			 * was no time provided, when only a date was supplied. In those cases,
			 * flagged here by offsetDateWasInvalid, I set the toHours multiplier to
			 * zero and flag the toTZ as Invalid. Only the date portion should be used.
			 */
			toHours = 0;
			toTZ = "Invalid";
		}
		
		/** IMPORTANT
		 * outDate is an artificial construction. The date and time in the object
		 * should be correct, but it is represented in UTC artificially.
		 * Get the date and time from outDate with getUTC____()
		 */
		//irdata.log("toHours is " + toHours);
		outDate = new Date(inDate.getTime() + (toHours * 3600000));
		
		// date construction
		var monthNumber = outDate.getUTCMonth() + 1;
		var dayNumber   = outDate.getUTCDate();
		var shortMonth  = shortMonths[outDate.getUTCMonth()];
		
		var shortMDY  = shortMonth + " " + dayNumber + ", " + outDate.getUTCFullYear();
		var dottedMD  = irdata.lpad(monthNumber, 2) + "." + irdata.lpad(dayNumber, 2);
		var dottedMDY = dottedMD + "." + outDate.getUTCFullYear().toString().substring(2)
		
		// time construction
		var timeHour = outDate.getUTCHours();
		var timeMin  = irdata.lpad(outDate.getUTCMinutes(), 2);

		var timeHour12 = timeHour;
		var amPm = "AM";
		if (timeHour12 > 12) {
			amPm = "PM";
			timeHour12 = timeHour12 - 12;
		}
		if (timeHour == 12) {
			amPm = "PM";
		}
		if (timeHour12 == 0) {
			timeHour12 = 12;
		}
		
		var timeHMP  = timeHour12 + ":" + timeMin + " " + amPm
		var timeHMPZ = timeHMP + " " + toTZ;
		
		irdata.log("Converted " + fromTZ + " to " + toTZ);
		irdata.log(shortMDY + " - " + timeHMPZ);
		
		return {
			shortMDY:      shortMDY,
			dottedDateMD:  dottedMD,
			dottedDateMDY: dottedMDY,
			timeHMP:       timeHMP,
			timeHMPZ:      timeHMPZ
		};
	},
		
	isValidDate: function(d) {
		if (Object.prototype.toString.call(d) !== "[object Date]") {
			return false;
		}
		return !isNaN(d.getTime());
	},

	// -----
	
	lpad: function(value, length) {
		var padChar = "0";
		var padding = padChar;
		for (var i = 0; i < length; i++) {
			padding += padChar;
		}
		
		return (padding + value).slice(length * -1);
	},
	
	getURL: function(feed) {
		var paramlist = [];
		for (name in irdata.params.defaults) {
			paramlist.push(name + "=" + irdata.params.defaults[name]);
		}
		for (name in irdata.params[feed]) {
			paramlist.push(name + "=" + irdata.params[feed][name]);
		}
		paramlist.push("req=" + Math.round(new Date().getTime() / 1000));
		irdata.log("irdata.getURL(): " + irdata.host + irdata.feeds[feed] + "?" + paramlist.join("&"));
		return irdata.host + irdata.feeds[feed] + "?" + paramlist.join("&");
	},
	
	// ===== Utility Methods =====
	
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

var stock = {
	debug: false,
	
	container: ".stock-ticker",
	currentPrice:  ".stock-ticker .current-price",
	change: ".stock-ticker .change",
	percentChange: ".stock-ticker .percent-change",
		
	init: function() {
		stock.log("stock.init()");
		stock.update();
	},
	
	update: function() {
		stock.log("stock.update()");
		
		irdata.getFeed("stockquote").done(stock.process);
	},
	
	process: function(result) {
		stock.log("stock.process()");
		stock.log(result);
		
		var currentPrice = [];
		var valueChange = [];
		var percentChange = [];
		//output.push("NYSE:");
		//output.push("CXO");
		
		if (typeof result.GetStockQuoteListResult[0] != "undefined") {
			var quote = result.GetStockQuoteListResult[0];
			
			if (typeof quote.TradePrice != "undefined") {
				currentPrice.push("$" + Number(quote.TradePrice).toFixed(2));
			}
			
			if (typeof quote.Change != "undefined") {
				var prefix = "";
				if (quote.Change < 0) {
					prefix += "<span class=\"fa fa-sort-down\"></span>&nbsp;&nbsp;&nbsp;";
				}
				if (quote.Change > 0) {
					prefix += "<span class=\"fa fa-sort-up\"></span>&nbsp;&nbsp;&nbsp;";
				}
				valueChange.push(prefix + Number(Math.abs(quote.Change)).toFixed(2) + "&nbsp;&nbsp;&nbsp;|");
			}
			
			if (typeof quote.PercChange != "undefined") {
				var prefix = "";
				if (quote.PercChange < 0) {
					prefix += "- ";
				}
				if (quote.PercChange > 0) {
					prefix += "+ ";
				}
				percentChange.push(prefix + Math.abs(quote.PercChange).toFixed(2) + "%");
			}
		}
		
		$(stock.currentPrice).text(currentPrice.join(" "));
		$(stock.change).html(valueChange.join(" "));
		$(stock.percentChange).text(percentChange.join(" "));
	},
	
	// ===== Utility Methods =====
	
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

var rc = {
	debug: false,
	
	container: "#home-feeds .section-content",
	navItems: "#home-feeds .section-nav .nav > li",
	mobileNav: "#home-feeds .section-nav #select1",
	loading: "loading",
	
	init: function() {
		rc.log("rc.init()");
		$(rc.navItems).click(rc.navClicked);
		$(rc.mobileNav).change(rc.navClicked);
		rc.updateUI("pressreleases");
		irdata.getFeed("pressreleases").done(rc.pressreleases);
	},
	
	navClicked: function() {
		rc.log("rc.navClicked()");
		var feed = $(this).attr("data-feed") || $(this).val();
		
		// empty container and update UI (nav marking, loading)
		$(rc.container).html('');
		rc.updateUI(feed);
		
		// get data from the feed
		if (feed == "onecombined") {
			rc.log("onecombined detected.");
			$.when(
				irdata.getFeed("oneevent"),
				irdata.getFeed("onepresentation")
			).then(rc[feed], function() {
				rc.log("onecombined.fail()")
			});
		} else {
			irdata.getFeed(feed).done(rc[feed]);
		}
	},
	
	updateUI: function(which) {
		// mark the proper nav item
		$(rc.navItems).removeClass("active").filter("[data-feed=" + which + "]").addClass("active");
		$(rc.mobileNav).val(which);
		// show loading
		$(rc.container).addClass(rc.loading);
	},
	
	outputHTML: function(items, fields, col) {
		var container = $(rc.container);
		
		if (typeof col == "undefined") {
			col = 0;
		}

		container.removeClass(rc.loading);
		
		for (var i = 0; i < items.length; i++) {
			var item = items[i];

			// request date object
			var dateTime = irdata.getDateTime(item[fields.datetime]);
			
			// construct common output
			var date = '<h4 class="green-dark">' + dateTime.dottedDateMDY + '</h4>';
			var headline = '<p>';
			if (fields.titlePrefix) {
				headline += fields.titlePrefix;
			}
			headline += item[fields.title] + '</p>';

			
			// construct time
			var time = '';
			if (fields.showtime) {
				time += '<span class="time">';
				time += dateTime.timeHMPZ;
				time += '</span>';
			}

			// construct the HTML
			var theHTML = "";
			theHTML += '<div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 padding-bottom-small col' + (i + 1 + col) + ' ' + ((i==2)?'hidden-xs':'') + '">\n';
			if (typeof fields.link != "object") {
				var linkParams = {
					href: item[fields.link],
					text: date + headline
				};
				if (fields.target) {
					linkParams.target = fields.target;
				}
				theHTML += rc.constructLink(linkParams);
			}
			theHTML += '</div>\n';

			rc.log(theHTML);
			
			// append the HTML
			container.append(theHTML);
		}
	},
	
	constructLink: function(link) {
		// massage the href
		var href = link.href;
		if (href.indexOf("http") != 0) {
			href = irdata.host + href;
		}
		var theContent = link.text;
		// assemble the HTML
		var theHTML = '<a href="' + href + '"';
		if (typeof link.target != "undefined") {
			theHTML += ' target="' + link.target + '"';
		}
		if (typeof link.theClass != "undefined") {
			theHTML += ' class="' + link.theClass + '"';
		}
		theHTML += '>READ MORE';
		theHTML += '</a>';
		
		return theContent + theHTML;
	},
	
	pressreleases: function(result) {
		rc.log("rc.pressreleases()");
		rc.outputHTML(result.GetPressReleaseListResult, {
			datetime: "PressReleaseDate",
			showtime: true,
			timezone: false,
			link: "LinkToDetailPage",
			title: "Headline",
			target: false
		});
	},
	
	onecombined: function(event, presentation) {
		rc.log("rc.onecombined()");
		rc.outputHTML(event[0].GetEventListResult, {
			datetime: "StartDate",
			showtime: true,
			timezone: "TimeZone",
			link: "LinkToDetailPage",
			title: "Title",
			titlePrefix: "Webcast: ",
			target: false
		}, 0, false);
		rc.outputHTML(presentation[0].GetPresentationListResult, {
			datetime: "PresentationDate",
			showtime: true,
			timezone: false,
			link: "LinkToDetailPage",
			title: "Title",
			titlePrefix: "Presentation: "
		}, 1);
	},
	
	events: function(result) {
		rc.log("rc.events()");
		rc.outputHTML(result.GetEventListResult, {
			datetime: "StartDate",
			showtime: true,
			timezone: "TimeZone",
			link: "LinkToDetailPage",
			title: "Title",
			target: false
		});
	},
	
	presentations: function(result) {
		rc.log("rc.presentations()");
		rc.outputHTML(result.GetPresentationListResult, {
			datetime: "PresentationDate",
			showtime: true,
			timezone: false,
			link: "LinkToDetailPage",
			title: "Title"
		});
	},
	
	documents: function(result) {
		rc.log("rc.documents()");
		
		var docList = [];
		var desiredListLength = 3;
		for (var f = 0; f < result.GetFinancialReportListResult.length; f++) {
			var group = result.GetFinancialReportListResult[f];
			for (var d = 0; d < group.Documents.length; d++) {
				var doc = group.Documents[d];
				doc.ReportDate = group.ReportDate;
				if (docList.length < desiredListLength) {
					docList.push(doc);
				}
			}
		}
		
		rc.outputHTML(docList, {
			datetime: "ReportDate",
			showtime: false,
			timezone: false,
			title: "DocumentTitle",
			link: "DocumentPath",
			target: "_blank"
		});
	},
	
	localdocs: function(result) {
		rc.log("rc.localdocs()");
		rc.outputHTML(result.LocalDocs, {
			datetime: "DocumentDate",
			showtime: false,
			timezone: false,
			link: "DocumentLink",
			title: "DocumentTitle",
			target: "_blank"
		});
	},
	
	// ===== Utility Methods =====
	
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
	
	irdata.init();
	//stock.init();
	//rc.init();
	
	/**
	 * Temporary Chrome font fix
	 */
	$(function() { $('body').hide().show(); });
});