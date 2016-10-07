'use strict';

const EOL = require('os').EOL;
const utils = require('./utils');

module.exports = (() => {
	return {
		formatters: {
			empty(chunk, width) {
				return utils.pad('', ' ', width, utils.PAD_RIGHT);
			},

			ruler(chunk, width) {
				return utils.pad('', '=', width, utils.PAD_RIGHT);
			},
			
			left(chunk, width) {
				return chunk.value;
			},

			right(chunk, width) {
				return utils.pad(chunk.value, ' ', width, utils.PAD_LEFT);
			},

			center(chunk, width) {
				return utils.pad(chunk.value, ' ', width, utils.PAD_BOTH);
			},

			properties(chunk, width) {
				let widest = 0;

				for (let line of chunk.lines) {
					widest = Math.max(line.name.length, widest);
				}

				return chunk.lines.map((line) => utils.pad(line.name + ':', ' ', widest + 5) + line.value).join(EOL);
			},

			table(chunk, width) {
				let lines = [this.ruler('', width)];

				lines.push([
					utils.pad('Qty', ' ', 6, utils.PAD_RIGHT),
					utils.pad('Product', ' ', width - 18, utils.PAD_RIGHT),
					utils.pad('Total', ' ', 12, utils.PAD_LEFT)
				].join(''));

				lines.push(this.ruler('', width));

				for (let line of chunk.lines) {
					let total = line.qty * line.cost;

					if (line.hasOwnProperty('discount')) {
						if (line.discount.type === 'percentage') total *= (1 - line.discount.value);
						else total -= line.discount.value;
					}

					lines.push([
						utils.pad(line.qty, ' ', 6, utils.PAD_RIGHT),
						utils.pad(line.item.substr(0, width - 18), ' ', width - 18, utils.PAD_RIGHT),
						utils.pad('$' + utils.money(total), ' ', 12, utils.PAD_LEFT)
					].join(''));

					if (line.hasOwnProperty('discount')) {
						let discountText = '-' + (line.discount.type === 'percentage' ? (line.discount.value * 100) + '%' : '$' + utils.money(line.discount.value));

						lines.push([
							utils.pad('', ' ', 6, utils.PAD_RIGHT),
							utils.pad('  (Item Disc. ' + discountText + ')', ' ', width - 30, utils.PAD_RIGHT)
						].join(''));
					}
				}

				lines.push(this.ruler('', width));

				return lines.join(EOL);
			}
		},

		create(chunks, width) {
			width = typeof width === 'undefined' ? 48 : width;

			return chunks.map((chunk) => {
				if (chunk.hasOwnProperty('type')) {
					return this.formatters[chunk.type](chunk, width);
				}

				return '';
			}).join(EOL);
		}
	};
})();