const tinygradient = require('../index.js');
const assert = require('assert');

describe('TinyGradient', () => {
    it('should throw an error on invalid steps/colors number', () => {
        assert.throws(() => {
            tinygradient('red');
        });
        assert.throws(() => {
            tinygradient(['red']);
        });
        assert.throws(() => {
            let grad = tinygradient('red', 'blue');
            grad.rgb(1);
        });
        assert.throws(() => {
            let grad = tinygradient('red', 'blue', 'green');
            grad.rgb(2);
        });
    });

    it('should accept varargs and array', () => {
        let grad1 = tinygradient('red', 'green', 'blue', 'yellow', 'black');
        let grad2 = tinygradient(['red', 'green', 'blue', 'yellow', 'black']);

        assert.deepStrictEqual(
            grad1.stops.map(c => c.color.toRgb()),
            grad2.stops.map(c => c.color.toRgb())
        );
    });

    it('should reverse gradient', () => {
        let grad1 = tinygradient('red', 'green', 'blue', 'yellow', 'black');
        let grad2 = grad1.reverse();

        assert.deepStrictEqual(
            grad1.stops.map(c => c.color.toRgb()),
            grad2.stops.reverse().map(c => c.color.toRgb())
        );
    });

    it('should generate 11 steps gradient from black to grey in RGB', () => {
        let grad = tinygradient({ r: 0, g: 0, b: 0 }, { r: 100, g: 100, b: 100 });
        let res = grad.rgb(11);

        assert.strictEqual(11, res.length);
        assert.deepStrictEqual({ r: 0, g: 0, b: 0, a: 1 }, res[0].toRgb(), 'black');
        assert.deepStrictEqual({ r: 50, g: 50, b: 50, a: 1 }, res[5].toRgb(), 'dark gray');
        assert.deepStrictEqual({ r: 100, g: 100, b: 100, a: 1 }, res[10].toRgb(), 'gray');
    });

    it('should generate 13 steps gradient from red to red in HSV', () => {
        let grad = tinygradient([
            { h: 0, s: 1, v: 1 },
            { h: 120, s: 1, v: 1 },
            { h: 240, s: 1, v: 1 },
            { h: 0, s: 1, v: 1 }
        ]);
        let res = grad.hsv(13);

        assert.strictEqual(13, res.length);
        assert.deepStrictEqual({ h: 60, s: 1, v: 1, a: 1 }, res[2].toHsv(), 'yellow');
        assert.deepStrictEqual({ h: 180, s: 1, v: 1, a: 1 }, res[6].toHsv(), 'cyan');
        assert.deepStrictEqual({ h: 300, s: 1, v: 1, a: 1 }, res[10].toHsv(), 'magenta');
    });

    it('should generate CSS gradient command for 3 colors', () => {
        let grad = tinygradient('#f00', '#0f0', '#00f');
        let res = grad.css();
        assert.strictEqual('linear-gradient(to right, rgb(255, 0, 0) 0%, rgb(0, 255, 0) 50%, rgb(0, 0, 255) 100%)', res, 'default');

        grad = tinygradient('rgba(255,0,0,0.5)', 'rgba(0,255,0,0.5)', 'rgba(0,0,255,0.5)');
        res = grad.css('radial', 'ellipse farthest-corner');
        assert.strictEqual('radial-gradient(ellipse farthest-corner, rgba(255, 0, 0, 0.5) 0%, rgba(0, 255, 0, 0.5) 50%, rgba(0, 0, 255, 0.5) 100%)', res, 'radial with alpha');
    });

    it('should returns a single color at specific position', () => {
        let grad = tinygradient('white', 'black');
        let res = grad.rgbAt(0.5);
        assert.deepStrictEqual({ r: 128, g: 128, b: 128, a: 1 }, res.toRgb(), 'rgb');

        grad = tinygradient('red', 'blue');
        res = grad.hsvAt(0.5);
        assert.deepStrictEqual({ h: 120, s: 1, v: 1, a: 1 }, res.toHsv(), 'hsv');
    });

    it('should loop a gradient', () => {
        let grad = tinygradient({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 });
        let res = grad.loop().rgb(5);

        assert.strictEqual(5, res.length);
        assert.deepStrictEqual({ r: 0, g: 0, b: 0, a: 1 }, res[0].toRgb(), 'black');
        assert.deepStrictEqual({ r: 255, g: 255, b: 255, a: 1 }, res[2].toRgb(), 'white');
        assert.deepStrictEqual(res[0].toRgb(), res[4].toRgb(), 'black');
        assert.deepStrictEqual(res[1].toRgb(), res[3].toRgb(), 'black');
    });

    it('should allow positionned stops', () => {
        let grad = tinygradient([{ color: 'black', pos: 0 }, { color: 'white', pos: 0.5 }]);

        assert.deepStrictEqual(
            grad.rgb(5).map((c) => c.toHex()),
            ['000000', '808080', 'ffffff', 'ffffff', 'ffffff']
        );
    });

    it('should allow position only stops', () => {
        // reference
        let grad1 = tinygradient([{ color: 'black', pos: 0 }, { color: 'white', pos: 1 }]);

        assert.deepStrictEqual(
            grad1.rgb(5).map((c) => c.toHex()),
            ['000000', '404040', '808080', 'bfbfbf', 'ffffff']
        );

        // with position stop
        let grad2 = tinygradient([{ color: 'black', pos: 0 }, { pos: 0.2 }, { color: 'white', pos: 1 }]);

        assert.deepStrictEqual(
            grad2.rgb(5).map((c) => c.toHex()),
            ['000000', '808080', 'aaaaaa', 'd5d5d5', 'ffffff']
        );
    });

    it('should prevent consecutive position stops', () => {
        assert.throws(() => {
            tinygradient([{ color: 'black', pos: 0 }, { pos: 0.2 }, { pos: 0.4 }, { color: 'white', pos: 1 }]);
        });
        assert.throws(() => {
            tinygradient([{ pos: 0.4 }, { color: 'white', pos: 1 }]);
        });
        assert.throws(() => {
            tinygradient([{ color: 'black', pos: 0 }, { pos: 0.2 }]);
        });
    });

    it('should prevent misordered stops', () => {
        assert.throws(() => {
            tinygradient([{ color: 'black', pos: 0.5 }, { color: 'white', pos: 0 }]);
        });
    });

    it('should allow equal position stops', () => {
        let grad = tinygradient([
            { color: 'black', pos: 0 },
            { color: 'white', pos: 0.5 },
            { color: 'black', pos: 0.5 },
            { color: 'white', pos: 1 },
        ]);

        assert.deepStrictEqual(
            grad.rgb(8).map((c) => c.toHex()),
            ['000000', '555555', 'aaaaaa', 'ffffff', '000000', '555555', 'aaaaaa', 'ffffff']
        );
    });

    it('should force RGB interpolation when a color is grey', () => {
        let grad = tinygradient('rgba(86, 86, 86)', 'rgb(45, 163, 185)');

        assert.deepStrictEqual(
            grad.hsv(5).map((c) => c.toHex()),
            grad.rgb(5).map((c) => c.toHex()),
        );
    });
});
