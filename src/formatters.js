'use strict';

const EOL = require('os').EOL;
const utils = require('./utils');

module.exports = {
	empty(chunk) {
		return utils.pad('', ' ', this.config.width, utils.PAD_RIGHT);
	},

	ruler(chunk) {
		return utils.pad('', this.config.ruler, this.config.width, utils.PAD_RIGHT);
	},

	text(chunk) {
		if (Array.isArray(chunk.value)) {
			// Expand array to multiple text calls with same formatting.
			return chunk.value.map((value) => {
				return this.formatters.text({ type: chunk.type, value: value, align: chunk.align, padding: chunk.padding });
			}).join(EOL);
		}

		let chars = this.config.width - (chunk.hasOwnProperty('padding') ? (chunk.hasOwnProperty('align') && chunk.align === 'center' ? chunk.padding * 2 : chunk.padding) : 0);
		let words = chunk.value.split(/\s/g);
		let lines = [];
		let line = '';

		words.reverse();

		while (words.length > 0) {
			let word = words.pop();

			if (line.length + word.length > chars) {
				lines.push(line);
				line = '';
			}

			line += word + ' ';
		}

		lines.push(line);

		let alignTypes = {
			left: utils.PAD_RIGHT,
			right: utils.PAD_LEFT,
			center: utils.PAD_BOTH
		};

		if (lines) {
			return lines.map((line) => {
				line = line.replace(/\s+$|^\s+/, '');

				if (chunk.hasOwnProperty('align')) {
					if (alignTypes.hasOwnProperty(chunk.align)) {
						return utils.pad(line, ' ', this.config.width, alignTypes[chunk.align]);
					}
				}

				return utils.pad(line, ' ', this.config.width, utils.PAD_RIGHT);
			}).join(EOL);
		}

		return '';
	},

	properties(chunk) {
		let widest = 0;

		for (let line of chunk.lines) {
			widest = Math.max(line.name.length, widest);
		}

		return chunk.lines.map((line) => utils.pad(line.name + ':', ' ', widest + 5) + line.value).join(EOL);
	},

	table(chunk) {
		let lines = [this.formatters.ruler('')];

		lines.push([
			utils.pad('Qty', ' ', 6, utils.PAD_RIGHT),
			utils.pad('Product', ' ', this.config.width - 18, utils.PAD_RIGHT),
			utils.pad('Total', ' ', 12, utils.PAD_LEFT)
		].join(''));

		lines.push(this.formatters.ruler(''));

		for (let line of chunk.lines) {
			let total = line.qty * line.cost;

			if (line.hasOwnProperty('discount')) {
				if (line.discount.type === 'percentage') total *= (1 - line.discount.value);
				else total -= line.discount.value;
			}

			lines.push([
				utils.pad(line.qty, ' ', 6, utils.PAD_RIGHT),
				utils.pad(line.item.substr(0, this.config.width - 18), ' ', this.config.width - 18, utils.PAD_RIGHT),
				utils.pad(this.config.currency + utils.money(total), ' ', 12, utils.PAD_LEFT)
			].join(''));

			if (line.hasOwnProperty('discount')) {
				let discountText =  line.discount.hasOwnProperty('message')
					? '  (' + line.discount.message + ')'
					: '  (Item Disc. -' + (line.discount.type === 'percentage' ? (line.discount.value * 100) + '%' : this.config.currency + utils.money(line.discount.value)) + ')';

				lines.push([
					utils.pad('', ' ', 6, utils.PAD_RIGHT),
					discountText
				].join(''));
			}
		}

		lines.push(this.formatters.ruler(''));

		return lines.join(EOL);
	}
};