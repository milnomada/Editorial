/**
 * Simple Infinite Scroll for Ghost platform
 * ArticleFeed 2019
 */
$(document).ready(function(){
  var 
    page = 2,
    url_blog = window.location.href,
    loader = $('<article class="k inf"><span class=""></span></article>')
  
  if(url_blog.indexOf('/sections') !== -1)
    return;

  if(typeof not_infinite !== typeof undefined)
    return;

  $(window).scroll(function() {
    var 
      nextPage, c, 
      wh = Math.floor($(window).scrollTop() + $(window).height()),
      offset = 250;

    // better use a range due to dpi issues on newer screens
    if ( $(document).height() > wh - offset && $(document).height() < wh + offset ) {
      if (url_blog.charAt(url_blog.length - 1) != '/') {
        url_blog = url_blog + '/';
      }
      nextPage = url_blog + 'page/' + page;
      if (page < max_pages) {
        $('.posts').append(loader);
        $.get(nextPage, function (content) {
          $('.posts').find(loader).remove();
          if(post_class !== '') {
            c = $(content).find(".posts article").addClass(post_class);
          } else {
            c = $(content).find(".posts article");
          }
          $('.posts').append(c);
          page = page + 1;
        }).fail(function() {
          $('.posts').find(loader).remove();
        })
      }
    }
  });
});
