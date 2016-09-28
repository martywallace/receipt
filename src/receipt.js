const EOL = require('os').EOL;
const utils = require('./utils');

module.exports = (() => {
	return {
		formatters: {
			empty(chunk, width) {
				return '';
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
					utils.pad('Unit $', ' ', 10, utils.PAD_LEFT),
					utils.pad('GST', ' ', 9, utils.PAD_LEFT),
					utils.pad('Amt', ' ', 10, utils.PAD_LEFT)
				].join('');

				lines.push(utils.pad('Product', ' ', width - headers.length) + headers);
				lines.push(this.ruler('', width));

				for (let line of chunk.lines) {
					let summary = [
						line.qty + 'x',
						utils.pad('$' + (line.cost / 100).toFixed(2), ' ', 10, utils.PAD_LEFT),
						utils.pad('$' + (line.cost / 1000).toFixed(2), ' ', 9, utils.PAD_LEFT),
						utils.pad('$' + (line.qty * (line.cost / 100)).toFixed(2), ' ', 10, utils.PAD_LEFT)
					].join('');

					lines.push(utils.pad(line.item, ' ', width - summary.length) + summary);
				}

				lines.push(this.ruler('', width));

				return lines.join(EOL);
			}
		},

		create(chunks, width = 50) {
			return chunks.map((chunk) => {
				if (chunk.hasOwnProperty('type')) {
					return this.formatters[chunk.type](chunk, width);
				}

				return '';
			}).join(EOL);
		}
	};
})();