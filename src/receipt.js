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
				return utils.pad('', '-', width, utils.PAD_RIGHT);
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

				let headers = [
					'Qty',
					// utils.pad('Unit $', ' ', 10, utils.PAD_LEFT),
					// utils.pad('GST', ' ', 9, utils.PAD_LEFT),
					utils.pad('Amt', ' ', 14, utils.PAD_LEFT)
				].join('');

				lines.push(utils.pad('Product', ' ', width - headers.length) + headers);
				lines.push(this.ruler('', width));

				for (let line of chunk.lines) {
					let summary = [
						line.qty + 'x',
						// utils.pad('$' + utils.money(line.cost), ' ', 10, utils.PAD_LEFT),
						// utils.pad('$' + utils.money(line.cost * 0.1), ' ', 9, utils.PAD_LEFT),
						utils.pad('$' + utils.money(line.qty * line.cost), ' ', 14, utils.PAD_LEFT)
					].join('');

					let name = line.item;

					if (name.length > width - summary.length - 4) {
						name = name.substr(0, width - summary.length - 7).replace(/\s+$/, '') + '...';
					}

					lines.push(utils.pad(name, ' ', width - summary.length) + summary);
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