/**
 * main.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2016, Codrops
 * http://www.codrops.com
 */
;(function(window) {

	'use strict';

	// From https://www.html5rocks.com/en/tutorials/webaudio/intro/
	function BufferLoader(context, urlList, callback) {
		this.context = context;
		this.urlList = urlList;
		this.onload = callback;
		this.bufferList = new Array();
		this.loadCount = 0;
	}

	BufferLoader.prototype.loadBuffer = function(url, index) {
		// Load buffer asynchronously
		var request = new XMLHttpRequest();
		request.open("GET", url, true);
		request.responseType = "arraybuffer";

		var loader = this;

		request.onload = function() {
			// Asynchronously decode the audio file data in request.response
			loader.context.decodeAudioData(
				request.response,
				function(buffer) {
					if (!buffer) {
						alert('error decoding file data: ' + url);
				  		return;
					}
					loader.bufferList[index] = buffer;
					if (++loader.loadCount == loader.urlList.length)
				  		loader.onload(loader.bufferList);
				},
				function(error) {
					console.error('decodeAudioData error', error);
				}
			);
		}

		request.onerror = function() {
			alert('BufferLoader: XHR error');
		}

		request.send();
	}

	BufferLoader.prototype.load = function() {
		for (var i = 0; i < this.urlList.length; ++i)
		this.loadBuffer(this.urlList[i], i);
	}

	// Check if clip-path is supported. From http://stackoverflow.com/a/30041538.
	function areClipPathShapesSupported() {
		var base = 'clipPath',
			prefixes = [ 'webkit', 'moz', 'ms', 'o' ],
			properties = [ base ],
			testElement = document.createElement( 'testelement' ),
			attribute = 'polygon(50% 0%, 0% 100%, 100% 100%)';

		// Push the prefixed properties into the array of properties.
		for ( var i = 0, l = prefixes.length; i < l; i++ ) {
			var prefixedProperty = prefixes[i] + base.charAt( 0 ).toUpperCase() + base.slice( 1 ); // remember to capitalize!
			properties.push( prefixedProperty );
		}

		// Interate over the properties and see if they pass two tests.
		for ( var i = 0, l = properties.length; i < l; i++ ) {
			var property = properties[i];

			// First, they need to even support clip-path (IE <= 11 does not)...
			if ( testElement.style[property] === '' ) {

				// Second, we need to see what happens when we try to create a CSS shape...
				testElement.style[property] = attribute;
				if ( testElement.style[property] !== '' ) {
					return true;
				}
			}
		}
		return false;
	};

	// Detect mobile. From: http://stackoverflow.com/a/11381730/989439
	function mobilecheck() {
		var check = false;
		(function(a){if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
		return check;
	}

	// Closest ancestor element that has a specific class. From: http://stackoverflow.com/a/22119674
	function findAncestor(el, cls) {
		while ((el = el.parentElement) && !el.classList.contains(cls));
		return el;
	}
	// getElementById shorthand function.
	function $(id) { return document.getElementById(id); };
	
	function createShakeFx(mediaEl, contentEl) {
		var clone1 = mediaEl.cloneNode(true);
		clone1.classList.add('clone');
		clone1.querySelector('.pop-media__overlay').style.background = 'rgba(0,255,255,.6)';
		
		var clone2 = mediaEl.cloneNode(true);
		clone2.classList.add('clone');
		clone2.querySelector('.pop-media__overlay').style.background = 'rgba(255,0,255,.6)';
		
		contentEl.insertBefore(clone1, mediaEl);
		contentEl.insertBefore(clone2, mediaEl);

		var steps = 4, step = 0,
			recursiveShakeFn = function(el, direction, step) {
				step = step || 0;
				anime({
					targets: el,
					duration: 50,
					easing: 'linear',
					translateX: function() {
						if( step === 0 ) {
							return direction === 'normal' ? [8,-8] : [-8,8];
						}
						else if( step === 1 ) {
							return direction === 'normal' ? [-8,-8] : [8,8];
						}
						else if( step === 2 ) {
							return direction === 'normal' ? [-8,8] : [8,-8];
						}
						else if( step === 3 ) {
							return direction === 'normal' ? [8,8] : [-8,-8];
						}
					},
					translateY: function() {
						if( step === 0 ) {
							return direction === 'normal' ? [-8,8] : [8,-8];
						}
						else if( step === 1 ) {
							return direction === 'normal' ? [8,-8] : [-8,8];
						}
						else if( step === 2 ) {
							return direction === 'normal' ? [-8,8] : [8,-8];
						}
						else if( step === 3 ) {
							return direction === 'normal' ? [8,-8] : [-8,8];
						}
					},
					complete: function() {
						step = step < steps-1 ? step+1 : 0;
						recursiveShakeFn(el, direction, step);
					}
				});
			};

		recursiveShakeFn(clone1, 'normal');
		recursiveShakeFn(clone2, 'reverse');

		clone1.style.opacity = .5;
		clone2.style.opacity = .5;
	}

	function Slideshow(el) {
		this.el = el;
		this.slides = this.el.children;
		this.slidesTotal = this.slides.length;
		this.current = 0;
	}

	Slideshow.prototype.start = function() {
		this._next();
		this._loop();
	};

	Slideshow.prototype.stop = function() {
		clearTimeout(this.slideshowtime);
	};

	Slideshow.prototype._loop = function() {
		var self = this;
		clearTimeout(this.slideshowtime);
		this.slideshowtime = setTimeout(function() {
			self._next();
			self._loop();
		}, 500);
	};

	Slideshow.prototype._next = function() {
		this.slides[this.current].classList.remove('pop-media__slide--current');
		this.current = this.current < this.slidesTotal - 1 ? this.current + 1 : 0;
		this.slides[this.current].classList.add('pop-media__slide--current');
	};

	function MediaRevealer(el) {
		this.el = el;
		this.contentEl = findAncestor(this.el, 'content');
		this.mediaEl = this.contentEl.querySelector('.pop-media[data-pop-media="' + this.el.getAttribute('data-pop-media') + '"]');

		// Check if any data-pop-width and data-pop-height values were passed.
		var w = 0, h = 0;
		if( this.mediaEl.getAttribute('data-pop-width') != undefined ) {
			w = this.mediaEl.getAttribute('data-pop-width') + 'px';
		}
		if( this.mediaEl.getAttribute('data-pop-height') != undefined ) {
			h = this.mediaEl.getAttribute('data-pop-height') + 'px';
		}

		/* Special cases */
		var self = this;
		// Video:
		if( this.mediaEl.tagName.toLowerCase() === 'video' ) {
			this.plyr = findAncestor(this.mediaEl, 'plyr') || this.mediaEl.parentNode;
			this.plyr.addEventListener('canplay', function() {
				player.setVolume(0);
				self.plyrReady = true;
			});
			this.plyr.addEventListener('ended', function() {
				player.seek(0);
				player.play();
			});
		}
		// Slideshow:
		else if( this.mediaEl.classList.contains('pop-media--slideshow') ) {
			this.slideshow = new Slideshow(this.mediaEl);
		}
		// Audio (Audio API):
		else if( this.mediaEl.classList.contains('pop-media--audio') ) {
			this._createAudio();
		}

		this.mediaEl.style.width = w ? w : null;
		this.mediaEl.style.height = h ? h : null;
	}

	MediaRevealer.prototype._createAudio = function() {
		var self = this, bufferLoader = null;
		bufferLoader = new BufferLoader(context, ['mp3/song1.mp3'], function(bufferList) {
			self.bufferList = bufferList;
		});
		bufferLoader.load();
	};
	MediaRevealer.prototype.playAudio = function() {
		this.audioStopped = false;
		if( this.bufferList ) {
			this.audio = context.createBufferSource();
			this.audio.buffer = this.bufferList[0];
			this.gainNode = context.createGain();
			this.audio.connect(this.gainNode);
			this.gainNode.connect(context.destination);
			this.gainNode.gain.value = 0.4;
			this.audio.start(0);

			var self = this;
			this.audio.onended = function() {
				if( !self.audioStopped ) {
					self.playAudio();
				}
			}
		}
	};
	MediaRevealer.prototype.stopAudio = function() {
		if( this.bufferList && this.audio ) {
			this.audio.stop(0);
			this.audioStopped = true;
		}
	};

	MediaRevealer.prototype.positionMedia = function() {
		var elOffset = this.el.getBoundingClientRect(), 
			contentOffset = this.contentEl.getBoundingClientRect();

		this.mediaEl.style.top = parseFloat((elOffset.top + this.el.offsetHeight/2) - contentOffset.top - this.mediaEl.offsetHeight/2) + 'px';
		this.mediaEl.style.left = parseFloat((elOffset.left + this.el.offsetWidth/2) - contentOffset.left - this.mediaEl.offsetWidth/2) + 'px';
	};

	MediaRevealer.prototype.resetMedia = function() {
		this.mediaEl.style.WebkitTransform = this.mediaEl.style.transform = 'none';
		this.mediaEl.style.opacity = 0;
	};

	function init() {
		// Preload all images.
		imagesLoaded(document.querySelector('.content'), { background: true }, function() {
			document.body.classList.remove('loading');
			initEvents();
		});
	}

	function initEvents() {
		var isMobile = mobilecheck(),
			evOn = !isMobile ? 'mouseenter' : 'touchstart',
			evOff = !isMobile ? 'mouseleave' : 'touchend';
		
		/**
		 * Non optimal code For demo purposes only:
		 */
		/**************************** effect1 ****************************/
		var t1 = new MediaRevealer($('trigger-1'));
		t1.el.addEventListener(evOn, function(ev) {
			clearTimeout(triggertimeout);
			triggertimeout = setTimeout(function() {
				t1.positionMedia();
				t1.mediaEl.style.opacity = 1;
			}, triggerdelay);
		});
		t1.el.addEventListener(evOff, function(ev) {
			clearTimeout(triggertimeout);
			t1.resetMedia();
		});

		/**************************** effect2 ****************************/
		var t2 = new MediaRevealer($('trigger-2'));
		t2.el.addEventListener(evOn, function(ev) {
			clearTimeout(triggertimeout);
			triggertimeout = setTimeout(function() {
				anime.remove(t2.mediaEl);
				t2.positionMedia();
				t2.mediaEl.style.opacity = 1;	
				createShakeFx(t2.mediaEl, t2.contentEl);
			}, triggerdelay);
		});
		t2.el.addEventListener(evOff, function(ev) {
			clearTimeout(triggertimeout);
			anime.remove(t2.mediaEl);
			t2.resetMedia();
			[].slice.call(t2.contentEl.querySelectorAll('.clone')).forEach(function(clone) {
				t2.contentEl.removeChild(clone);
			});
		});

		/**************************** effect3 ****************************/
		var t3 = new MediaRevealer($('trigger-3'));
		t3.el.addEventListener(evOn, function(ev) {
			clearTimeout(triggertimeout);
			triggertimeout = setTimeout(function() {	
				anime.remove(t3.mediaEl);
				t3.positionMedia();
				anime({
					targets: t3.mediaEl,
					duration: 600,
					easing: 'easeOutElastic',
					opacity: {
						duration: 50,
						value: 1,
						easing: 'easeOutExpo',
					},
					scale: [0.5,1]
				});
			}, triggerdelay);
		});
		t3.el.addEventListener(evOff, function(ev) {
			clearTimeout(triggertimeout);
			anime.remove(t3.mediaEl);
			t3.resetMedia();
		});

		/**************************** effect4 ****************************/
		var t4 = new MediaRevealer($('trigger-4'));
		t4.el.addEventListener(evOn, function(ev) {
			clearTimeout(triggertimeout);
			triggertimeout = setTimeout(function() {
				t4.positionMedia();
				t4.mediaEl.style.opacity = 1;
				t4.mediaEl.style.WebkitTransform = t4.mediaEl.style.transform = 'rotate3d(0,0,1,-20deg)';
			}, triggerdelay);
		});
		t4.el.addEventListener(evOff, function(ev) {
			clearTimeout(triggertimeout);
			t4.resetMedia();
		});

		/**************************** effect5 ****************************/
		var t5 = new MediaRevealer($('trigger-5'));
		t5.el.addEventListener(evOn, function(ev) {
			clearTimeout(triggertimeout);
			triggertimeout = setTimeout(function() {
				anime.remove(t5.mediaEl);
				t5.positionMedia();
				anime({
					targets: t5.mediaEl,
					duration: 900,
					easing: 'easeOutElastic',
					opacity: {
						duration: 50,
						value: 1,
						easing: 'easeOutExpo',
					},
					rotateZ: [-50,0]
				});
			}, triggerdelay);
		});
		t5.el.addEventListener(evOff, function(ev) {
			clearTimeout(triggertimeout);
			anime.remove(t5.mediaEl);
			t5.resetMedia();
		});

		/**************************** effect6 ****************************/
		var t6 = new MediaRevealer($('trigger-6'));
		t6.el.addEventListener(evOn, function(ev) {
			clearTimeout(triggertimeout);
			triggertimeout = setTimeout(function() {
				anime.remove(t6.mediaEl);
				t6.positionMedia();
				anime({
					targets: t6.mediaEl,
					duration: 500,
					easing: 'easeOutExpo',
					opacity: {
						duration: 50,
						value: 1,
						easing: 'easeOutExpo',
					},
					translateY: [30,0]
				});
				t6.slideshow.start();
			}, triggerdelay);
		});
		t6.el.addEventListener(evOff, function(ev) {
			clearTimeout(triggertimeout);
			anime.remove(t6.mediaEl);
			t6.slideshow.stop();
			t6.resetMedia();
		});

		/**************************** effect7 - video ****************************/
		var t7 = new MediaRevealer($('trigger-7'));
		t7.el.addEventListener(evOn, function(ev) {
			clearTimeout(triggertimeout);
			triggertimeout = setTimeout(function() {
				t7.positionMedia();
				t7.mediaEl.style.opacity = 1;
				player.play();
			}, triggerdelay);
		});
		t7.el.addEventListener(evOff, function(ev) {
			clearTimeout(triggertimeout);
			t7.resetMedia();
			player.pause();
		});

		/**************************** effect8 - css mask ****************************/
		var t8 = new MediaRevealer($('trigger-8'));
		t8.el.addEventListener(evOn, function(ev) {
			clearTimeout(triggertimeout);
			triggertimeout = setTimeout(function() {
				t8.positionMedia();
				t8.mediaEl.style.opacity = 1;
				t8.mediaEl.classList.add('pop-media--show');
			}, triggerdelay);
		});
		t8.el.addEventListener(evOff, function(ev) {
			clearTimeout(triggertimeout);
			t8.resetMedia();
			t8.mediaEl.classList.remove('pop-media--show');
		});

		/**************************** effect9 - Fullscreen ****************************/
		var t9 = new MediaRevealer($('trigger-9'));
		t9.el.addEventListener(evOn, function(ev) {
			clearTimeout(triggertimeout);
			triggertimeout = setTimeout(function() {
				t9.positionMedia();
				t9.mediaEl.style.opacity = 1;
				t9.mediaEl.style.top = 0;
				t9.mediaEl.style.left = 0;
			}, triggerdelay);
		});
		t9.el.addEventListener(evOff, function(ev) {
			clearTimeout(triggertimeout);
			t9.resetMedia();
		});

		/**************************** effect10 - audio api ****************************/
		var t10 = new MediaRevealer($('trigger-10'));
		t10.el.addEventListener(evOn, function(ev) {
			clearTimeout(triggertimeout);
			triggertimeout = setTimeout(function() {
				anime.remove(t10.mediaEl);
				t10.positionMedia();
				t10.mediaEl.style.opacity = 1;
				anime({
					targets: t10.mediaEl,
					duration: 1000,
					easing: 'linear',
					rotateZ: 360,
					loop: true
				});
				t10.playAudio();
			}, triggerdelay);
		});
		t10.el.addEventListener(evOff, function(ev) {
			clearTimeout(triggertimeout);
			anime.remove(t10.mediaEl);
			t10.resetMedia();
			t10.stopAudio();
		});

		/**************************** effect11 - Fullscreen Text ****************************/
		var t11 = new MediaRevealer($('trigger-11'));
		t11.el.addEventListener(evOn, function(ev) {
			clearTimeout(triggertimeout);
			triggertimeout = setTimeout(function() {
				t11.positionMedia();
				t11.mediaEl.style.opacity = 1;
			}, triggerdelay);
		});
		t11.el.addEventListener(evOff, function(ev) {
			clearTimeout(triggertimeout);
			t11.resetMedia();
		});

		/**************************** effect12 - css mask ****************************/
		var t12 = new MediaRevealer($('trigger-12'));
		t12.el.addEventListener(evOn, function(ev) {
			clearTimeout(triggertimeout);
			triggertimeout = setTimeout(function() {
				t12.positionMedia();
				t12.mediaEl.style.opacity = 1;
				t12.mediaEl.classList.add('pop-media--show');
			}, triggerdelay);
		});
		t12.el.addEventListener(evOff, function(ev) {
			clearTimeout(triggertimeout);
			t12.resetMedia();
			t12.mediaEl.classList.remove('pop-media--show');
		});

		/**************************** effect13 - css mask ****************************/
		var t13 = new MediaRevealer($('trigger-13'));
		t13.el.addEventListener(evOn, function(ev) {
			clearTimeout(triggertimeout);
			triggertimeout = setTimeout(function() {
				t13.positionMedia();
				t13.mediaEl.style.opacity = 1;
				t13.mediaEl.style.top = 0;
				t13.mediaEl.style.left = 0;
				t13.mediaEl.classList.add('pop-media--show');
			}, triggerdelay);
		});
		t13.el.addEventListener(evOff, function(ev) {
			clearTimeout(triggertimeout);
			t13.resetMedia();
			t13.mediaEl.classList.remove('pop-media--show');
		});

		/**************************** effect14 ****************************/
		var t14 = new MediaRevealer($('trigger-14'));
		t14.el.addEventListener(evOn, function(ev) {
			clearTimeout(triggertimeout);
			triggertimeout = setTimeout(function() {
				anime.remove(t14.mediaEl);
				t14.resetMedia();
				t14.positionMedia();
				t14.mediaEl.style.opacity = 1;
				anime({
					targets: t14.mediaEl,
					duration: 800,
					easing: 'easeOutElastic',
					translateX: [window.innerWidth,0],
					
				});
			}, triggerdelay);
		});
		t14.el.addEventListener(evOff, function(ev) {
			clearTimeout(triggertimeout);
			anime.remove(t14.mediaEl);
			anime({
				targets: t14.mediaEl,
				duration: 400,
				easing: 'easeInBack',
				translateX: window.innerWidth,
				complete: function() {
					t14.mediaEl.style.opacity = 0;
				}
			});
		});

		/**************************** effect15 ****************************/
		var t15 = new MediaRevealer($('trigger-15'));
		t15.el.addEventListener(evOn, function(ev) {
			clearTimeout(triggertimeout);
			triggertimeout = setTimeout(function() {
				t15.positionMedia();
				t15.mediaEl.style.opacity = 1;
			}, triggerdelay);
		});
		t15.el.addEventListener(evOff, function(ev) {
			clearTimeout(triggertimeout);
			t15.resetMedia();
		});

		/**************************** effect16 ****************************/
		var t16 = new MediaRevealer($('trigger-16'));
		t16.el.addEventListener(evOn, function(ev) {
			clearTimeout(triggertimeout);
			triggertimeout = setTimeout(function() {
				t16.positionMedia();
				t16.mediaEl.style.opacity = 1;
				t16.mediaEl.style.top = 0;
				t16.mediaEl.style.left = 0;
				t16.mediaEl.classList.add('pop-media--show');
			}, triggerdelay);
		});
		t16.el.addEventListener(evOff, function(ev) {
			clearTimeout(triggertimeout);
			t16.resetMedia();
			t16.mediaEl.classList.remove('pop-media--show');
		});

		/**************************** effect17 ****************************/
		var t17 = new MediaRevealer($('trigger-17'));
		t17.el.addEventListener(evOn, function(ev) {
			clearTimeout(triggertimeout);
			triggertimeout = setTimeout(function() {
				t17.el.style.opacity = 0;
				t17.positionMedia();
				t17.mediaEl.style.opacity = 1;
				t17.mediaEl.classList.add('pop-media--show');
			}, triggerdelay);
		});
		t17.el.addEventListener(evOff, function(ev) {
			clearTimeout(triggertimeout);
			t17.el.style.opacity = 1;
			t17.resetMedia();
			t17.mediaEl.classList.remove('pop-media--show');
		});

		var touchStartFix = function() {
			var buffer = context.createBuffer(1, 1, 22050);
			var source = context.createBufferSource();

			source.buffer = buffer;
			source.connect(context.destination);
			source.start(0);
			window.removeEventListener('touchstart', self.touchStartFix);
		};
		window.addEventListener('touchstart', touchStartFix);
	}

	if( areClipPathShapesSupported() ) {
		document.body.classList.add('clip-path-polygon');
	}

	// setTimeouts for the mouseenter events.
	var triggertimeout, triggerdelay = 50;
	
	// Audio related.
	window.AudioContext = window.AudioContext||window.webkitAudioContext;
	var context = new AudioContext();

	// Video related.
	var players = plyr.setup({
			controls : [],
			clickToPlay : false,
			autoplay: true // For demo purposes only: Autoplay the media on load. This is generally advised against on UX grounds. It is also disabled on iOS (an Apple limitation).
		}), player = players[0].plyr;

	init();

})(window);