TinyGradient
============

## JavaScript color generator

Easily generate color gradients with unlimited number of color stops and steps. 
 
Built on top of [TinyColor](https://github.com/bgrins/TinyColor).

Compatible with Require.js/AMD and NodeJS.

## Usage

The gradient can be generate using RGB interpolation or HSV interpolation. HSV usually produces brighter colors.

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
  tinycolor('#ff0000'), // tinycolor object
  {r: 0, g: 255, b: 0}, // RGB object
  {h: 240: s: 1, v: 1, a: 1}, // HSVa object
  'rgb(120, 120, 0)', // RGB CSS string
  'gold' // named color
], 20);
```

### Generate gradient

```javascript
// RGB interpolation
var colorsRgb = gradient.rgb();

// HSV clockwise interpolation
var colorsHsv1 = gradient.hsv();

// HSV counter-clockwise interpolation
var colorsHsv2 = gradient.hsv(true);

// HSV interpolation using shortest arc between colors
var colorsHsv3 = gradient.hsv('short');

// HSV interpolation using longest arc between colors
var colorsHsv4 = gradient.hsv('long');
```

Each function returns an array of TinyColor objects, [see available methods](https://github.com/bgrins/TinyColor/blob/master/README.md#methods).

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
