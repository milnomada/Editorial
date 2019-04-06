/*
	bookmark.js
	A crispy bookmark section for the [Ghost Editorial theme]
	Adds a font-awesome bookmart at the top right of the post area.

	Needs custom.css file to be in the project theme/assets too. 

	Author: <karlos@milnomada.io>
	Version: 0.1
 */
(function($) {

	var hbs_handler='a[data-elem="book-mark"]',
			s_handler='img.share';

	var bookmarkSection={
		e:$('<section class="bookmark-box"><header class="major"><h2>Bookmarks</h2></header><div class="mini-posts"></div></section>'),
		s:'.bookmark-box .mini-posts',
		create:function(){
			if( $(this.s).length == 0 )
				$(this.e).insertAfter('#sidebar .search')
		},
		load:function(cm){
			var to=$(this.s), ls=cm.list();
			to.html("");
			if(ls.length > 0) {
				ls.map(function(e, i){
					console.log(e);
					var html='<div class="bm"><span class="date">'+ (new Date(e.add)).toDateString() +'</span></br><a class="ln" href="'+e.url+'"><small>'+e.name+'</small></a></div>';
					to.append(html);
				})
			} else {
				var html='<span>You added no bookmarks still</span>';
				to.append(html);
			}
		}
	};

	var cookieMonster={
		c:null,
		dur: { expires: 365 },
		check:function(){
			var cookie=Cookies.get('tafbmkc');
			if(!cookie){
				this.c={ 'created':Date.now(),'links':[] }
				Cookies.set('tafbmkc', JSON.stringify(this.c), this.dur);
			} else {
				this.c = JSON.parse(cookie);
				console.log(this.c)
				var li;
				for(var i in this.c.links) {
					li=this.c.links[i]
					if(li.url===window.location.href) {
						 $('a[data-elem="book-mark"]').addClass('active');
						 $('a[data-elem="book-mark"]').attr('title','Saved');
					}
				}
			}
		},
		save:function(link){
			this.c.links.push({'add':Date.now(),'url':link,'name':$('h1').html()})
			console.log(JSON.stringify(this.c))
			Cookies.set('tafbmkc', JSON.stringify(this.c), this.dur);
			console.log(this.c)
		},
		remove:function(link){
			var li;
			for(var i in this.c.links) {
				li=this.c.links.shift()
				if(li.url != link)
					this.c.links.push(li)
			}
			console.log(JSON.stringify(this.c))
			Cookies.set('tafbmkc', JSON.stringify(this.c), this.dur);
			console.log(this.c)
		},
		list:function(){
			return this.c.links;
		}
	};

	var	$window = $(window),
		$head = $('head'),
		$body = $('body');
	
	bookmarkSection.create();

	$window.on('load', function() {
		var elems = $('a[data-elem="book-mark"]');
		console.log(elems);
		console.log("Found " + elems + " in this page");
		cookieMonster.check();
		bookmarkSection.load(cookieMonster);
	});

	$(hbs_handler).on('click', function(e){
		console.log(window.location, $(e.target).hasClass("active"), e.target);
		if( $(e.target).hasClass("active") ){
			cookieMonster.remove(window.location.href);
			bookmarkSection.load(cookieMonster);
			$(e.target).removeClass("active");
			$(e.target).attr('title','Save in your collection');
		}
		else {
			cookieMonster.save(window.location.href);
			bookmarkSection.load(cookieMonster);
			$(e.target).addClass("active");
			$(e.target).attr('title','Saved');
		}
	})

	var sharer=function(){
		var 
		  ep_fb="https://www.facebook.com/share.php",
		  ep_tw="https://twitter.com/intent/tweet",
			fb_url=ep_fb+'?u='+window.location,
			tw_url=ep_tw+'?url='+window.location+'&text='+$('h1').html().replace(/ /g, '+');

		$('a.fa-facebook').attr('href', fb_url);
		$('a.fa-twitter').attr('href', tw_url);
	}

	sharer();

	$(s_handler).on('click', function(e){
		console.log(window.location, $(e.target).hasClass("active"), e.target);

		if($(e.target).hasClass('rotate90'))
			$('.layer').animate({left:'0px',opacity:0.5}, 300, function(){ $('.layer').hide() }) //.hide();
		else
			$('.layer').show().animate({left:'-45px',opacity:1}, 300);

		$(e.target).toggleClass('rotate90')

	})

})(jQuery);