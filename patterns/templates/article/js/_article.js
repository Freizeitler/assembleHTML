/*jslint browser: true*/ /*global  $ */

/**
 * Sticky Header Appears on Upscrolling
 *
 * @desc Make a header sticky for mobile devices. Hide it when downscrolling, show it on upscroll.
 * @author [HZ]
 * @dependency jQuery
 */

'use strict';

$.fn.stickyHeader = function () {
    var header = $('.js-sticky'),
        prevScroll = 0,
        // set threshold from the top of the page
        threshold = 100;

    $(window).scroll(function () {
        var scrollMove = $(this).scrollTop();

        if (scrollMove > threshold) {
            if (scrollMove > prevScroll) {
                header.each(function() {
                    $(this).addClass('elem--hidden');
                });
            }
            if (scrollMove < prevScroll - 10) {
                 header.each(function() {
                    $(this).removeClass('elem--hidden');
                });
            }
            prevScroll = scrollMove;
        }
        if (scrollMove === 0) {
          header.each(function() {
              $(this).removeClass('elem--hidden');
          });
        }

    });
};

// init stickyHeader()
$(function () {
    $('.js-sticky').stickyHeader();
});


/**
 * Waypoints on this page
 *
 * @desc Trigger some animations on index page
 * @author [HZ]
 * @dependency jQuery, waypoints
 */
var waypoints = $('.js-waypoint-hidden').waypoint(function(direction) {
  $(this.element).removeClass('js-waypoint-hidden');
}, {
  offset: '45%'
});
var waypointsCoreGraphic = $('.js-waypoint-core-graphic').waypoint(function(direction) {
  $(this.element).addClass('graphic-core__circle-animation');
}, {
  offset: '45%'
});

// Smooth Scrolling
$(function() {
  $('a[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 500);
        return false;
      }
    }
  });
});


