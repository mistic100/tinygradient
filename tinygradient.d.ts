/*!
 * TinyGradient 0.4.0
 * Copyright 2014-2018 Damien "Mistic" Sorel (http://www.strangeplanet.fr)
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */

declare var tinygradient: tinygradient;

interface TinyGradient {

    /**
     * Return new instance with reversed stops
     * @return {tinygradient}
     */
	reverse():tinygradient;

    /**
     * Generate gradient with RGBa interpolation
     * @param {int} steps
     * @return {tinycolor[]}
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
     * @return {tinycolor[]}
     */
	hsv(steps: number, mode: boolean): tinycolorInstance[];

    /**
     * Generate CSS3 command (no prefix) for this gradient
     * @param {String} [mode=linear] - 'linear' or 'radial'
     * @param {String} [direction] - default is 'to right' or 'ellipse at center'
     * @return {String}
     */
	css(mode: string, direction: string): string;

    /**
     * Returns the color at specific position with RGBa interpolation
     * @param {float} pos, between 0 and 1
     * @return {tinycolor}
     */
	rgbAt(pos: number): tinycolorInstance;

    /**
     * Returns the color at specific position with HSVa interpolation
     * @param {float} pos, between 0 and 1
     * @return {tinycolor}
     */
	hsvAt(pos: number): tinycolorInstance;

}

interface tinygradient {
    /**
     * @class tinygradient
     * @param {*} stops
     */
	(stops: TinyGradientSteps[]): TinyGradient;
}

type TinyGradientSteps = string | tinycolor | ColorFormats.RGB | ColorFormats.RGBA | ColorFormats.HSL | ColorFormats.HSLA | ColorFormats.HSV | ColorFormats.HSVA;

export default tinygradient;