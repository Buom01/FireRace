$(function() {
    refreshHash = function(e) {
        var hash = window.location.hash.replace(/^#!/, '');
        if (hash == "equipe" || presentationMode) {
            console.log('membres');
            $(".membres").owlCarousel({
                center: true,
                items: 4,
                autoplay: true,
                autoplayTimeout: 5000,
                loop: true
            });
        }
        if (hash == 'index' || hash == '') {
            if (WebGlWorks) {
                if (e) {
                    loopSound.play();
                }
                viewEnable = true;
                render();
            }
            $('.page#index .title > img').css('visibility', 'visible')
            window.setTimeout(function() {
                $('.page#index .title > img').removeClass('animated');
            }, 1500);

            $('.page#index h1').textillate({ in : {
                    effect: 'rollIn',
                    callback: function() {
                        $('.page#index h2').textillate({ in : {
                                delay: 35,
                                effect: 'zoomIn'
                            }
                        });
                    }
                }
            });
        } else {
            if (WebGlWorks) {
                viewEnable = false;
                if (startSound.isPlaying) startSound.stop();
                if (loopSound.isPlaying) loopSound.stop();
                window.clearTimeout(loopSoundTimeout);
            }
        }
    };
    startMain = function() {
        if (presentationMode) {
            $('.noPresentation').remove();
            $('#presentation').show();
            $(window).resize();
            $('body').addClass('presentation');
            $('.membres_presentation').html($('.membres_page').html());
        }
        refreshHash();
        $('nav a').click(refreshHash);
        window.onhashchange = refreshHash;
        $('nav a').each(function(nb, elem) {
            setTimeout(function() {
                $(elem).css('visibility', 'visible').addClass('animated lightSpeedIn');
            }, 500 * nb);
        });
    };
});
