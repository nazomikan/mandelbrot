/*jslint bitwise: true, devel: true, unparam: true, sloppy: true, vars: false, nomen: true, plusplus: true, maxerr: 1000, indent: 4 */
/*global window, document, setInterval, clearInterval, setTimeout, jQuery*/
(function (doc, win, $) {

    // 複素数表現
    function Complex(a, b) {
        this.re = a || 0;
        this.im = b || 0;
    }

    Complex.prototype.add = function (a) {
        return new Complex(this.re + a.re, this.im + a.im);
    };

    Complex.prototype.mult = function (a) {
        return new Complex(
            (this.re * a.re - this.im * a.im),
            (this.re * a.im + this.im * a.re)
        );
    };

    Complex.prototype.conj = function () {
        return new Complex(this.re, -this.im);
    };

    Complex.prototype.sqr = function () {
        return new Complex(
            (this.re * this.re - this.im * this.im),
            (2 * this.re * this.im)
        );
    };

    Complex.prototype.cube = function () {
        return new Complex(
            this.re * (this.re * this.re - 3 * this.im * this.im),
            this.im * (3 * this.re * this.re - this.im * this.im)
        );
    };

    Complex.prototype.abs2 = function () {
        return this.re * this.re + this.im * this.im;
    };

    // 反復回数から色を算出
    function countToColor(count, base) {
        var r, g, b, d, m;

        if (count < 0) {
            return 'rgb(0, 0, 0)';
        }

        d = (count % base) * 256 / base;
        m = (d / 42.667) << 0;

        switch (m) {
        //blue -> cyan
        case 0:
            r = 0;
            g = 6 * d;
            b = 255;
            break;
        //cyan -> green
        case 1:
            r = 0;
            g = 255;
            b = 255 - 6 * (d - 43);
            break;
        //green -> yellow
        case 2:
            r = 6 * (d - 86);
            g = 255;
            b = 0;
            break;
        //yellow -> red
        case 3:
            r = 255;
            g = 255 - 6 * (d - 129);
            b = 0;
            break;
        //red -> magenta
        case 4:
            r = 255;
            g = 0;
            b = 6 * (d - 171);
            break;
        //magenta -> blue
        case 5:
            r = 255 - 6 * (d - 214);
            g = 0;
            b = 255;
            break;
        default:
            r = 0;
            g = 0;
            b = 0;
            break;
        }
        return 'rgb(' + [r, g, b].join() + ')';
    }

    $(doc).ready(function () {
        var canvas = doc.getElementById('mandelbrot'),
            size = canvas.width,
            ctx = canvas.getContext('2d'),
            edge = size / 2;


        function drawMandelBrot(xMin, yMin, xMax, yMax) {
            var x, y, z, count, pixel, value, c = new Complex(), color;
            for (x = xMin; x < xMax; x++) {
                for (y = yMin; y < yMax; y++) {
                    c = new Complex();
                    c.re = (x - edge) * 6 / (size * 2) - 0.5;
                    c.im = (y - edge) * 6 / (size * 2);
                    z = new Complex();
                    count = 0;
                    do {
                        z = z.sqr().add(c);
                        value = z.abs2();
                        count++;
                        if (count > 64) {
                            count = -1;
                            break;
                        }
                    } while (value < 4.0);

                    color = countToColor(count, 32);
                    pixel = {x: x, y: y, color: color};
                    ctx.fillStyle = pixel.color;
                    ctx.fillRect(pixel.x, pixel.y, 1, 1);
                }
            }
        }
        drawMandelBrot(0, 0, size, size);
    });

}(document, window, jQuery));
