var tinygradient = require('../tinygradient.js'),
    assert = require('assert');

describe('Basic gradients', function() {
    it('should throw an error on invalid steps/colors number', function() {
        assert.throws(function() { tinygradient('red', 2) });
        assert.throws(function() { tinygradient(['red'], 2) });
        assert.throws(function() { tinygradient('red', 'blue', 1) });
        assert.throws(function() { tinygradient('red', 'blue', 'green', 2) });
    });
    
    it('should accept varargs and array', function() {
        var grad1 = tinygradient('red', 'green', 'blue', 'yellow', 'black', 20);
        var grad2 = tinygradient(['red', 'green', 'blue', 'yellow', 'black'], 20);
       
        assert.equal(grad1.steps, grad2.steps);
        assert.deepEqual(
          grad1.colors.map(function(c) { return c.toRgb(); }),
          grad2.colors.map(function(c) { return c.toRgb(); })
        );
    });
    
    it('should generate 11 steps gradient from black to grey in RGB', function() {
        var grad = tinygradient({r:0,g:0,b:0}, {r:100,g:100,b:100}, 11);
        var res = grad.rgb();

        assert.equal(11, res.length);
        assert.deepEqual({r:0,g:0,b:0,a:1}, res[0].toRgb(), 'black');
        assert.deepEqual({r:50,g:50,b:50,a:1}, res[5].toRgb(), 'dark gray');
        assert.deepEqual({r:100,g:100,b:100,a:1}, res[10].toRgb(), 'gray');
    });
    
    it('should generate 13 steps gradient from red to red in HSV', function() {
        var grad = tinygradient([
          {h:0,s:1,v:1},
          {h:120,s:1,v:1},
          {h:240,s:1,v:1},
          {h:0,s:1,v:1}
        ], 13);
        var res = grad.hsv();
        
        assert.equal(13, res.length);
        assert.deepEqual({h:60,s:1,v:1,a:1}, res[2].toHsv(), 'yellow');
        assert.deepEqual({h:180,s:1,v:1,a:1}, res[6].toHsv(), 'cyan');
        assert.deepEqual({h:300,s:1,v:1,a:1}, res[10].toHsv(), 'magenta');
    });
    
    it('should generate CSS gradient command for 3 colors', function() {
        var grad = tinygradient('#f00', '#0f0', '#00f', 10);
        var res = grad.css();
        assert.equal('linear-gradient(to right, rgb(255, 0, 0), rgb(0, 255, 0), rgb(0, 0, 255))', res, 'default');
        
        grad = tinygradient('rgba(255,0,0,0.5)', 'rgba(0,255,0,0.5)', 'rgba(0,0,255,0.5)', 10);
        res = grad.css('radial', 'ellipse farthest-corner');
        assert.equal('radial-gradient(ellipse farthest-corner, rgba(255, 0, 0, 0.5), rgba(0, 255, 0, 0.5), rgba(0, 0, 255, 0.5))', res, 'radial with alpha');
    });
    
    it('should increase number add on step if necessary', function() {
        var grad = tinygradient('#f00', '#0f0', '#00f', 9);
        
        assert.equal(grad.steps, 10);
    });
});