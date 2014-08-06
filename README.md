TinyGradient
============

[![Bower version](https://badge.fury.io/bo/tinygradient.svg)](http://badge.fury.io/bo/tinygradient)
[![NPM version](https://badge.fury.io/js/tinygradient.svg)](http://badge.fury.io/js/tinygradient)

## JavaScript gradients generator

Easily generate color gradients with unlimited number of color stops and steps. 
 
Built on top of [TinyColor](https://github.com/bgrins/TinyColor).

Compatible with Require.js/AMD and NodeJS.

## Usage

The gradient can be generate using RGB or HSV interpolation. HSV usually produces brighter colors.

### Initialize gradient

The `tinygradient` constructor takes a list or an array of colors stops.

```javascript
// using varargs
var gradient = tinygradient('red', 'green', 'blue');

// using array
var gradient = tinygradient([
  '#ff0000',
  '#00ff00',
  '#0000ff'
]);
```

The colors are parsed with TinyColor, [multiple formats are accepted](https://github.com/bgrins/TinyColor/blob/master/README.md#accepted-string-input).

```javascript
var gradient = tinygradient([
  tinycolor('#ff0000'),       // tinycolor object
  {r: 0, g: 255, b: 0},       // RGB object
  {h: 240: s: 1, v: 1, a: 1}, // HSVa object
  'rgb(120, 120, 0)',         // RGB CSS string
  'gold'                      // named color
]);
```

You can also specify the position of each color stop (between `0` and `1`). If no position is specified, stops are distributed equidistantly.

```javascript
var gradient = tinygradient([
  {color: '#d8e0de', pos: 0},
  {color: '#255B53', pos: 0.8},
  {color: '#000000', pos: 1}
]);
```

### Generate gradient

Each method takes at least the number of desired steps.
> The generated gradients might have one more step in certain conditions.

```javascript
// RGB interpolation
var colorsRgb = gradient.rgb(9);
```
![rgb](https://raw.githubusercontent.com/mistic100/tinygradient/master/images/rgb.png)

```javascript
// HSV clockwise interpolation
var colorsHsv = gradient.hsv(9);
```
![hsv](https://raw.githubusercontent.com/mistic100/tinygradient/master/images/hsv.png)

```javascript
// HSV counter-clockwise interpolation
var colorsHsv = gradient.hsv(9, true);
```
![hsv2](https://raw.githubusercontent.com/mistic100/tinygradient/master/images/hsv2.png)

There are also two methods which will automatically choose between clockwise and counter-clockwise.

```javascript
// HSV interpolation using shortest arc between colors
var colorsHsv = gradient.hsv(9, 'short');

// HSV interpolation using longest arc between colors
var colorsHsv = gradient.hsv(9, 'long');
```

Each method returns an array of TinyColor objects, [see available methods](https://github.com/bgrins/TinyColor/blob/master/README.md#methods).

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
