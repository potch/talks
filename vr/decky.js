var deck = (function() {
    var slides = Array.prototype.slice.apply(document.querySelectorAll('section')),
        numSlides = slides.length,
        initCurrent = parseInt(window.location.hash.substr(1), 10) || 1,
        current = -1,
        currentSlide = slides[current - 1],
        subSlide = 0,
        doc = document,
        deckEl = document.querySelector('#deck'),
        body = document.body;

    for (var i=0; i<slides.length; i++) {
        slides[i].setAttribute('id', i+1);
    }
    document.addEventListener('keydown', function(e) {
        switch (e.which) {
            case 37:
            case 38:
                prev();
                e.preventDefault();
                e.stopPropagation();
                break;
            case 32:
            case 39:
            case 40:
                next();
                e.preventDefault();
                e.stopPropagation();
                break;
        }
    });

    function next() {
        goto(current+1);
    }

    function prev() {
        goto(current-1);
    }

    function goto(n) {
        if (n !== current) {
            subSlide++;
            var subSlides;
            var i;
            if (currentSlide) {
              subSlides = currentSlide.querySelectorAll('[subslide="' + subSlide + '"]');
            } else {
              subSlides = [];
            }
            if (n - current === 1 &&
                subSlides.length) {
                for (i = 0; i < subSlides.length; i++) {
                  subSlides[i].style.visibility = 'visible';
                }
            } else {
                n = n < 1 ? 1 : (n > numSlides ? numSlides : n);
                if (n == current) return;
                subSlides = currentSlide ? currentSlide.querySelectorAll('[subslide]') : [];
                for (i = 0; i < subSlides.length; i++) {
                  subSlides[i].style.visibility = 'hidden';
                }
                current = n;
                subSlide = 0;
                currentSlide = slides[current-1];
                for (i = 0; i<numSlides; i++) {
                    var s = slides[i];
                    s.classList.remove('active');
                    if (i < current-1) {
                        s.setAttribute('data-pos', 'before');
                    } else if (i > current-1) {
                        s.setAttribute('data-pos', 'after');
                    } else {
                        s.setAttribute('data-pos', 'active');
                        s.classList.add('active');
                    }
                }
                window.location.hash = '#' + current;
                deckEl.scrollTop = 0;
                deckEl.scrollLeft = 0;
            }
        }
    }

    window.addEventListener("hashchange", function(e) {
        e.preventDefault();
        e.stopPropagation();
        var newSlide = parseInt(window.location.hash.substr(1), 10);
        if (newSlide && newSlide != current) {
            goto(newSlide);
        }
    });
    function toggleFullScreen() {
        if (window.fullScreen) {
            body.mozCancelFullScreen();
        } else {
            body.mozRequestFullScreen();
        }
    }

    function init() {
        var menu = doc.createElement('menu');
        var item = doc.createElement('menuitem');
        menu.setAttribute('id', 'fsmenu');
        menu.setAttribute('type', 'context');
        item.setAttribute('label', 'Fullscreen');
        item.addEventListener('click', toggleFullScreen);
        menu.appendChild(item);
        body.appendChild(menu);
        body.setAttribute('contextmenu', 'fsmenu');
        goto(initCurrent);
    }

    init();

    return {
        next: next,
        prev: prev,
        fullScreen: toggleFullScreen
    };
})();
