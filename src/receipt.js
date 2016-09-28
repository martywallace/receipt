const EOL = require('os').EOL;
const utils = require('./utils');

module.exports = (() => {
	return {
		formatters: {
			empty: (chunk, width) => {
				return '';
			},

			ruler: (chunk, width) => {
				return utils.pad('', '-', width, utils.PAD_RIGHT)
			},
			
			left: (chunk, width) => {
				return this;
			},

			right: (chunk, width) => {
				return utils.pad(chunk, ' ', width, utils.PAD_LEFT);
			},

			center: (chunk, width) => {
				return utils.pad(chunk, ' ', width, utils.PAD_BOTH);
			},

			properties: (chunk, width) => {
				return chunk.lines.map((line) => utils.pad(line.name + ':', ' ', 16) + line.value).join(EOL);
			},

			table: (chunk, width) => {
				let lines = [utils.pad('', '-', width, utils.PAD_RIGHT)];

				let headers = [
					'Qty',
					utils.pad('Unit $', ' ', 10, utils.PAD_LEFT),
					utils.pad('GST', ' ', 9, utils.PAD_LEFT),
					utils.pad('Amt', ' ', 10, utils.PAD_LEFT)
				].join('');

				lines.push(utils.pad('Product', ' ', width - headers.length) + headers);
				lines.push(utils.pad('', '-', width, utils.PAD_RIGHT));

				for (let line of chunk.lines) {
					let summary = [
						line.qty + 'x',
						utils.pad('$' + (line.cost / 100).toFixed(2), ' ', 10, utils.PAD_LEFT),
						utils.pad('$' + (line.cost / 1000).toFixed(2), ' ', 9, utils.PAD_LEFT),
						utils.pad('$' + (line.qty * (line.cost / 100)).toFixed(2), ' ', 10, utils.PAD_LEFT)
					].join('');

					lines.push(utils.pad(line.item, ' ', width - summary.length) + summary);
				}

				lines.push(utils.pad('', '-', width, utils.PAD_RIGHT));

				return lines.join(EOL);
			}
		},

		write(chunks, width = 50) {
			return chunks.map((chunk) => {
				if (chunk.hasOwnProperty('type')) {
					if (chunk.type === this.types.EMPTY) {
						if (chunk.hasOwnProperty('height')) {
							let lines = [];

							for (let i = 0; i < chunk.height; i++) {
								lines.push(EOL);
							}

							return lines.join('');
						} else {
							return EOL;
						}
					} 

					else if (chunk.type === this.types.RULER) {
						return utils.pad('', '-', width, utils.PAD_RIGHT);
					}

					else if (chunk.type === this.types.PROPERTIES) {
						
					}

					else if (chunk.type === this.types.TABLE) {
						if (chunk.hasOwnProperty('lines')) {
							
						}
					}

					else {
						if (chunk.hasOwnProperty('value')) {
							if (chunk.type === this.types.GENERAL_LEFT) return utils.pad(chunk.value, ' ', width, utils.PAD_RIGHT);
							if (chunk.type === this.types.GENERAL_RIGHT) return utils.pad(chunk.value, ' ', width, utils.PAD_LEFT);
							if (chunk.type === this.types.GENERAL_CENTER) return utils.pad(chunk.value, ' ', width, utils.PAD_BOTH);
						}
					}
				}

				return '';
			}).join(EOL);
		}
	};
})();