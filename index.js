const EOL = require('os').EOL;

module.exports = (() => {
	return {
		types: {
			RULER: 'ruler',
			EMPTY: 'empty',
			GENERAL_LEFT: 'generalLeft',
			GENERAL_RIGHT:'generalRight',
			GENERAL_CENTER: 'generalCenter',
			PROPERTIES: 'properties',
			TABLE: 'table'
		},

		padding: {
			LEFT: 'left',
			RIGHT: 'right',
			CENTER: 'center'
		},

		write(chunks, width = 50) {
			let groups = chunks.map((chunk) => {
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
						return this.pad('', '-', width, this.padding.RIGHT);
					}

					else if (chunk.type === this.types.PROPERTIES) {
						if (chunk.hasOwnProperty('lines')) {
							let lines = [];

							for (let line of chunk.lines) {
								lines.push(this.pad(line.name + ':', ' ', 16) + line.value);
							}

							return lines.join(EOL);
						}
					}

					else if (chunk.type === this.types.TABLE) {
						if (chunk.hasOwnProperty('lines')) {
							let lines = [this.pad('', '-', width, this.padding.RIGHT)];

							let headers = [
								'Qty',
								this.pad('Unit $', ' ', 10, this.padding.LEFT),
								this.pad('GST', ' ', 9, this.padding.LEFT),
								this.pad('Amt', ' ', 10, this.padding.LEFT)
							].join('');

							lines.push(this.pad('Product', ' ', width - headers.length) + headers);
							lines.push(this.pad('', '-', width, this.padding.RIGHT));

							for (let line of chunk.lines) {
								let summary = [
									line.qty + 'x',
									this.pad('$' + (line.cost / 100).toFixed(2), ' ', 10, this.padding.LEFT),
									this.pad('$' + (line.cost / 1000).toFixed(2), ' ', 9, this.padding.LEFT),
									this.pad('$' + (line.qty * (line.cost / 100)).toFixed(2), ' ', 10, this.padding.LEFT)
								].join('');

								lines.push(this.pad(line.item, ' ', width - summary.length) + summary);
							}

							lines.push(this.pad('', '-', width, this.padding.RIGHT));

							return lines.join(EOL);
						}
					}

					else {
						if (chunk.hasOwnProperty('value')) {
							if (chunk.type === this.types.GENERAL_LEFT) return this.pad(chunk.value, ' ', width, this.padding.RIGHT);
							if (chunk.type === this.types.GENERAL_RIGHT) return this.pad(chunk.value, ' ', width, this.padding.LEFT);
							if (chunk.type === this.types.GENERAL_CENTER) return this.pad(chunk.value, ' ', width, this.padding.CENTER);
						}
					}
				}

				return '';
			});

			return groups.join(EOL);
		},

		pad(value, char, length, side = 'right') {
			let padding = '';
			let required = Math.floor(length) - value.length;

			while (required > 0) {
				required -= 1;

				if (side === this.padding.LEFT) value = char + value;
				if (side === this.padding.RIGHT) value = value + char;

				if (side === this.padding.CENTER) {
					if (required % 2 === 0) value = char + value;
					else value = value + char;
				}
			}

			return side === this.padding.LEFT ? padding + value : value + padding;
		}
	};
})();