# tinygradient

[![npm version](https://img.shields.io/npm/v/tinygradient.svg?style=flat-square)](https://www.npmjs.com/package/tinygradient)
[![jsDelivr CDN](https://data.jsdelivr.com/v1/package/npm/tinygradient/badge)](https://www.jsdelivr.com/package/npm/tinygradient)
[![GZIP size](https://img.shields.io/bundlephobia/minzip/tinygradient?label=gzip%20size)](https://bundlephobia.com/result?p=tinygradient)
[![Build Status](https://github.com/mistic100/tinygradient/workflows/CI/badge.svg)](https://github.com/mistic100/tinygradient/actions)

Easily generate color gradients with an unlimited number of color stops and steps. 

[Live demo](https://mistic100.github.io/tinygradient/)

## Installation

```
$ npm install tinygradient
```

### Dependencies

- [TinyColor](https://github.com/bgrins/TinyColor)

## Usage

The gradient can be generated using RGB or HSV interpolation. HSV usually produces brighter colors.

### Initialize gradient

The `tinygradient` constructor takes a list or an array of colors stops.

```javascript
// using varargs
const gradient = tinygradient('red', 'green', 'blue');

// using array
const gradient = tinygradient([
  '#ff0000',
  '#00ff00',
  '#0000ff'
]);
```

The colors are parsed with TinyColor, [multiple formats are accepted](https://github.com/bgrins/TinyColor/blob/master/README.md#accepted-string-input).

```javascript
const gradient = tinygradient([
  tinycolor('#ff0000'),       // tinycolor object
  {r: 0, g: 255, b: 0},       // RGB object
  {h: 240, s: 1, v: 1, a: 1}, // HSVa object
  'rgb(120, 120, 0)',         // RGB CSS string
  'gold'                      // named color
]);
```

You can also specify the position of each color stop (between `0` and `1`). If no position is specified, stops are distributed equidistantly.

```javascript
const gradient = tinygradient([
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
const colorsRgb = gradient.rgb(9);
```
![rgb](https://raw.githubusercontent.com/mistic100/tinygradient/master/images/rgb.png)

```javascript
// HSV clockwise interpolation
const colorsHsv = gradient.hsv(9);
```
![hsv](https://raw.githubusercontent.com/mistic100/tinygradient/master/images/hsv.png)

```javascript
// HSV counter-clockwise interpolation
const colorsHsv = gradient.hsv(9, true);
```
![hsv2](https://raw.githubusercontent.com/mistic100/tinygradient/master/images/hsv2.png)

There are also two methods which will automatically choose between clockwise and counter-clockwise.

```javascript
// HSV interpolation using shortest arc between colors
const colorsHsv = gradient.hsv(9, 'short');

// HSV interpolation using longest arc between colors
const colorsHsv = gradient.hsv(9, 'long');
```

Each method returns an array of TinyColor objects, [see available methods](https://github.com/bgrins/TinyColor/blob/master/README.md#methods).

### Get CSS gradient string

The `css` method will output a valid W3C string (without vendors prefix) to use with `background-image` CSS property.

```javascript
// linear gradient to right (default)
const gradientStr = gradient.css();

// radial gradient ellipse at top left
const gradientStr = gradient.css('radial', 'farthest-corner ellipse at top left');
```

### Get color at a specific position

Returns a single TinyColor object from a defined position in the gradient (from 0 to 1).

```javascript
// with RGB interpolation
colorAt55Percent = gradient.rgbAt(0.55);

// with HSV interpolation
colorAt55Percent = gradient.hsvAt(0.55);
```

### Reversing gradient

Returns a new instance of TinyGradient with reversed colors.

```javascript
const reversedGradient = gradient.reverse();
```

### Loop the gradient

Returns a new instance of TinyGradient with looped colors.

```javascript
const loopedGradient = gradient.loop();
```

### Position-only stops

I is possible to define stops with the `pos` property only and no `color`. This allows to define the position of the mid-point between the previous and the next stop.

```js
const gradient = tinygradient([
  {color: 'black', pos: 0},
  {pos: 0.8}, // #808080 will be at 80% instead of 50%
  {color: 'white', pos: 1}
]);
```


## License
This library is available under the MIT license.
