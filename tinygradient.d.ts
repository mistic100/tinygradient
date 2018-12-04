/*!
 * TinyGradient 0.4.1
 * Copyright 2014-2018 Damien "Mistic" Sorel (http://www.strangeplanet.fr)
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */

import * as tinycolor from 'tinycolor2';

declare namespace tinygradient {

    type ArcMode = boolean | 'short' | 'long';

    type CssMode = 'linear' | 'radial';

    type StopInput = {
        color: tinycolor.ColorInput
        pos: number
    }

    interface Instance {
        stops: StopInput[]

        /**
         * Return new instance with reversed stops
         * @return {Instance}
         */
        reverse(): Instance;

        /**
         * Generate gradient with RGBa interpolation
         * @param {int} steps
         * @return {tinycolor.Instance[]}
         */
        rgb(steps: number): tinycolor.Instance[];

        /**
         * Generate gradient with HSVa interpolation
         * @param {int} steps
         * @param {ArcMode} [mode=false]
         *    - false to step in clockwise
         *    - true to step in trigonometric order
         *    - 'short' to use the shortest way
         *    - 'long' to use the longest way
         * @return {tinycolor.Instance[]}
         */
        hsv(steps: number, mode: ArcMode): tinycolor.Instance[];

        /**
         * Generate CSS3 command (no prefix) for this gradient
         * @param {CssMode} [mode=linear] - 'linear' or 'radial'
         * @param {String} [direction] - default is 'to right' or 'ellipse at center'
         * @return {String}
         */
        css(mode?: CssMode, direction?: string): string;

        /**
         * Returns the color at specific position with RGBa interpolation
         * @param {double} pos, between 0 and 1
         * @return {tinycolor.Instance}
         */
        rgbAt(pos: number): tinycolor.Instance;

        /**
         * Returns the color at specific position with HSVa interpolation
         * @param {float} pos, between 0 and 1
         * @return {tinycolor.Instance}
         */
        hsvAt(pos: number): tinycolor.Instance;

    }

    interface Constructor {
        /**
         * @class tinygradient
         * @param {tinycolor.ColorInput[]} stops
         */
        new (stops: (StopInput | tinycolor.ColorInput)[]): Instance;
        new (...stops: (StopInput | tinycolor.ColorInput)[]): Instance;
        (stops: (StopInput | tinycolor.ColorInput)[]): Instance;
        (...stops: (StopInput | tinycolor.ColorInput)[]): Instance;

        /**
         * Generate gradient with RGBa interpolation
         * @param {tinycolor.ColorInput[]} stops
         * @param {int} steps
         * @return {tinycolor.Instance[]}
         */
        rgb(stops: StopInput[] | tinycolor.ColorInput[], steps: number): tinycolor.Instance[];

        /**
         * Generate gradient with HSVa interpolation
         * @param {tinycolor.ColorInput[]} stops
         * @param {int} steps
         * @param {ArcMode} [mode=false]
         *    - false to step in clockwise
         *    - true to step in trigonometric order
         *    - 'short' to use the shortest way
         *    - 'long' to use the longest way
         * @return {tinycolor.Instance[]}
         */
        hsv(stops: StopInput[] | tinycolor.ColorInput[], steps: number, mode: ArcMode): tinycolor.Instance[];

        /**
         * Generate CSS3 command (no prefix) for this gradient
         * @param {tinycolor.ColorInput[]} stops
         * @param {CssMode} [mode=linear] - 'linear' or 'radial'
         * @param {String} [direction] - default is 'to right' or 'ellipse at center'
         * @return {String}
         */
        css(stops: StopInput[] | tinycolor.ColorInput[], mode?: CssMode, direction?: string): string;

        /**
         * Returns the color at specific position with RGBa interpolation
         * @param {tinycolor.ColorInput[]} stops
         * @param {float} pos, between 0 and 1
         * @return {tinycolor.Instance}
         */
        rgbAt(stops: StopInput[] | tinycolor.ColorInput[], pos: number): tinycolor.Instance;

        /**
         * Returns the color at specific position with HSVa interpolation
         * @param {tinycolor.ColorInput[]} stops
         * @param {float} pos, between 0 and 1
         * @return {tinycolor.Instance}
         */
        hsvAt(stops: StopInput[] | tinycolor.ColorInput[], pos: number): tinycolor.Instance;
    }
}

declare const tinygradient: tinygradient.Constructor;
export = tinygradient;
export as namespace tinygradient;
