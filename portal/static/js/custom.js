jQuery(document).ready(function() {
  "use strict";

  var pluginName = "Morphext",
  defaults = {
    animation: "bounceIn",
    separator: ",",
    speed: 2000,
    complete: jQuery.noop
  };

  function Plugin (element, options) {
    this.element = jQuery(element);
    this.settings = jQuery.extend({}, defaults, options);
    this._defaults = defaults;
    this._init();
  }

  Plugin.prototype = {
    _init: function () {
      var jQuerythat = this;
      this.phrases = [];

      this.element.addClass("morphext");

      jQuery.each(this.element.text().split(this.settings.separator), function (key, value) {
        jQuerythat.phrases.push(jQuery.trim(value));
      });

      this.index = -1;
      this.animate();
      this.start();
    },
    animate: function () {
      this.index = ++this.index % this.phrases.length;
      this.element[0].innerHTML = "<span class=\"animated " + this.settings.animation + "\">" + this.phrases[this.index] + "</span>";

      if (jQuery.isFunction(this.settings.complete)) {
        this.settings.complete.call(this);
      }
    },
    start: function () {
      var jQuerythat = this;
      this._interval = setInterval(function () {
        jQuerythat.animate();
      }, this.settings.speed);
    },
    stop: function () {
      this._interval = clearInterval(this._interval);
    }
  };

    jQuery.fn[pluginName] = function (options) {
      return this.each(function() {
        if (!jQuery.data(this, "plugin_" + pluginName)) {
          jQuery.data(this, "plugin_" + pluginName, new Plugin(this, options));
        }
      });
    };

  // Preloader
  jQuery(window).load(function(){
    jQuery('#preloader').delay(100).fadeOut('slow',function(){jQuery(this).remove();});
  });

  // Hero rotating texts
  jQuery("#hero .rotating").Morphext({
    animation: "flipInX",
    separator: "/",
    speed: 3000
  });

  // Initiate the wowjs
  new WOW().init();

  // Initiate superfish on nav menu
  jQuery('.nav-menu').superfish({
    animation: {opacity:'show'},
    speed: 400
  });

  // Mobile Navigation
  if( jQuery('#nav-menu-container').length ) {
      var jQuerymobile_nav = jQuery('#nav-menu-container').clone().prop({ id: 'mobile-nav'});
      jQuerymobile_nav.find('> ul').attr({ 'class' : '', 'id' : '' });
      jQuery('body').append( jQuerymobile_nav );
      jQuery('body').prepend( '<button type="button" id="mobile-nav-toggle"><i class="fa fa-bars"></i></button>' );
      jQuery('body').append( '<div id="mobile-body-overly"></div>' );
      jQuery('#mobile-nav').find('.menu-has-children').prepend('<i class="fa fa-chevron-down"></i>');

      jQuery(document).on('click', '.menu-has-children i', function(e){
          jQuery(this).next().toggleClass('menu-item-active');
          jQuery(this).nextAll('ul').eq(0).slideToggle();
          jQuery(this).toggleClass("fa-chevron-up fa-chevron-down");
      });

      jQuery(document).on('click', '#mobile-nav-toggle', function(e){
          jQuery('body').toggleClass('mobile-nav-active');
          jQuery('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          jQuery('#mobile-body-overly').toggle();
      });

      jQuery(document).click(function (e) {
          var container = jQuery("#mobile-nav, #mobile-nav-toggle");
          if (!container.is(e.target) && container.has(e.target).length === 0) {
             if ( jQuery('body').hasClass('mobile-nav-active') ) {
                  jQuery('body').removeClass('mobile-nav-active');
                  jQuery('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
                  jQuery('#mobile-body-overly').fadeOut();
              }
          }
      });
  } else if ( jQuery("#mobile-nav, #mobile-nav-toggle").length ) {
      jQuery("#mobile-nav, #mobile-nav-toggle").hide();
  }

  // Stick the header at top on scroll
  jQuery("#header").sticky({topSpacing:0, zIndex: '50'});

  // Smoth scroll on page hash links
  jQuery('a[href*="#"]:not([data-toggle="tab"])').on('click', function() {
      if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
          var target = jQuery(this.hash);
          if (target.length) {

              var top_space = 0;

              if( jQuery('#header').length ) {
                top_space = jQuery('#header').outerHeight();
              }

              jQuery('html, body').animate({
                  scrollTop: target.offset().top - top_space
              }, 1500, 'easeInOutExpo');

              if ( jQuery(this).parents('.nav-menu').length ) {
                jQuery('.nav-menu .menu-active').removeClass('menu-active');
                jQuery(this).closest('li').addClass('menu-active');
              }

              if ( jQuery('body').hasClass('mobile-nav-active') ) {
                  jQuery('body').removeClass('mobile-nav-active');
                  jQuery('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
                  jQuery('#mobile-body-overly').fadeOut();
              }

              return false;
          }
      }
  });

  // Back to top button
  jQuery(window).scroll(function() {

      if (jQuery(this).scrollTop() > 100) {
          jQuery('.back-to-top').fadeIn('slow');
      } else {
          jQuery('.back-to-top').fadeOut('slow');
      }

  });

  jQuery('.back-to-top').click(function(){
      jQuery('html, body').animate({scrollTop : 0},1500, 'easeInOutExpo');
      return false;
  });

  // Modal
  jQuery('#myModal').on('shown.bs.modal', function () {
    jQuery('#myInput').focus()
  });

  // Tab Panels

  $(document).on('show.bs.tab', '.nav-tabs-responsive [data-toggle="tab"]', function(e) {
    var $target = $(e.target);
    var $tabs = $target.closest('.nav-tabs-responsive');
    var $current = $target.closest('li');
    var $parent = $current.closest('li.dropdown');
		$current = $parent.length > 0 ? $parent : $current;
    var $next = $current.next();
    var $prev = $current.prev();
    var updateDropdownMenu = function($el, position){
      $el
      	.find('.dropdown-menu')
        .removeClass('pull-xs-left pull-xs-center pull-xs-right')
      	.addClass( 'pull-xs-' + position );
    };

    $tabs.find('>li').removeClass('next prev');
    $prev.addClass('prev');
    $next.addClass('next');

    updateDropdownMenu( $prev, 'left' );
    updateDropdownMenu( $current, 'center' );
    updateDropdownMenu( $next, 'right' );
  });
});


var searchVisible = 0;
var transparent = true;

var transparentDemo = true;
var fixedTop = false;

var navbar_initialized = false;

$(document).ready(function(){
    window_width = $(window).width();

    // check if there is an image set for the sidebar's background
    lbd.checkSidebarImage();

    // Init navigation toggle for small screens
    if(window_width <= 991){
        lbd.initRightMenu();
    }

    //  Activate the tooltips
    $('[rel="tooltip"]').tooltip();

    //      Activate the switches with icons
    if($('.switch').length != 0){
        $('.switch')['bootstrapSwitch']();
    }
    //      Activate regular switches
    if($("[data-toggle='switch']").length != 0){
         $("[data-toggle='switch']").wrap('<div class="switch" />').parent().bootstrapSwitch();
    }

    $('.form-control').on("focus", function(){
        $(this).parent('.input-group').addClass("input-group-focus");
    }).on("blur", function(){
        $(this).parent(".input-group").removeClass("input-group-focus");
    });

    // Fixes sub-nav not working as expected on IOS
$('body').on('touchstart.dropdown', '.dropdown-menu', function (e) { e.stopPropagation(); });
});

// activate collapse right menu when the windows is resized
$(window).resize(function(){
    if($(window).width() <= 991){
        lbd.initRightMenu();
    }
});

lbd = {
    misc:{
        navbar_menu_visible: 0
    },

    checkSidebarImage: function(){
        $sidebar = $('.sidebar');
        image_src = $sidebar.data('image');

        if(image_src !== undefined){
            sidebar_container = '<div class="sidebar-background" style="background-image: url(' + image_src + ') "/>'
            $sidebar.append(sidebar_container);
        }
    },
    initRightMenu: function(){
         if(!navbar_initialized){
            $navbar = $('nav').find('.navbar-collapse').first().clone(true);

            $sidebar = $('.sidebar');
            sidebar_color = $sidebar.data('color');

            $logo = $sidebar.find('.logo').first();
            logo_content = $logo[0].outerHTML;

            ul_content = '';

            $navbar.attr('data-color',sidebar_color);

            //add the content from the regular header to the right menu
            $navbar.children('ul').each(function(){
                content_buff = $(this).html();
                ul_content = ul_content + content_buff;
            });

            // add the content from the sidebar to the right menu
            content_buff = $sidebar.find('.nav').html();
            ul_content = ul_content + content_buff;


            ul_content = '<div class="sidebar-wrapper">' +
                            '<ul class="nav navbar-nav">' +
                                ul_content +
                            '</ul>' +
                          '</div>';

            navbar_content = logo_content + ul_content;

            $navbar.html(navbar_content);

            $('body').append($navbar);

            background_image = $sidebar.data('image');
            if(background_image != undefined){
                $navbar.css('background',"url('" + background_image + "')")
                       .removeAttr('data-nav-image')
                       .addClass('has-image');
            }


             $toggle = $('.navbar-toggle');

             $navbar.find('a').removeClass('btn btn-round btn-default');
             $navbar.find('button').removeClass('btn-round btn-fill btn-info btn-primary btn-success btn-danger btn-warning btn-neutral');
             $navbar.find('button').addClass('btn-simple btn-block');

             $toggle.click(function (){
                if(lbd.misc.navbar_menu_visible == 1) {
                    $('html').removeClass('nav-open');
                    lbd.misc.navbar_menu_visible = 0;
                    $('#bodyClick').remove();
                     setTimeout(function(){
                        $toggle.removeClass('toggled');
                     }, 400);

                } else {
                    setTimeout(function(){
                        $toggle.addClass('toggled');
                    }, 430);

                    div = '<div id="bodyClick"></div>';
                    $(div).appendTo("body").click(function() {
                        $('html').removeClass('nav-open');
                        lbd.misc.navbar_menu_visible = 0;
                        $('#bodyClick').remove();
                         setTimeout(function(){
                            $toggle.removeClass('toggled');
                         }, 400);
                    });

                    $('html').addClass('nav-open');
                    lbd.misc.navbar_menu_visible = 1;

                }
            });
            navbar_initialized = true;
        }

    }
}


// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		clearTimeout(timeout);
		timeout = setTimeout(function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		}, wait);
		if (immediate && !timeout) func.apply(context, args);
	};
};


// List Grid of Known Resources

$(document).ready(function() {
    $('#list').click(function(event){event.preventDefault();$('#products .item').addClass('list-group-item');});
    $('#grid').click(function(event){event.preventDefault();$('#products .item').removeClass('list-group-item');$('#products .item').addClass('grid-group-item');});
});
