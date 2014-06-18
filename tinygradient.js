/*!
* TinyGradient
* Copyright 2014 Damien "Mistic" Sorel (http://www.strangeplanet.fr)
* Licensed under MIT (http://opensource.org/licenses/MIT)
*/

(function(root, factory) {
    if (typeof module !== "undefined" && module.exports) {
        module.exports = factory(require('tinycolor2'));
    }
    else if (typeof define === 'function' && define.amd) {
        define(['tinycolor'], factory);
    }
    else {
        root.tinygradient = factory(root.tinycolor);
    }
}(this, function(tinycolor) {
    "use strict";

    var Utils = {
        rgba_max: { r: 256, g: 256, b: 256, a: 1 },
        hsva_max: { h: 360, s: 1, v: 1, a: 1 },

        /**
         * Linearly compute the step size between start and end (not normalized)
         * @param {Object} start - rgba or hsva
         * @param {Object} end - rgba or hsva
         * @param {Integer} steps - number of desired steps
         * @return {Object} rgba or hsva
         */
        stepize: function(start, end, steps) {
            var step = {};

            for (var k in start) {
                if (start.hasOwnProperty(k)) {
                    step[k] = (end[k]-start[k]) / steps;
                }
            }

            return step;
        },

        /**
         * Compute the final step color
         * @param {Object} step - rgba or hsva from `stepize`
         * @param {Object} start - rgba or hsva from `stepize`
         * @param {Integer} i - color index
         * @param {Object} max - rgba or hsva of maximum values for each channel
         * @return {Object} rgba or hsva
         */
        interpolate: function(step, start, i, max) {
            var color = {};

            for (var k in start) {
                if (start.hasOwnProperty(k)) {
                    color[k] = step[k] * i + start[k];
                    color[k] = color[k]<0 ? color[k]+max[k] : ( max[k]!=1 ? color[k]%max[k] : color[k] );
                }
            }

            return color;
        },

        /**
         * Generate gradient with RGBa interpolation
         * @param {tinycolor} color1
         * @param {tinycolor} color2
         * @param {Integer} steps
         * @param {tinycolor[]} color1 included, color2 excluded
         */
        rgb: function(color1, color2, steps) {
            var start = color1.toRgb(),
                end = color2.toRgb(),
                gradient = [color1],
                step = Utils.stepize(start, end, steps),
                color;

            for (var i=1; i<steps; i++) {
                color = Utils.interpolate(step, start, i, Utils.rgba_max);
                gradient.push(tinycolor(color));
            }

            return gradient;
        },

        /**
         * Generate gradient with HSVa interpolation
         * @param {tinycolor} color1
         * @param {tinycolor} color2
         * @param {Integer} steps
         * @param {Boolean} inverse - true to step in trigonometric order
         * @param {tinycolor[]} color1 included, color2 excluded
         */
        hsv: function(color1, color2, steps, inverse) {
            var start = color1.toHsv(),
                end = color2.toHsv(),
                gradient = [color1],
                step = Utils.stepize(start, end, steps),
                diff, color;

            // recompute hue
            if ((start.h <= end.h && !inverse) || (start.h >= end.h && inverse)) {
                diff = end.h-start.h;
            }
            else if (inverse) {
                diff = 360-end.h+start.h;
            }
            else {
                diff = 360-start.h+end.h;
            }
            step.h = Math.pow(-1, inverse) * Math.abs(diff)*1.0 / steps;

            for (var i=1; i<steps; i++) {
                color = Utils.interpolate(step, start, i, Utils.hsva_max);
                gradient.push(tinycolor(color));
            }

            return gradient;
        }
    };

    /**
     * @class tinygradient
     * @param {...String|...tinycolor|String[]|tinycolor[]} colors
     * @param {Integer} steps
     */
    var TinyGradient = function(colors, steps) {
        // varargs
        steps = parseInt(arguments[arguments.length-1]);
        if (arguments.length == 2) {
            if (!(arguments[0] instanceof Array)) {
                throw new Error('Colors is not an array');
            }
            colors = arguments[0]
        }
        else {
            colors = Array.prototype.slice.call(arguments, 0, -1);
        }

        // if we are called as a function, call using new instead
        if (!(this instanceof TinyGradient)) {
            return new TinyGradient(colors, steps);
        }

        // validation
        if (steps < 2 || steps == NaN) {
            throw new Error('Invalid number of steps (< 2)');
        }
        if (colors.length < 2) {
            throw new Error('Invalid number of colors (< 2)');
        }
        if (steps < colors.length) {
            throw new Error('Number of steps cannot be inferior to number of colors');
        }

        this.colors = colors;
        this.steps = steps;
        this.substeps = [];

        // create tinycolor objects
        this.colors = this.colors.map(function(color) {
            return tinycolor(color);
        });

        // compute substeps
        // we need even number of steps if odd number of colors (and reciprocally)
        if ((this.colors.length+this.steps)%2 == 0) {
            this.steps++;
        }
        
        var substep = Math.round(this.steps / (this.colors.length-1));
        for (var i=0, l=this.colors.length; i<l-2; i++) {
            this.substeps.push(substep);
        }
        this.substeps.push(this.steps - substep * (l-2) - 1);
    };

    /**
     * Return new instance with reversed colors
     * @return {tinygradient}
     */
    TinyGradient.prototype.reverse = function() {
        return new TinyGradient(this.colors.reverse(), this.steps);
    };

    /**
     * Generate gradient with RGBa interpolation
     * @return {tinycolor[]}
     */
    TinyGradient.prototype.rgb = function() {
        var gradient = [];

        for (var i=0, l=this.colors.length; i<l-1; i++) {
            gradient = gradient.concat(Utils.rgb(this.colors[i], this.colors[i+1], this.substeps[i]));
        }

        gradient.push(this.colors[l-1]);

        return gradient;
    };

    /**
     * Generate gradient with HSVa interpolation
     * @param {Boolean|String} mode
     *    - false (default) to step in clockwise
     *    - true to step in trigonometric order
     *    - 'short' to use the shortest way
     *    - 'long' to use the longest way
     * @return {tinycolor[]}
     */
    TinyGradient.prototype.hsv = function(mode) {
        var inverse = !!mode,
            parametrized = typeof mode === 'string',
            gradient = [],
            start, end, trig;

        for (var i=0, l=this.colors.length; i<l-1; i++) {
            if (parametrized) {
                start = this.colors[i].toHsv();
                end = this.colors[i+1].toHsv();
                trig = (start.h < end.h && end.h-start.h < 180) || (start.h > end.h && start.h-end.h > 180);
            }

            gradient = gradient.concat(Utils.hsv(this.colors[i], this.colors[i+1], this.substeps[i],
              (parametrized && mode=='long' && trig) ||(parametrized && mode=='short' && !trig) || (!parametrized && inverse)
            ));
        }

        gradient.push(this.colors[l-1]);

        return gradient;
    };

    /**
     * Generate CSS3 command (no prefix) for this gradient
     * @param {String} [mode=linear] - 'linear' or 'radial'
     * @param {String} [direction] - default is 'to right' or 'ellipse at center'
     * @return {String}
     */
    TinyGradient.prototype.css = function(mode, direction) {
        mode = mode || 'linear';
        direction = direction || (mode=='linear' ? 'to right' : 'ellipse at center');

        var css = mode + '-gradient(' + direction;
        this.colors.forEach(function(color) {
            css+= ', ' + color.toRgbString();
        });
        css+= ')';
        return css;
    };


    // export
    return TinyGradient
}));