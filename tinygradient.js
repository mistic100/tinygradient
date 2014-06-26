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
         * @param {Object} start - rgba or hsva
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
         * @param {Object} stop1
         * @param {Object} stop2
         * @param {Integer} steps
         * @param {tinycolor[]} color1 included, color2 excluded
         */
        rgb: function(stop1, stop2, steps) {
            var start = stop1.color.toRgb(),
                end = stop2.color.toRgb(),
                gradient = [stop1.color],
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
         * @param {Object} stop1
         * @param {Object} stop2
         * @param {Integer} steps
         * @param {Boolean} inverse - true to step in trigonometric order
         * @param {tinycolor[]} color1 included, color2 excluded
         */
        hsv: function(stop1, stop2, steps, inverse) {
            var start = stop1.color.toHsv(),
                end = stop2.color.toHsv(),
                gradient = [stop1.color],
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
        },

        /**
         * Compute substeps between each stops
         * @param {Object[]} stops
         * @param {Integer} steps
         * @return {Integer[]}
         */
        substeps: function(stops, steps) {
            var l = stops.length;

            // validation
            steps = parseInt(steps);

            if (isNaN(steps) || steps < 2) {
                throw new Error('Invalid number of steps (< 2)');
            }
            if (steps < l) {
                throw new Error('Number of steps cannot be inferior to number of stops');
            }

            var substeps = [];

            // we need even number of steps if odd number of stops (and reciprocally)
            if ((l+steps)%2 === 0) {
                steps++;
            }

            var substep = Math.round(steps / (l-1));
            for (var i=0; i<l-2; i++) {
                substeps.push(substep);
            }
            substeps.push(steps - substep * (l-2) - 1);

            return substeps;
        }
    };

    /**
     * @class tinygradient
     * @param {mixed} stops
     */
    var TinyGradient = function(stops) {
        // varargs
        if (arguments.length == 1) {
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

        var havingPositions = !!stops[0].pos,
            l = stops.length,
            p = -1;
        // create tinycolor objects and clean positions
        this.stops = stops.map(function(stop, i) {
            var hasPosition = !!stop.pos;
            if (havingPositions ^ hasPosition) {
                throw new Error('Cannot mix positionned and not posionned color stops');
            }

            if (hasPosition) {
                stop.color = tinycolor(stop.color);

                if (stop.pos <= p) {
                    throw new Error('Color stops positions are not ordered');
                }
                p = stop.pos;
            }
            else {
                stop = {
                    color: tinycolor(stop),
                    pos: i/(l-1)
                };
            }

            return stop;
        });
    };

    /**
     * Return new instance with reversed stops
     * @return {tinygradient}
     */
    TinyGradient.prototype.reverse = function() {
        return new TinyGradient(this.stops.reverse());
    };

    /**
     * Generate gradient with RGBa interpolation
     * @param {Integer} steps
     * @return {tinycolor[]}
     */
    TinyGradient.prototype.rgb = function(steps) {
        var substeps = Utils.substeps(this.stops, steps),
            gradient = [];

        for (var i=0, l=this.stops.length; i<l-1; i++) {
            gradient = gradient.concat(Utils.rgb(this.stops[i], this.stops[i+1], substeps[i]));
        }

        gradient.push(this.stops[l-1].color);

        return gradient;
    };

    /**
     * Generate gradient with HSVa interpolation
     * @param {Integer} steps
     * @param {Boolean|String} mode
     *    - false (default) to step in clockwise
     *    - true to step in trigonometric order
     *    - 'short' to use the shortest way
     *    - 'long' to use the longest way
     * @return {tinycolor[]}
     */
    TinyGradient.prototype.hsv = function(steps, mode) {
        var substeps = Utils.substeps(this.stops, steps),
            inverse = !!mode,
            parametrized = typeof mode === 'string',
            gradient = [],
            start, end, trig;

        for (var i=0, l=this.stops.length; i<l-1; i++) {
            if (parametrized) {
                start = this.stops[i].color.toHsv();
                end = this.stops[i+1].color.toHsv();
                trig = (start.h < end.h && end.h-start.h < 180) || (start.h > end.h && start.h-end.h > 180);
            }

            gradient = gradient.concat(Utils.hsv(this.stops[i], this.stops[i+1], substeps[i],
              (parametrized && mode=='long' && trig) ||(parametrized && mode=='short' && !trig) || (!parametrized && inverse)
            ));
        }

        gradient.push(this.stops[l-1].color);

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
        this.stops.forEach(function(stop) {
            css+= ', ' + stop.color.toRgbString();
        });
        css+= ')';
        return css;
    };


    // export
    return TinyGradient;
}));