'use strict';

// Simply using 'toFixed' gives false results (e.g. 1.55 => 1.5).
const roundTo = require('round-to');

module.exports = {
	PAD_LEFT: 'left',
	PAD_RIGHT: 'right',
	PAD_BOTH: 'both',

	pad(value, char, length, side) {
		side = typeof side === 'undefined' ? 'right' : side;

		let padding = '';
		let required = Math.floor(length) - value.toString().length;

		while (required > 0) {
			required -= 1;

			if (side === this.PAD_LEFT) value = char + value;
			if (side === this.PAD_RIGHT) value = value + char;

			if (side === this.PAD_BOTH) {
				if (required % 2 === 0) value = char + value;
				else value = value + char;
			}
		}

		return value;
	},

	money(cents) {
		return roundTo(cents / 100, 2).toFixed(2);
	}
};