(function( $, _window ){
	$.fn.bottomfloater = function( args ){
		return this.each( function(){


			var elem = $(this);
			var win = $(window);
			var data = elem.data('bottomfloater') || {};

			var options = data.options || {};
			var state = data.state || { open: false, initialized: false };

			data.showFilter = data.showFilter || function(){};
			data.hideFilter = data.hideFilter || function(){};
			data.toggleFilter = data.toggleFilter || 
						function toggleFilter( event ){
							var anim;
							// Again dont add unnecessary events to queue
							if( elem.queue().length > 1 ) {
								while( elem.queue().length > 1 )
									elem.queue().pop();
								return;
							}
							anim = state.open ? options.animations.close : options.animations.open;
							elem.animate( anim.action( elem, win ), anim.duration );
							state.open = !state.open;
							if( anim.after )
								anim.after( elem );
						}
			data.hoverFilter = data.hoverFilter 
					|| function( event ){
							var anim;
							// Make sure we aren't just mucking up the queue
							if( elem.queue().length > 1 ) {
								elem.queue().pop();
								return;
							}
							if( state.open )
								return;
							anim = options.animations[ event.type ];
							if( anim !== undefined ) {
								elem.animate( anim.action( elem, win ), anim.duration );
								if( anim.after )
									anim.after( elem );
							}
						};

			if( state.initialized )
				return;

			options = $.extend( true, {
						animations : {
								mouseenter: {
									duration: 90,
									action: function(t,w){ 
										return {
											top: [w.height() - 35, 'linear'],
											opacity: 0.4
										}; 
									}
								},
								mouseleave: {
									duration: 400,
									action: function(t,w){
										return {
											top: w.height() - 20,
											opacity: .2
										};
									}
								},
								open:  {
									duration: 300,
									action: function(t,w){
										return {
											top: w.height() - t.height(),
											left: Math.round( w.width() / 2 - t.width() / 2 ),
											opacity: .9,
										};
									},
									after: function(t){ t.children().css({opacity:1.0}); }
								},
								close:  {
									duration: 200,
									action: function(t,w){
										return {
											top: w.height() - 20, 
											left: Math.round( w.width() / 2 - t.width() / 2 ),
											opacity: .2,
										};
									},
								},
								resize: {
									duration: 0,
									action: function(t,w){
										return {
											top: w.height()-20,
											left: 0,
											height: (w.height()*0.40 > 200) ? w.height()*0.40 : 200,
											width: w.width()
										}
									}
								}
							},
							styles : {
								bottombase : {
									padding: 15,
									zIndex: 1000,
									color: 'white',
									position: 'fixed',
									backgroundColor: 'black',
									boxShadow: '0px 0px 20px #000000',
								},
							}
			}, options );

			elem.css( {visibility: 'hidden'} );

			elem.click( data.toggleFilter );
			elem.hover( data.hoverFilter );

			win.bind( 'resize', function(e){
					var css = options.animations.resize.action( elem, win );
					elem.css( options.styles.bottombase );
					elem.css( css );
			});

			state.initialized = true;

			data.state = state;
			data.options = options;
			elem.data( 'bottomfloater', data );

			win.resize();
			elem.css( {visibility: 'visible'} );


		});
	}
}(jQuery, this));
