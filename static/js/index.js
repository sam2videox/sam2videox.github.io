// window.HELP_IMPROVE_VIDEOJS = false;

// var INTERP_BASE = "./static/interpolation/stacked";
// var NUM_INTERP_FRAMES = 240;

// var interp_images = [];
// function preloadInterpolationImages() {
//   for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
//     var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
//     interp_images[i] = new Image();
//     interp_images[i].src = path;
//   }
// }

// function setInterpolationImage(i) {
//   var image = interp_images[i];
//   image.ondragstart = function() { return false; };
//   image.oncontextmenu = function() { return false; };
//   $('#interpolation-image-wrapper').empty().append(image);
// }


$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 3,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    // var carousels = bulmaCarousel.attach('.carousel', options);

    // Initialize main results carousel
    var carousels = bulmaCarousel.attach('#results-carousel', options);

    var comparisonOptions = {
      slidesToScroll: 1,
      slidesToShow: 1,
      loop: true,
      infinite: true,
      autoplay: false,
      autoplaySpeed: 3000,
    }
    bulmaCarousel.attach('#comparison-carousel', comparisonOptions);
    bulmaCarousel.attach('#baseline-carousel', comparisonOptions);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		// console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		// console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    // preloadInterpolationImages();

    // $('#interpolation-slider').on('input', function(event) {
    //   setInterpolationImage(this.value);
    // });
    // setInterpolationImage(0);
    // $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    bulmaSlider.attach();

    // Lazy load + throttle auto-play videos
    // Increase this number if you want more videos to auto-play in parallel.
    var MAX_AUTO_VIDEOS = 8;
    var activeAutoVideos = new Set();

    function pauseAutoVideo(video) {
      if (!video) {
        return;
      }
      if (!video.paused) {
        video.pause();
      }
      activeAutoVideos.delete(video);
    }

    function tryAutoPlay(video) {
      if (activeAutoVideos.has(video)) {
        return;
      }
      while (activeAutoVideos.size >= MAX_AUTO_VIDEOS) {
        var first = activeAutoVideos.values().next().value;
        pauseAutoVideo(first);
      }
      // Mark as active *before* starting play to avoid races when multiple
      // videos enter the viewport at the same time.
      activeAutoVideos.add(video);
      video.play()
        .catch(function(e) {
          // If autoplay fails (e.g., browser policy), don't keep it counted
          activeAutoVideos.delete(video);
          console.log("Play error:", e);
        });
    }

    var videos = document.querySelectorAll('video');
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        var videoEl = entry.target;
        // By default, videos auto-play when visible. Set data-autoplay="false"
        // on a <video> to opt-out for specific elements.
        var shouldAutoPlay = videoEl.dataset.autoplay !== 'false';
        if (entry.isIntersecting) {
          videoEl.preload = shouldAutoPlay ? 'auto' : 'metadata';
          if (shouldAutoPlay) {
            tryAutoPlay(videoEl);
          }
        } else {
          videoEl.preload = 'none';
          if (shouldAutoPlay) {
            pauseAutoVideo(videoEl);
          } else if (!videoEl.paused) {
            videoEl.pause();
          }
        }
      });
    }, { threshold: 0.35, rootMargin: '200px' });

    videos.forEach(function(video) {
      observer.observe(video);
      video.addEventListener('pause', function() {
        if (video.dataset.autoplay !== 'false') {
          activeAutoVideos.delete(video);
        }
      });
    });
})
