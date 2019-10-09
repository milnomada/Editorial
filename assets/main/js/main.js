/*
  Editorial
  updated, extended by the article feed fella's
  original from html5up.net | @ajlkn

  CCA 3.0 license
*/

(function($) {
  var $window = $(window),
    $head = $('head'),
    $body = $('body');

  // Breakpoints.
  breakpoints({
    xlarge:   [ '1281px',  '1680px' ],
    large:    [ '981px',   '1280px' ],
    medium:   [ '737px',   '980px'  ],
    small:    [ '481px',   '736px'  ],
    xsmall:   [ '361px',   '480px'  ],
    xxsmall:  [ null,      '360px'  ],
    'xlarge-to-max':    '(min-width: 1681px)',
    'small-to-xlarge':  '(min-width: 481px) and (max-width: 1680px)'
  });

  // Stops animations/transitions until the page has ...
  // loaded
  $window.on('load', function() {
    window.setTimeout(function() {
      $body.removeClass('is-preload');
    }, 100);
  });

  // stopped resizing.
  var resizeTimeout;
  $window.on('resize', function() {
    $body.addClass('is-resizing');
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      $body.removeClass('is-resizing');
    }, 100);
  });

  // Object fit images.
  if (!browser.canUse('object-fit') ||  browser.name == 'safari') {
    $('.image.object').each(function() {
      var $this = $(this),
        $img = $this.children('img');
      // Hide original image.
      $img.css('opacity', '0');
      // Set background.
      $this
        .css('background-image', 'url("' + $img.attr('src') + '")')
        .css('background-size', $img.css('object-fit') ? $img.css('object-fit') : 'cover')
        .css('background-position', $img.css('object-position') ? $img.css('object-position') : 'center');
    });
  }

  // Sidebar.
  var $sidebar = $('#sidebar'),
    $sidebar_inner = $sidebar.children('.inner');

  // Inactive by default on <= large.
  breakpoints.on('<=large', function() {
    $sidebar.addClass('inactive');
    $('.toggle').show();
  });

  breakpoints.on('>large', function() {
    $sidebar.removeClass('inactive');
    $('.toggle').hide();
  });

  // Hack: Workaround for Chrome/Android scrollbar position bug.
  if (browser.os == 'android' &&  browser.name == 'chrome')
    $('<style>#sidebar .inner::-webkit-scrollbar{display:none;}</style>')
      .appendTo($head);

  // Toggle.
  $('<a href="#sidebar" class="toggle">Toggle</a>')
    .appendTo($sidebar)
    .on('click', function(event) {
      // Prevent default.
      event.preventDefault();
      event.stopPropagation();
      // Toggle.
      $sidebar.toggleClass('inactive');
    });

  // Link clicks.
  $sidebar.on('click', 'a', function(event) {
    if (breakpoints.active('>large'))
      return;

    var $a = $(this),
      href = $a.attr('href'),
      target = $a.attr('target');

    event.preventDefault();
    event.stopPropagation();

    if (!href || href == '#' || href == '')
      return;

    $sidebar.addClass('inactive');
    // Redirect to href.
    setTimeout(function() {
      if (target == '_blank')
        window.open(href);
      else
        window.location.href = href;
    }, 500);
  });

  // Prevent certain events inside the panel from bubbling.
  $sidebar.on('click touchend touchstart touchmove', function(event) {
    if (breakpoints.active('>large'))
      return;
    event.stopPropagation();
  });

  // Hide panel on body click/tap.
  $body.on('click touchend', function(event) {
    if (breakpoints.active('>large'))
      return;
    $sidebar.addClass('inactive');
  });

  // Scroll lock.
  $window.on('load.sidebar-lock', function() {
    var sh, wh, st, 
      offset_header=162;

    // Reset scroll position to 0 if it's 1.
    if ($window.scrollTop() == 1)
      $window.scrollTop(0);

    $window
      .on('scroll.sidebar-lock', function() {
        var x, y;
        // <=large? Bail.
        if (breakpoints.active('<=large')) {
          $sidebar_inner
            .data('locked', 0)
            .css('position', '')
            .css('top', '');
          return;
        }

        // Calculate positions.
        x = 0;
        y = Math.max(0, $window.scrollTop() - x);

        // Lock/unlock.
        if ($sidebar_inner.data('locked') == 1) {
          // console.log("lock", offset_header)
          // console.log("sidebar height", $sidebar.height());
          // move the list/grid toggle button
          $(".settings").prependTo("#sidebar .inner");
          if (y <= offset_header)
            $sidebar_inner
              .data('locked', 0)
              .css('position', '')
              .css('top', '');
          else
            $sidebar_inner.css('top', -1 * x);

        } else {
          // console.log("un lock", offset_header)
          // move the list/grid toggle button
          $(".settings").prependTo("#main .inner");
          if (y > offset_header)
            $sidebar_inner
              .data('locked', 1)
              .css('position', 'sticky')
              .css('top', -1 * x);
        }
      })
      .on('resize.sidebar-lock', function() {
        wh = $window.height();
        sh = $sidebar_inner.outerHeight() + 30;
        $window.trigger('scroll.sidebar-lock');
      })
      .trigger('resize.sidebar-lock');
    });

  // Menu
  var $menu = $('#menu'),
    $menu_openers = $menu.children('ul').find('.opener');

  $menu_openers.each(function() {
    var $this = $(this);
    $this.on('click', function(event) {
      event.preventDefault();
      $menu_openers.not($this).removeClass('active');
      $this.toggleClass('active');
      $window.triggerHandler('resize.sidebar-lock');
    });
  });

})(jQuery);