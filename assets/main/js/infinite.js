$(document).ready(function(){
  var page = 2;
  var url_blog = window.location.href;
  
  if(url_blog.indexOf('/sections') !== -1)
    return;

  if(typeof not_infinite !== typeof undefined)
    return;

  var loader = $('<article class="k inf"><span class=""></span></article>')
  // console.log(">>", url_blog)

  $(window).scroll(function () {
    var wh = Math.floor($(window).scrollTop() + $(window).height()),
        offset = 250;

    // better use a range due to dpi issues on newer screens
    if ( $(document).height() > wh - offset && $(document).height() < wh + offset ) {

      // console.log(">> in")
      if (url_blog.charAt(url_blog.length - 1) != '/') {
        url_blog = url_blog + '/';
      }
      var nextPage = url_blog + 'page/' + page;

      if (page < max_pages) {
        $('.posts').append(loader);
        $.get(nextPage, function (content) {
          $('.posts').find(loader).remove();
          //if (page < max_pages) {
            // console.log(">> add")
            if(post_class !== '') {
              c=$(content).find(".posts article").addClass(post_class);
            } else
              c=$(content).find(".posts article");

            $('.posts').append(c);
            page = page + 1;
          //}
        }).fail(function() {
          $('.posts').find(loader).remove();
        })
      }
    }
  });
  
  /* */
});

