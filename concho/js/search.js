search = {
	debug : false,
	animating : false,
	
	trigger : ".search-tool a",
	slider : ".search-form.slider",
	input : ".search-form.slider input",
	topcontainer : ".container-fluid:first",
	navbar : ".navbar-fixed-top",
	formHeight : 0,
	paddingTop : 0,
	
	init : function() {
		search.log("search.init()");
		search.paddingTop = parseInt($(search.topcontainer).css('padding-top')) || 110;
		search.formHeight = parseInt($(search.slider).height()) || 49;
		$(search.trigger).click(search.triggerClicked);
		
		if ($(search.input).val() != "") {
			search.open();
		}
	},
	
	triggerClicked : function(e) {
		e.preventDefault();
		if (!search.animating) search.toggle();
	},
	
	toggle : function() {
		search.log("search.toggle()");
		var slider = $(search.slider);
		if (slider.is(":visible")) {
			search.close();
		} else {
			search.open();
		}
	},
	
	open : function() {
		search.log("search.open()");
		if( !$('body').hasClass('mobile') ){
			search.tl.clear();
			search.tl.eventCallback("onStart", function() {search.animating = true});
			search.tl.eventCallback("onComplete", function() {search.animating = false});
			search.tl.fromTo($(search.slider), 0.6, {height: 0}, {height: search.formHeight, display: 'block', overflow: 'hidden', ease: Quad.easeOut}, 0);
			search.tl.to($(search.topcontainer), 0.4, {paddingTop: search.paddingTop + search.formHeight + 'px', ease: Quad.easeOut}, 0.4);
			search.tl.fromTo($(search.slider).find('.form-group'), 0.6, {opacity: 0}, {opacity: 1, ease: Quad.easeOut}, 0.4);
		}
		$(search.trigger).parent('li').addClass('active');
	},
	
	close : function() {
		search.log("search.close()");
		search.tl.clear();
		search.tl.eventCallback("onStart", function() {search.animating = true});
		search.tl.eventCallback("onComplete", function() {search.animating = false});
		search.tl.to($(search.slider).find('.form-group'), 0.6, {opacity: 0, ease: Quad.easeOut}, 0);
		search.tl.to($(search.topcontainer), 0.4, {paddingTop: search.paddingTop + 'px', ease: Quad.easeIn}, 0);
		search.tl.fromTo($(search.slider), 0.6, {height: search.formHeight}, {height: 0, display: 'none', ease: Quad.easeOut}, 0.4);
		$(search.trigger).parent('li').removeClass('active');
	},
	
	tl : new TimelineLite(),
	
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
	search.init();
});