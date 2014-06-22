TinyGradient
============

[![Bower version](https://badge.fury.io/bo/tinygradient.svg)](http://badge.fury.io/bo/tinygradient)
[![NPM version](https://badge.fury.io/js/tinygradient.svg)](http://badge.fury.io/js/tinygradient)

## JavaScript gradient generator

Easily generate color gradients with unlimited number of color stops and steps. 
 
Built on top of [TinyColor](https://github.com/bgrins/TinyColor).

Compatible with Require.js/AMD and NodeJS.

## Usage

The gradient can be generate using RGB or HSV interpolation. HSV usually produces brighter colors.

### Initialize gradient

The `tinygradient` constructor takes a list or an array of colors steps and a number of steps.
> The generated gradients might have one more step in certain conditions.

```javascript
// using varargs
var gradient = tinygradient('red', 'green', 'blue', 12);

// using array
var gradient = tinygradient([
  '#ff0000',
  '#00ff00',
  '#0000ff'
], 12);
```

The colors are parsed with TinyColor, [multiple formats are accepted](https://github.com/bgrins/TinyColor/blob/master/README.md#accepted-string-input).

```javascript
var gradient = tinygradient([
  tinycolor('#ff0000'),       // tinycolor object
  {r: 0, g: 255, b: 0},       // RGB object
  {h: 240: s: 1, v: 1, a: 1}, // HSVa object
  'rgb(120, 120, 0)',         // RGB CSS string
  'gold'                      // named color
], 20);
```

### Generate gradient

```javascript
// RGB interpolation
var colorsRgb = gradient.rgb();
```
![rgb](images/rgb.png)

```javascript
// HSV clockwise interpolation
var colorsHsv = gradient.hsv();
```
![hsv](images/hsv.png)

```javascript
// HSV counter-clockwise interpolation
var colorsHsv = gradient.hsv(true);
```
![hsv2](images/hsv2.png)

There are also two methods which will automatically choose between clockwise and counter-clockwise.

```javascript
// HSV interpolation using shortest arc between colors
var colorsHsv = gradient.hsv('short');

// HSV interpolation using longest arc between colors
var colorsHsv = gradient.hsv('long');
```

Each function returns an array of TinyColor objects, [see available methods](https://github.com/bgrins/TinyColor/blob/master/README.md#methods).

### Get CSS gradient string

The `css` method will output a valid W3C string (without vendors prefix) to use with `background-image` css property.

```javascript
// linear gradient to right (default)
var gradientStr = gradient.css();

// radial gradient ellipse at top left
var gradientStr = gradient.css('radial', 'farthest-corner ellipse at top left');
```

### Reversing gradient

Returns a new instance of TinyGradient with reversed colors.

```javascript
var reversedGradient = gradient.reverse();
```

## Tests

A Mocha test suite is available.

```
npm install
npm test
```
