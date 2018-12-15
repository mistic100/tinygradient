/*!
 * TinyGradient 0.4.3
 * Copyright 2014-2018 Damien "Mistic" Sorel (http://www.strangeplanet.fr)
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */

(function (root, factory) {
    if (typeof module !== "undefined" && module.exports) {
        module.exports = factory(require('tinycolor2'));
    }
    else if (typeof define === 'function' && define.amd) {
        define(['tinycolor2'], factory);
    }
    else {
        root.tinygradient = factory(root.tinycolor);
    }
}(this, function (tinycolor) {
    "use strict";

    var RGBA_MAX = {r: 256, g: 256, b: 256, a: 1};
    var HSVA_MAX = {h: 360, s: 1, v: 1, a: 1};

    /**
     * Linearly compute the step size between start and end (not normalized)
     * @param {Object} start - rgba or hsva
     * @param {Object} end - rgba or hsva
     * @param {int} steps - number of desired steps
     * @return {Object} rgba or hsva
     */
    function stepize(start, end, steps) {
        var step = {};

        for (var k in start) {
            if (start.hasOwnProperty(k)) {
                step[k] = steps === 0 ? 0 : (end[k] - start[k]) / steps;
            }
        }

        return step;
    }

    /**
     * Compute the final step color
     * @param {Object} step - rgba or hsva from `stepize`
     * @param {Object} start - rgba or hsva
     * @param {int} i - color index
     * @param {Object} max - rgba or hsva of maximum values for each channel
     * @return {Object} rgba or hsva
     */
    function interpolate(step, start, i, max) {
        var color = {};

        for (var k in start) {
            if (start.hasOwnProperty(k)) {
                color[k] = step[k] * i + start[k];
                color[k] = color[k] < 0 ? color[k] + max[k] : ( max[k] !== 1 ? color[k] % max[k] : color[k] );
            }
        }

        return color;
    }

    /**
     * Generate gradient with RGBa interpolation
     * @param {Object} stop1
     * @param {Object} stop2
     * @param {int} steps
     * @return {tinycolor[]} color1 included, color2 excluded
     */
    function interpolateRgb(stop1, stop2, steps) {
        var start = stop1.color.toRgb(),
            end = stop2.color.toRgb(),
            gradient = [stop1.color],
            step = stepize(start, end, steps),
            color;

        for (var i = 1; i < steps; i++) {
            color = interpolate(step, start, i, RGBA_MAX);
            gradient.push(tinycolor(color));
        }

        return gradient;
    }

    /**
     * Generate gradient with HSVa interpolation
     * @param {Object} stop1
     * @param {Object} stop2
     * @param {int} steps
     * @param {Boolean} trigonometric - true to step in trigonometric order
     * @return {tinycolor[]} color1 included, color2 excluded
     */
    function interpolateHsv(stop1, stop2, steps, trigonometric) {
        var start = stop1.color.toHsv(),
            end = stop2.color.toHsv(),
            gradient = [stop1.color],
            step = stepize(start, end, steps),
            diff, color;

        // recompute hue
        if ((start.h <= end.h && !trigonometric) || (start.h >= end.h && trigonometric)) {
            diff = end.h - start.h;
        }
        else if (trigonometric) {
            diff = 360 - end.h + start.h;
        }
        else {
            diff = 360 - start.h + end.h;
        }
        step.h = Math.pow(-1, trigonometric ? 1 : 0) * Math.abs(diff) / steps;

        for (var i = 1; i < steps; i++) {
            color = interpolate(step, start, i, HSVA_MAX);
            gradient.push(tinycolor(color));
        }

        return gradient;
    }

    /**
     * Compute substeps between each stops
     * @param {Object[]} stops
     * @param {int} steps
     * @return {int[]}
     */
    function computeSubsteps(stops, steps) {
        var l = stops.length;

        // validation
        steps = parseInt(steps);

        if (isNaN(steps) || steps < 2) {
            throw new Error('Invalid number of steps (< 2)');
        }
        if (steps < l) {
            throw new Error('Number of steps cannot be inferior to number of stops');
        }

        // compute substeps from stop positions
        var substeps = [];

        for (var i = 1; i < l; i++) {
            var step = (steps - 1) * (stops[i].pos - stops[i - 1].pos);
            substeps.push(Math.max(1, Math.round(step)));
        }

        // adjust number of steps
        var totalSubsteps = 1;
        for (var n = l - 1; n--;) totalSubsteps += substeps[n];

        while (totalSubsteps !== steps) {
            if (totalSubsteps < steps) {
                var min = Math.min.apply(null, substeps);
                substeps[substeps.indexOf(min)]++;
                totalSubsteps++;
            }
            else {
                var max = Math.max.apply(null, substeps);
                substeps[substeps.indexOf(max)]--;
                totalSubsteps--;
            }
        }

        return substeps;
    }

    /**
     * Compute the color at a specific position
     * @param {Object[]} stops
     * @param {float} pos
     * @param {string} method
     * @param {Object} max
     * @returns {tinycolor}
     */
    function computeAt(stops, pos, method, max) {
        if (pos < 0 || pos > 1) {
            throw new Error('Position must be between 0 and 1');
        }

        var start, end;
        for (var i = 0, l = stops.length; i < l - 1; i++) {
            if (pos >= stops[i].pos && pos < stops[i + 1].pos) {
                start = stops[i];
                end = stops[i + 1];
                break;
            }
        }

        if (!start) {
            start = end = stops[stops.length - 1];
        }

        var step = stepize(start.color[method](), end.color[method](), (end.pos - start.pos) * 100);
        var color = interpolate(step, start.color[method](), Math.round((pos - start.pos) * 100), max);
        return tinycolor(color);
    }

    /**
     * @class tinygradient
     * @param {*} stops
     */
    var TinyGradient = function (stops) {
        // varargs
        if (arguments.length === 1) {
            if (!(arguments[0] instanceof Array)) {
                throw new Error('"stops" is not an array');
            }
            stops = arguments[0];
        }
        else {
            stops = Array.prototype.slice.call(arguments);
        }

        // if we are called as a function, call using new instead
        if (!(this instanceof TinyGradient)) {
            return new TinyGradient(stops);
        }

        // validation
        if (stops.length < 2) {
            throw new Error('Invalid number of stops (< 2)');
        }

        var havingPositions = stops[0].pos !== undefined,
            l = stops.length,
            p = -1;
        // create tinycolor objects and clean positions
        this.stops = stops.map(function (stop, i) {
            var hasPosition = stop.pos !== undefined;
            if (havingPositions ^ hasPosition) {
                throw new Error('Cannot mix positionned and not posionned color stops');
            }

            if (hasPosition) {
                stop = {
                    color: tinycolor(stop.color),
                    pos  : stop.pos
                };

                if (stop.pos < 0 || stop.pos > 1) {
                    throw new Error('Color stops positions must be between 0 and 1');
                }
                else if (stop.pos <= p) {
                    throw new Error('Color stops positions are not ordered');
                }
                p = stop.pos;
            }
            else {
                stop = {
                    color: tinycolor(stop),
                    pos  : i / (l - 1)
                };
            }

            return stop;
        });

        if (this.stops[0].pos !== 0) {
            this.stops.unshift({
                color: this.stops[0].color,
                pos  : 0
            });
        }
        if (this.stops[this.stops.length - 1].pos !== 1) {
            this.stops.push({
                color: this.stops[this.stops.length - 1].color,
                pos  : 1
            });
        }
    };

    /**
     * Return new instance with reversed stops
     * @return {tinygradient}
     */
    TinyGradient.prototype.reverse = function () {
        var stops = [];

        this.stops.forEach(function (stop) {
            stops.push({
                color: stop.color,
                pos  : 1 - stop.pos
            });
        });

        return new TinyGradient(stops.reverse());
    };

    /**
     * Generate gradient with RGBa interpolation
     * @param {int} steps
     * @return {tinycolor[]}
     */
    TinyGradient.prototype.rgb = function (steps) {
        var substeps = computeSubsteps(this.stops, steps),
            gradient = [];

        for (var i = 0, l = this.stops.length; i < l - 1; i++) {
            gradient = gradient.concat(interpolateRgb(this.stops[i], this.stops[i + 1], substeps[i]));
        }

        gradient.push(this.stops[l - 1].color);

        return gradient;
    };

    /**
     * Generate gradient with HSVa interpolation
     * @param {int} steps
     * @param {Boolean|String} [mode=false]
     *    - false to step in clockwise
     *    - true to step in trigonometric order
     *    - 'short' to use the shortest way
     *    - 'long' to use the longest way
     * @return {tinycolor[]}
     */
    TinyGradient.prototype.hsv = function (steps, mode) {
        var substeps = computeSubsteps(this.stops, steps),
            trigonometric = mode === true,
            parametrized = typeof mode === 'string',
            gradient = [],
            start, end, trig;

        for (var i = 0, l = this.stops.length; i < l - 1; i++) {
            start = this.stops[i].color.toHsv();
            end = this.stops[i + 1].color.toHsv();

            if (parametrized) {
                trig = (start.h < end.h && end.h - start.h < 180) || (start.h > end.h && start.h - end.h > 180);
            }

            // rgb interpolation if one of the steps in grayscale
            if (start.s === 0 || end.s === 0) {
                gradient = gradient.concat(interpolateRgb(this.stops[i], this.stops[i + 1], substeps[i]));
            }
            else {
                gradient = gradient.concat(interpolateHsv(this.stops[i], this.stops[i + 1], substeps[i],
                    (mode === 'long' && trig) || (mode === 'short' && !trig) || (!parametrized && trigonometric)
                ));
            }
        }

        gradient.push(this.stops[l - 1].color);

        return gradient;
    };

    /**
     * Generate CSS3 command (no prefix) for this gradient
     * @param {String} [mode=linear] - 'linear' or 'radial'
     * @param {String} [direction] - default is 'to right' or 'ellipse at center'
     * @return {String}
     */
    TinyGradient.prototype.css = function (mode, direction) {
        mode = mode || 'linear';
        direction = direction || (mode === 'linear' ? 'to right' : 'ellipse at center');

        var css = mode + '-gradient(' + direction;
        this.stops.forEach(function (stop) {
            css += ', ' + stop.color.toRgbString() + ' ' + (stop.pos * 100) + '%';
        });
        css += ')';
        return css;
    };

    /**
     * Returns the color at specific position with RGBa interpolation
     * @param {float} pos, between 0 and 1
     * @return {tinycolor}
     */
    TinyGradient.prototype.rgbAt = function (pos) {
        return computeAt(this.stops, pos, 'toRgb', RGBA_MAX);
    };

    /**
     * Returns the color at specific position with HSVa interpolation
     * @param {float} pos, between 0 and 1
     * @return {tinycolor}
     */
    TinyGradient.prototype.hsvAt = function (pos) {
        return computeAt(this.stops, pos, 'toHsv', HSVA_MAX);
    };

    var STATIC_FNS = {
        'rgb'  : 1,
        'hsv'  : 2,
        'css'  : 2,
        'rgbAt': 1,
        'hsvAt': 1
    };

    Object.keys(STATIC_FNS).forEach(function (fn) {
        TinyGradient[fn] = function () {
            var colors = Array.prototype.slice.call(arguments);
            var args = colors.splice(-STATIC_FNS[fn]);
            var gradient = new TinyGradient(colors);
            return gradient[fn].apply(gradient, args);
        };
    });

    // export
    return TinyGradient;
}));