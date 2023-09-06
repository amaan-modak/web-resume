
var loc = window.location.href,
    index = loc.indexOf('#');

if (index > 0) {
  window.location = loc.substring(0, index);
}

$.fn.exists = function () {
    return this.length > 0 ? this : false;
}

$(document).ready(function(){

	/*++++++++++++++++++++++++++++++++++++
		tooltips
	++++++++++++++++++++++++++++++++++++++*/
	$(".tooltips").tooltip();


	/*++++++++++++++++++++++++++++++++++++
		slidepage
	++++++++++++++++++++++++++++++++++++++*/
	var SidebarAnim = new TimelineLite({paused:true});
	SidebarAnim
		.to($(".social-icons, #main-nav"),0.2,{left:0})
		.to($("#main"),0.2,{left:250,right:"-=250"},"-=0.2");
	

	$("a.mobilemenu").on("click",function(e){
		e.preventDefault();
		SidebarAnim.play();
	});
	$(".social-icons, #main-nav, #main").on("click",function(){
		SidebarAnim.reverse();		
	});


	/*++++++++++++++++++++++++++++++++++++++++++++++
		custom scrolls with perfectScroll plugin
	++++++++++++++++++++++++++++++++++++++++++++++++*/
	$("#main-nav").perfectScrollbar({
		wheelPropagation:true,
		wheelSpeed:80
	});

	
	

	/*++++++++++++++++++++++++++++++++++++
		pages 
	++++++++++++++++++++++++++++++++++++++*/
	var pager = {
		pageContainer : $("div#main"),
		pages : $("div.page"),
		menuItems: $("ul#navigation"),
		portrait: $("div#profile"),
		overlay : $("div#overlay"),
		topz : "500",
		init: function(){

			self = this;
			self.menuItems.on('click','li:not(.external)', function(e){
				
				e.preventDefault();
				var $li = $(this),
					$target = $($li.children('a').attr('href')),
					currentPosition = $target.attr('data-pos'),
					$secondary = self.pageContainer.children(".currentpage");

				switch (currentPosition){
					case "home" :
						self.reset();
						break;
					case "project" :
						self.forward($target,$secondary);
						break;
					case "p1" :
						self.forward($target,$secondary);
						break;
					case "p3" :
						if ( parseInt($target.attr('data-order')) === self.maxz() )
						{	
							// var $gotop2 = $target,
							// 	$gotop1 = $secondary;
							self.backward($target,$secondary);
						} else {
							self.forward($target,$secondary);
						}
					break;
					default:
						return false;
				}
			});

			self.portrait.on('click',function(e){
				
				e.preventDefault();
				var $li = $(this),
					$target = $($li.children('a').attr('href')),
					currentPosition = $target.attr('data-pos');
					
				switch (currentPosition){
					case "home" :
						self.reset();
						break;
					default:
						return false;
				}
			});

			self.overlay.on('click',function(){
				var $secondary = self.pageContainer.children(".currentpage");
				var $target = self.pageContainer.children("[data-order="+self.maxz()+"]");
				self.backward($target,$secondary);
			});

		},

		reset : function (){

			this.overlay.hide();
			
			var $gotop1 = this.pages.not(".home");
			$gotop1.attr('data-pos','p1').removeAttr('data-order');
			TweenLite.to($gotop1,0.4,{left:"100%",zIndex:0, onComplete:function(){
				$gotop1.removeClass('currentpage');	
			}});

			this.handleMenu();
		},

		forward : function(gotop2 , /* optional */ gotop3){
			
			

			self.handleMenu(gotop2);
			self.overlay.show();
			var maxz = self.maxz();
			gotop2.addClass('currentpage');
			gotop2.attr('data-pos','p2').removeAttr('data-order');
			gotop3.attr('data-pos','p3').attr('data-order',maxz+1);
			

			( new TimelineLite() )
				.set(gotop2,{ left:"100%",zIndex:self.topz})
				.set(gotop3,{zIndex:maxz+1})
				.to(gotop2,0.4,{left:"15%"})
				.to(gotop3,0.3,{ left:0 , onComplete:function(){gotop3.removeClass('currentpage');} },"-=0.2");
		},

		backward : function (gotop2,gotop1){
			

			this.handleMenu(gotop2);
			gotop2.exists() || this.overlay.hide();
			gotop2.addClass('currentpage').removeAttr('data-order').attr('data-pos',"p2");
			gotop1.attr('data-pos','p1');

			(new TimelineLite())
				.set(gotop2,{zIndex:self.topz-1})
				.to(gotop2,0.4,{left:"15%"})
				.to(gotop1,0.5,
					{
						left:"100%",
						onComplete : function(){
							gotop1.removeClass('currentpage');
						}
					},"-=0.3")
				.set(gotop1,{zIndex:0});

		},

		maxz : function(){
			
			var levelArray = this.pages.map( function() {
			    return $(this).attr('data-order');
			}).get();
			maxz = levelArray.length && Math.max.apply( Math, levelArray );
			return maxz;
		},

		handleMenu : function(){
			

			var menuIndex = ( arguments.length ) ? ( (arguments[0].length) ? arguments[0].index() : 0 ):0;

			this.menuItems.children().eq(menuIndex)
				.addClass('currentmenu')
				.siblings().removeClass('currentmenu');
			

		}
	}



	pager.reset();
	pager.init();


	/*++++++++++++++++++++++++++++++++++++
		ul-withdetails details show/hide
	++++++++++++++++++++++++++++++++++++++*/
	$("ul.ul-withdetails li").find(".row").on('click',function(){
		// $this = $(this);
		$(this).closest("li").find(".details")
	        .stop(true, true)
	        .animate({
	            height:"toggle",
	            opacity:"toggle"
	        },300);
	}).on('mouseenter',function(){
		$this = $(this);
		var anim = new TweenLite($(this).closest("li").find(".imageoverlay"),0.4,{left:0});
	}).on('mouseleave', function(){
		var anim = new TweenLite($(this).closest("li").find(".imageoverlay"),0.2,{left:"-102%"});
	});


});