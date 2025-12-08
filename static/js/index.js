$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var comparisonOptions = {
      slidesToScroll: 1,
      slidesToShow: 1,
      loop: true,
      infinite: true,
      autoplay: false,
      autoplaySpeed: 3000,
    }
    bulmaCarousel.attach('#comparison-carousel', comparisonOptions);

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
