'use strict';

const EOL = require('os').EOL;
const utils = require('./utils');

module.exports = (() => {
	return {
		formatters: {
			empty(chunk, { width }) {
				return utils.pad('', ' ', width, utils.PAD_RIGHT);
			},

			ruler(chunk, { width }) {
				return utils.pad('', '=', width, utils.PAD_RIGHT);
			},

			left(chunk, { width }) {
				return chunk.value;
			},

			right(chunk, { width }) {
				return utils.pad(chunk.value, ' ', width, utils.PAD_LEFT);
			},

			center(chunk, { width }) {
				return utils.pad(chunk.value, ' ', width, utils.PAD_BOTH);
			},

			properties(chunk, { width }) {
				let widest = 0;

				for (let line of chunk.lines) {
					widest = Math.max(line.name.length, widest);
				}

				return chunk.lines.map((line) => utils.pad(line.name + ':', ' ', widest + 5) + line.value).join(EOL);
			},

			table(chunk, { width, currency }) {
				let lines = [this.ruler('', { width })];

				lines.push([
					utils.pad('Qty', ' ', 6, utils.PAD_RIGHT),
					utils.pad('Product', ' ', width - 18, utils.PAD_RIGHT),
					utils.pad('Total', ' ', 12, utils.PAD_LEFT)
				].join(''));

				lines.push(this.ruler('', { width }));

				for (let line of chunk.lines) {
					let total = line.qty * line.cost;

					if (line.hasOwnProperty('discount')) {
						if (line.discount.type === 'percentage') total *= (1 - line.discount.value);
						else if (line.discount.type === 'message') total;
						else total -= line.discount.value;
					}

					lines.push([
						utils.pad(line.qty, ' ', 6, utils.PAD_RIGHT),
						utils.pad(line.item.substr(0, width - 18), ' ', width - 18, utils.PAD_RIGHT),
						utils.pad(currency + utils.money(total), ' ', 12, utils.PAD_LEFT)
					].join(''));

					if (line.hasOwnProperty('discount')) {
						let discountText = '-'
						if (line.discount.type === 'percentage') discountText += (line.discount.value * 100) + '%';
						else if (line.discount.type === 'message') discountText = line.discount.value;
						else discountText += currency + utils.money(line.discount.value);

						lines.push([
							utils.pad('', ' ', 6, utils.PAD_RIGHT),
							utils.pad('  (Item Disc. ' + discountText + ')', ' ', width - 30, utils.PAD_RIGHT)
						].join(''));
					}
				}

				lines.push(this.ruler('', { width }));

				return lines.join(EOL);
			}
		},

		create(chunks, { width = 48, currency = '$' } = {}) {

			return chunks.map((chunk) => {
				if (chunk.hasOwnProperty('type')) {
					return this.formatters[chunk.type](chunk, { width, currency });
				}

				return '';
			}).join(EOL);
		}
	};
})();
