/*
		<section>
			<header class="major">
				<h2>Bookmarks</h2>
			</header>
			<div class="mini-posts">
					<a href="/tag/history-exopolitics-18">
					<h3>History &amp; Exopolitics <small>(1)</small></h3>
					</a>
					<a href="/tag/discover">
					<h3>Discover <small>(1)</small></h3>
					</a>
					<a href="/tag/alternative-news">
					<h3>Alternative News <small>(1)</small></h3>
					</a>
			</div>
		</section>
 */
(function($) {

	var bookmarkSection={
		e:$('<section class="bookmark-box"><header class="major"><h2>Bookmarks</h2></header><div class="mini-posts"></div></section>'),
		s:'.bookmark-box .mini-posts',
		create:function(){
			if( $(this.s).length == 0 )
				$(this.e).insertAfter('#sidebar #menu')
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
		check:function(){
			var cookie=Cookies.get('tafbmkc');
			if(!cookie){
				this.c={ 'created':Date.now(),'links':[] }
				Cookies.set('tafbmkc', JSON.stringify(this.c));
			} else {
				this.c = JSON.parse(cookie);
				console.log(this.c)
				var li;
				for(var i in this.c.links) {
					li=this.c.links[i]
					if(li.url===window.location.href) {
						 $('a[data-elem="book-mark"]').addClass('active');
					}
				}
			}
		},
		save:function(link){
			this.c.links.push({'add':Date.now(),'url':link,'name':$('h1').html()})
			console.log(JSON.stringify(this.c))
			Cookies.set('tafbmkc', JSON.stringify(this.c));
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
			Cookies.set('tafbmkc', JSON.stringify(this.c));
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

	$('a[data-elem="book-mark"]').on('click', function(e){
		console.log(window.location, $(e.target).hasClass("active"), e.target);
		if( $(e.target).hasClass("active") ){
			cookieMonster.remove(window.location.href);
			bookmarkSection.load(cookieMonster);
			$(e.target).removeClass("active");
		}
		else {
			cookieMonster.save(window.location.href);
			bookmarkSection.load(cookieMonster);
			$(e.target).addClass("active");
		}
	})

})(jQuery);