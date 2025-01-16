$(window).bind('load', function () {
    const raf = function (entry) {
        window.requestAnimationFrame(entry);
    };
    const random = function (min, max) {
        max = max + 1;
        return Math.floor(Math.random() * (max - min) + min);
    };

    var app = {
        init: function () {
            this.cacheDOM();
            this.style();
        },
        cacheDOM: function () {
            this.container = $('#container');
            this.mouseX = null;
            this.mouseY = null;
        },
        style: function () {
            $(window).resize(function initial() {
                TweenMax.set(app.container, {
                    opacity: 1
                });
                return initial;
            }());
        },
        cursorEvents: function (e) {
            app.mouseX = e.clientX;
            app.mouseY = e.clientY;
        }
    };

    app.init();

    var c = document.getElementById('c'),
        c2 = document.getElementById('c2'),
        cx = c.getContext('2d'),
        c2x = c2.getContext('2d');

    c.width = $('#c').outerWidth();
    c.height = $('#c').outerHeight();

    c2.width = $('#c2').outerWidth();
    c2.height = $('#c2').outerHeight();

    // INITIAL CANVAS DRAW
    cx.fillStyle = 'rgba(0,0,0,1)';
    cx.fillRect(0, 0, c.width, c.height);
    c2x.fillStyle = 'rgba(0,0,0,1)';
    c2x.fillRect(0, 0, c2.width, c2.height);

    function particleFactory(thisCanvas, thisContext) {
        var particleIndex = 0,
            particles = {},
            particleNum = 2;

        function Particle() {
            this.r = 8;
            this.x = thisCanvas.width / 2;
            this.y = thisCanvas.height / 2;

            this.vx = random(-5, 5);
            this.vy = random(-5, 5);
            this.color = `hsla(${random(30, 60)},100%,50%,1)`;
            particleIndex++;
            particles[particleIndex] = this;
            this.id = particleIndex;
        }

        Particle.prototype.draw = function () {
            thisContext.fillStyle = this.color;
            thisContext.beginPath();
            thisContext.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            thisContext.fill();

            this.x += this.vx;
            this.y += this.vy;

            if (this.x > thisCanvas.width || this.x < 0 || this.y > thisCanvas.height || this.y < 0) {
                delete particles[this.id];
            }
        };

        const renderParticles = function () {
            thisContext.fillStyle = 'rgba(0,0,0,0.1)';
            thisContext.fillRect(0, 0, thisCanvas.width, thisCanvas.height);

            for (var i in particles) {
                particles[i].draw();
            }

            if (Object.keys(particles).length < particleNum) {
                new Particle();
            }

            raf(renderParticles);
        };

        raf(renderParticles);
    }

    // Create particle effects for both canvases
    particleFactory(c, cx);
    particleFactory(c2, c2x);

    TweenMax.set('#c2-container', {
        transformOrigin: 'center bottom',
        scaleY: -1,
        opacity: 1
    });

    TweenMax.set(c2, {
        filter: 'blur(10px)'
    });

    $(window).resize(function () {
        c.width = $('#c').outerWidth();
        c.height = $('#c').outerHeight();
        c2.width = $('#c2').outerWidth();
        c2.height = $('#c2').outerHeight();
    });
});
