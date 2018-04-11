var tinygradient = require('../tinygradient.js'),
    assert = require('assert');

describe('TinyGradient', function () {
    it('should throw an error on invalid steps/colors number', function () {
        assert.throws(function () {
            tinygradient('red');
        });
        assert.throws(function () {
            tinygradient(['red']);
        });
        assert.throws(function () {
            var grad = tinygradient('red', 'blue');
            grad.rgb(1);
        });
        assert.throws(function () {
            var grad = tinygradient('red', 'blue', 'green');
            grad.rgb(2);
        });
    });

    it('should accept varargs and array', function () {
        var grad1 = tinygradient('red', 'green', 'blue', 'yellow', 'black');
        var grad2 = tinygradient(['red', 'green', 'blue', 'yellow', 'black']);

        assert.deepEqual(
            grad1.stops.map(function (c) {
                return c.color.toRgb();
            }),
            grad2.stops.map(function (c) {
                return c.color.toRgb();
            })
        );
    });

    it('should reverse gradient', function () {
        var grad1 = tinygradient('red', 'green', 'blue', 'yellow', 'black');
        var grad2 = grad1.reverse();

        assert.deepEqual(
            grad1.stops.map(function (c) {
                return c.color.toRgb();
            }),
            grad2.stops.reverse().map(function (c) {
                return c.color.toRgb();
            })
        );
    });

    it('should generate 11 steps gradient from black to grey in RGB', function () {
        var grad = tinygradient({r: 0, g: 0, b: 0}, {r: 100, g: 100, b: 100});
        var res = grad.rgb(11);

        assert.equal(11, res.length);
        assert.deepEqual({r: 0, g: 0, b: 0, a: 1}, res[0].toRgb(), 'black');
        assert.deepEqual({r: 50, g: 50, b: 50, a: 1}, res[5].toRgb(), 'dark gray');
        assert.deepEqual({r: 100, g: 100, b: 100, a: 1}, res[10].toRgb(), 'gray');
    });

    it('should generate 13 steps gradient from red to red in HSV', function () {
        var grad = tinygradient([
            {h: 0, s: 1, v: 1},
            {h: 120, s: 1, v: 1},
            {h: 240, s: 1, v: 1},
            {h: 0, s: 1, v: 1}
        ]);
        var res = grad.hsv(13);

        assert.equal(13, res.length);
        assert.deepEqual({h: 60, s: 1, v: 1, a: 1}, res[2].toHsv(), 'yellow');
        assert.deepEqual({h: 180, s: 1, v: 1, a: 1}, res[6].toHsv(), 'cyan');
        assert.deepEqual({h: 300, s: 1, v: 1, a: 1}, res[10].toHsv(), 'magenta');
    });

    it('should generate CSS gradient command for 3 colors', function () {
        var grad = tinygradient('#f00', '#0f0', '#00f');
        var res = grad.css();
        assert.equal('linear-gradient(to right, rgb(255, 0, 0) 0%, rgb(0, 255, 0) 50%, rgb(0, 0, 255) 100%)', res, 'default');

        grad = tinygradient('rgba(255,0,0,0.5)', 'rgba(0,255,0,0.5)', 'rgba(0,0,255,0.5)');
        res = grad.css('radial', 'ellipse farthest-corner');
        assert.equal('radial-gradient(ellipse farthest-corner, rgba(255, 0, 0, 0.5) 0%, rgba(0, 255, 0, 0.5) 50%, rgba(0, 0, 255, 0.5) 100%)', res, 'radial with alpha');
    });

    it('should returns a single color at specific position', function () {
        var grad = tinygradient('white', 'black');
        var res = grad.rgbAt(0.5);
        assert.deepEqual({r: 128, g: 128, b: 128, a: 1}, res.toRgb(), 'rgb');

        grad = tinygradient('red', 'blue');
        res = grad.hsvAt(0.5);
        assert.deepEqual({h: 120, s: 1, v: 1, a: 1}, res.toHsv(), 'hsv');
    });

    it('should provide static methods', function () {
        var res1 = tinygradient('white', 'blue').rgb(5);
        var res2 = tinygradient.rgb('white', 'blue', 5);

        assert.deepEqual(
            res1.map(function (c) {
                return c.toRgb();
            }),
            res2.map(function (c) {
                return c.toRgb();
            }),
            'rgb'
        );

        res1 = tinygradient('green', 'blue').hsv(5, true);
        res2 = tinygradient.hsv('green', 'blue', 5, true);

        assert.deepEqual(
            res1.map(function (c) {
                return c.toRgb();
            }),
            res2.map(function (c) {
                return c.toRgb();
            }),
            'hsv'
        );

        res1 = tinygradient('green', 'blue').css('linear', 'to left');
        res2 = tinygradient.css('green', 'blue', 'linear', 'to left');

        assert.equal(res1, res2, 'css');

        res1 = tinygradient('green', 'blue').rgbAt(0.33);
        res2 = tinygradient.rgbAt('green', 'blue', 0.33);

        assert.deepEqual(res1.toRgb(), res2.toRgb(), 'rgbAt');

        res1 = tinygradient('green', 'blue').hsvAt(0.33);
        res2 = tinygradient.hsvAt('green', 'blue', 0.33);

        assert.deepEqual(res1.toRgb(), res2.toRgb(), 'hsvAt');
    });
});