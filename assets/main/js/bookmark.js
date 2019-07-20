/*
  bookmark.js
  A crispy bookmark section for the [Ghost Editorial theme]
  Adds a font-awesome bookmart at the top right of the post area.

  Needs custom.css file to be in the project theme/assets too. 

  Author: <karlos@milnomada.io>
  Version: 0.2

  0.1
  ---
  + Add cookie support
  + Add cookie monster object for bookmarks management
  + Add bookmarkSection helper

  Changes 0.2
  -----------

  + Add sharer method for social
  + Add cookieMonster as base cookie class
  + Add bookmark feature as BC
  + Add View feature ViewC

  Changes 0.3
  -----------
  + Add About hash scroll
  + Add flickr js feature
 */
(function($) {

  var 
    wlh=window.location.href,
    hbs_handler='a[data-elem="book-mark"]',
    s_handler='img.share',
    view_handler='.settings .icons a',
    top='#top',
    myheader='#top .header',
    imgRefresh='.new-image',
    defaultImage = '/content/images/2019/06/forest.jpg',
    defaultImageSrv
    ;

  var getSrc = function(){
    if(wlh.indexOf('localhost') == -1) {
      return 'https://iis.articlefeed.org/image?v=json'
    } else {
      return 'http://localhost:5000/image?v=json'
    }
  }

  defaultImageSrv = getSrc()

  var bookmarkSection = {
    e: $('<section class="bookmark-box"><h2 class="title">Bookmarks</h2><div class="mini-posts"></div></section>'),
    s: '.bookmark-box .mini-posts',
    create: function(){
      if($(this.s).length == 0)
        $(this.e).insertAfter('#sidebar .search')
    },
    load: function(cm){
      var to = $(this.s), ls=cm.list();
      to.html("");
      if(ls.length > 0) {
        ls.map(function(e, i){
          // console.log(e);
          var html='<div class="bm"><span class="date">'+ (new Date(e.add)).toDateString() +'</span></br><a class="ln" href="'+e.url+'"><small>'+e.name+'</small></a></div>';
          to.append(html);
        })
      } else {
        var html='<span>You added no bookmarks yet</span>';
        to.append(html);
      }
    }
  };

  var imgActions={
    start: '<ul class="icons">',
    buttons: { 
      'refresh': '<li><i class="fa fa-refresh new-image"></i></li>',
      'link': '<li><a target="_blank"><i class="fa fa-external-link"></i></a></li>',
    },
    end: '</ul>',

    get: function(buttonOpts=[]) {
      var s = this.start

      for(var i in buttonOpts){
        switch(buttonOpts[i]){ 
          case 'refresh': {
            s += this.buttons[buttonOpts[i]]
          } break;
          case 'link': {
            s += this.buttons[buttonOpts[i]]
          } break;
        }
      }
      s += this.end
      return s
    } 
  }

  /**
   * cookieMonster
   * base class for cookie management
   * Provides save, get ports to the Cookies library
   */
  class cookieMonster {

    constructor(name) {
      this.c = null;
      this.dur = { expires: 365 };
      this.name = name
    }

    get(){
      var c=Cookies.get(this.name);
      return c ? JSON.parse(c) : null
    }

    save(){
      Cookies.set(this.name, JSON.stringify(this.c), this.dur);
    }
  };

  class BC extends cookieMonster {

    check(){
      var cookie=super.get();
      if(!cookie){
        this.c={ 'created':Date.now(),'links':[] }
        super.save();
      } else {
        this.c = cookie
        //console.log(this.c)
        var li;
        for(var i in this.c.links) {
          li=this.c.links[i]
          if(li.url===window.location.href) {
             $('a[data-elem="book-mark"]').addClass('active');
             $('a[data-elem="book-mark"]').attr('title','Saved');
          }
        }
      }
    }

    save(link){
      this.c.links.push({'add':Date.now(),'url':link,'name':$('h1').html()})
      // console.log(JSON.stringify(this.c))
      super.save();
      // Cookies.set(this.name, JSON.stringify(this.c), this.dur);
      // console.log(this.c)
    }

    remove(link){
      var li;
      for(var i in this.c.links) {
        li=this.c.links.shift()
        if(li.url != link)
          this.c.links.push(li)
      }
      //console.log(JSON.stringify(this.c))
      super.save();
    }

    list(){
      return this.c.links;
    }
  };

  class ViewC extends cookieMonster {

    check(){
      var cookie=super.get();
      if(!cookie){
        this.c={ 'status':'grid' }
        Cookies.set(this.name, JSON.stringify(this.c), this.dur);
      } else {
        this.c = cookie;
        //console.log(this.c);
        post_class=this.c.status == 'list' ? 'k' : '' ;
        this.update_view(post_class=='k');
      }
    }

    save(status){
      this.c={ 'status':status }
      super.save()
      // console.log(this.c)
    }

    update_view() {
      if(super.get().status == 'list') {
        $('.posts article:not(.small)').addClass('k');
        post_class='k';
        $('.settings .icons a[data-elem="view-list"]').addClass("active");
        $('.settings .icons a[data-elem="view-grid"]').removeClass("active");
      } else {
        post_class='';
        $('.posts article.k').removeClass('k');
        $('.settings .icons a[data-elem="view-grid"]').addClass("active");
        $('.settings .icons a[data-elem="view-list"]').removeClass("active");
      }
    }
  };

  class ImgC extends cookieMonster {

    loadImg(url) {
      var _this = this
      $.ajax({
        url: url, 
        dataType: 'json',
        method: 'GET',
        success: function(data) {
          _this.back(data)
        },
        error: function(err) {
          _this.back({url:defaultImage})
        }
      })
    }

    check(force){
      var cookie=super.get();
      var _this = this,
          url = defaultImageSrv
          ;

      if(!cookie){
        this.loadImg(url)
      } else {
        this.c = cookie;
        if(force || this.c.ts + 3600 < new Date().getTime() / 1000) {
          this.loadImg(url)
        } else {
          this.update_view()
        }
      }
    }

    save(status){
      this.c=status
      super.save()
    }

    back(data) {
      this.save({'img': data.url, 'ts': new Date().getTime() / 1000})
      this.update_view()
    }

    update_view(data) {
      
      var _this = this,
          bgImg = new Image();

      console.log("update",Date.now())
      bgImg.src = _this.c.img;
      console.log(bgImg)

      bgImg.onload = function(){
        console.log("loaded", Date.now())
        $(top).css({"background-image":"url("+bgImg.src+"?t="+_this.c.ts+")"});
        setTimeout(function(){
          $(imgRefresh).removeClass("fa-spin");}, 400);
      };
      
    }
  };

  var sharer=function(){
    if( $('a.fa-facebook').length == 0)
      return;

    var 
      ep_fb="https://www.facebook.com/share.php",
      ep_tw="https://twitter.com/intent/tweet",
      fb_url=ep_fb+'?u='+window.location,
      tw_url=ep_tw+'?url='+window.location+'&text='+$('h1').html().replace(/ /g, '+');

    $('a.fa-facebook').attr('href', fb_url);
    $('a.fa-twitter').attr('href', tw_url);
  }


  // load classes
  var $window = $(window),
    $head = $('head'),
    $body = $('body'),
    bcm = new BC('tafbmkc'),
    vcm = new ViewC('tafvc'),
    icm = new ImgC('imgc')
    ;

  // startup checks
  icm.check();
  bookmarkSection.create();
  vcm.check();
  sharer();

  $window.on('load', function() {
    var elems = $('a[data-elem="book-mark"]');
    bcm.check();
    bookmarkSection.load(bcm);
    console.log(myheader)
    $(myheader).append(imgActions.get(['refresh']))
  });

  var refresh = {
    category: 'interaction',
    action: 'click',
    label: 'refreshImage',
    value: 1
  }

  // click handlers
  $('#top').on('click', imgRefresh, function(e){
    $(imgRefresh).addClass("fa-spin")
    ga('send', 
        'event', 
        refresh.category, 
        refresh.action, 
        refresh.label, refresh.value, null);
    icm.check(true)
  })

  var bookmark = {
    category: 'interaction',
    action: 'click',
    label: 'bookmark',
    value: 1
  }

  $(hbs_handler).on('click', function(e){
    // console.log(window.location, $(e.target).hasClass("active"), e.target);

    if( $(e.target).hasClass("active") ){
      bcm.remove(window.location.href);
      bookmarkSection.load(bcm);
      $(e.target).removeClass("active");
      $(e.target).attr('title','Save in your collection');
    }
    else {
      ga('send', 
        'event', 
        bookmark.category, 
        bookmark.action, 
        bookmark.label, bookmark.value, null);

      bcm.save(window.location.href);
      bookmarkSection.load(bcm);
      $(e.target).addClass("active");
      $(e.target).attr('title','Saved');
    }
  })

  $(s_handler).on('click', function(e){
    // console.log(window.location, $(e.target).hasClass("active"), e.target);
    if($(e.target).hasClass('rotate90'))
      $('.layer').animate({left:'0px',opacity:0.5}, 300, function(){ $('.layer').hide() }) //.hide();
    else
      $('.layer').show().animate({left:'-45px',opacity:1}, 300);
    $(e.target).toggleClass('rotate90')
  })

  $(view_handler).on('click', function(e){
    // console.log( $(e.target).attr('data-elem'), $(e.target).hasClass("active"), e.target);
    switch($(e.target).attr('data-elem')) {
      case 'view-grid': {
        vcm.save('grid');
        vcm.update_view(false);
      } break;
      case 'view-list': {
        vcm.save('list');
        vcm.update_view(true);
      } break;
    }
  })

  if(wlh.indexOf('about')!= -1 || wlh.indexOf('terms')!= -1 ) {

    var str=window.location.href.substring( window.location.href.indexOf('#')+1 )
    var elem= $( "*[name='"+str.toLowerCase()+"']" )[0];
    if(!elem)
    return
    $('html, body').animate({
      scrollTop: $(elem).offset().top
    }, { duration:1000, easing:'linear'}); 
  }

})(jQuery);