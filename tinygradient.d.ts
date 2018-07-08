/*!
 * TinyGradient 0.4.0
 * Copyright 2014-2018 Damien "Mistic" Sorel (http://www.strangeplanet.fr)
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */

declare var tinygradient: tinygradient;

type ArcMode = boolean | 'short' | 'long';

interface TinyGradient {

    /**
     * Return new instance with reversed stops
     * @return {tinygradient}
     */
    reverse(): tinygradient;

    /**
     * Generate gradient with RGBa interpolation
     * @param {int} steps
     * @return {tinycolorInstance[]}
     */
    rgb(steps: number): tinycolorInstance[];

    /**
     * Generate gradient with HSVa interpolation
     * @param {int} steps
     * @param {Boolean|String} [mode=false]
     *    - false to step in clockwise
     *    - true to step in trigonometric order
     *    - 'short' to use the shortest way
     *    - 'long' to use the longest way
     * @return {tinycolorInstance[]}
     */
    hsv(steps: number, mode: ArcMode): tinycolorInstance[];

    /**
     * Generate CSS3 command (no prefix) for this gradient
     * @param {String} [mode=linear] - 'linear' or 'radial'
     * @param {String} [direction] - default is 'to right' or 'ellipse at center'
     * @return {String}
     */
    css(mode?: 'linear' | 'radial', direction?: string): string;

    /**
     * Returns the color at specific position with RGBa interpolation
     * @param {float} pos, between 0 and 1
     * @return {tinycolorInstance}
     */
    rgbAt(pos: number): tinycolorInstance;

    /**
     * Returns the color at specific position with HSVa interpolation
     * @param {float} pos, between 0 and 1
     * @return {tinycolorInstance}
     */
    hsvAt(pos: number): tinycolorInstance;

}

interface tinygradient {
    /**
     * @class tinygradient
     * @param {ColorInput[]} stops
     */
    (stops: ColorInput[]): TinyGradient;

    /**
     * Generate gradient with RGBa interpolation
     * @param {ColorInput[]} stops
     * @param {int} steps
     * @return {tinycolorInstance[]}
     */
    rgb(stops: ColorInput[], steps: number): tinycolorInstance[];

    /**
     * Generate gradient with HSVa interpolation
     * @param {ColorInput[]} stops
     * @param {int} steps
     * @param {Boolean|String} [mode=false]
     *    - false to step in clockwise
     *    - true to step in trigonometric order
     *    - 'short' to use the shortest way
     *    - 'long' to use the longest way
     * @return {tinycolorInstance[]}
     */
    hsv(stops: ColorInput[], steps: number, mode: ArcMode): tinycolorInstance[];

    /**
     * Generate CSS3 command (no prefix) for this gradient
     * @param {ColorInput[]} stops
     * @param {String} [mode=linear] - 'linear' or 'radial'
     * @param {String} [direction] - default is 'to right' or 'ellipse at center'
     * @return {String}
     */
    css(stops: ColorInput[], mode?: 'linear' | 'radial', direction?: string): string;

    /**
     * Returns the color at specific position with RGBa interpolation
     * @param {ColorInput[]} stops
     * @param {float} pos, between 0 and 1
     * @return {tinycolorInstance}
     */
    rgbAt(stops: ColorInput[], pos: number): tinycolorInstance;

    /**
     * Returns the color at specific position with HSVa interpolation
     * @param {ColorInput[]} stops
     * @param {float} pos, between 0 and 1
     * @return {tinycolorInstance}
     */
    hsvAt(stops: ColorInput[], pos: number): tinycolorInstance;
}

// export default tinygradient;
declare module 'tinygradient' {
    export = tinygradient;
}
