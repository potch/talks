var deck = (function() {
    var slides = µ('section'),
        numSlides = slides.length,
        initCurrent = parseInt(window.location.hash.substr(1), 10) || 1,
        current = -1,
        currentSlide = slides[current-1];
        subSlide = 0,
        listMode = false,
        doc = document,
        body = µ("body"),
        exports = {};

    for (var i=0; i<slides.length; i++) {
        µ(slides[i]).attr({'id': i+1});
    }
    // body.delegate('click', 'section', next);
    µ("section a").on('click', function(e) {
        e.stopPropagation();
    });
    µ(document).on('keydown', function(e) {
        switch (e.which) {
            case 37:
            case 38:
                prev();
                e.preventDefault();
                break;
            case 32:
            case 39:
            case 40:
                next();
                e.preventDefault();
                break;
        }
    });

    var next = exports.next = function() {
        goto(current+1);
    }

    var prev = exports.prev = function() {
        goto(current-1);
    }

    var goto = exports.goto = function(n) {
        if (n !== current) {
            subSlide++;
            var subSel = µ.fmt('[data-subslide="{0}"]', subSlide),
                subSlides = µ(subSel, currentSlide);
            if (n - current === 1 &&
                subSlides.length) {
                subSlides.css({'visibility': 'visible'});
            } else {
                n = n < 1 ? 1 : (n > numSlides ? numSlides : n);
                if (n == current) return;
                window.location.hash = "#"+n;
                current = n;
                subSlide = 0;
                currentSlide = slides[current-1];
                µ('[data-subslide]', currentSlide).css({'visibility': 'hidden'});
                for (var i=0; i<numSlides; i++) {
                    var s = slides[i];
                    if (i < current-1) {
                        slides[i].className = 'before';
                    } else if (i > current-1) {
                        slides[i].className = 'after';
                    } else {
                        slides[i].className = 'active';
                    }
                }
            }
            if (exports.onslidechange) {
                var notesEl = µ('#notes aside');
                var slideName = current;
                if (subSlide) {
                    slideName += '.' + subSlide;
                }
                console.log(notesEl[current-1]);
                if (notesEl[current-1]) {
                    exports.onslidechange(slideName, currentSlide.innerHTML, notesEl[current-1].innerHTML);
                } else {
                    exports.onslidechange(slideName, '');
                }
            }
        }
    }

    µ.on(window, "hashchange", function(e) {
        e.preventDefault();
        var newSlide = parseInt(window.location.hash.substr(1), 10);
        if (newSlide && newSlide != current) {
            goto(newSlide);
        }
    });
    µ.on(window, "resize", adjustSizing);
    var toggleFullScreen = exports.fullscreen = function() {
        if (window.fullScreen) {
            body[0].mozCancelFullScreen();
        } else {
            body[0].mozRequestFullScreen();
        }
    }

    var toggleListView = exports.list = function() {
        listMode = !listMode;
        body[0].className = listMode ? 'list' : '';
        adjustSizing();
    }

    window.addEventListener("message", function(m) {
        if (m.data == 'next') {
            next();
        }
        if (m.data == 'prev') {
            prev();
        }
        if (m.data.match(/\d+/)) {
            goto(+m.data);
        }
    });
    window.addEventListener("load", function() {
        var menu = doc.createElement('menu'),
            item = doc.createElement('menuitem');
        µ(menu).attr({
            id: 'fsmenu',
            type: 'context'
        });
        µ(item).attr({ label: 'Fullscreen' })
               .on('click', toggleFullScreen);
        menu.appendChild(item);
        body[0].appendChild(menu);
        body.attr({contextmenu: 'fsmenu'});
    });

    function adjustSizing() {
        body.css({"font-size": (slides[0].offsetHeight+slides[0].offsetWidth)/10 + "%"});
        window.location.hash = "#"+current;
    }
    adjustSizing();
    goto(initCurrent);

    return exports;
})();
