'use strict';

const fs = require('fs');
const receipt = require('./src/receipt');

receipt.config.currency = '£';
receipt.config.width = 60;
receipt.config.ruler = '-';

const output = receipt.create([
	{ type: 'center', value: 'MY AWESOME STORE' },
	{ type: 'center', value: '123 STORE ST' },
	{ type: 'center', value: 'store@store.com' },
	{ type: 'center', value: 'www.store.com' },
	{ type: 'empty' },
	{ type: 'properties', lines: [
		{ name: 'Order Number', value: 'XXXXXXXXXXXX' },
		{ name: 'Date', value: 'XX/XX/XXXX XX:XX' }
	] },
	{ type: 'table', lines: [
		{ item: 'Product 1', qty: 1, cost: 1000 },
		{ item: 'Product 2 with a really long name', qty: 1, cost: 17500, discount: { type: 'absolute', value: 1000 } },
		{ item: 'Another product wth quite a name', qty: 2, cost: 900 },
		{ item: 'Product 4', qty: 1, cost: 80, discount: { type: 'percentage', value: 0.15 } },
		{ item: 'This length is ridiculously lengthy', qty: 14, cost: 8516 },
		{ item: 'Product 6', qty: 3, cost: 500 },
		{ item: 'Product 7', qty: 3, cost: 500, discount: { type: 'absolute', value: 500, message: '3 for the price of 2' } }
	] },
	{ type: 'empty' },
	{ type: 'center', value: 'Some extra information to' },
	{ type: 'center', value: 'add to the footer of this' },
	{ type: 'center', value: 'docket.' },
	{ type: 'empty' },
	{ type: 'properties', lines: [
		{ name: 'GST (10.00%)', value: 'AUD XX.XX' },
		{ name: 'Total amount (excl. GST)', value: 'AUD XX.XX' },
		{ name: 'Total amount (incl. GST)', value: 'AUD XX.XX' }
	] },
	{ type: 'empty' },
	{ type: 'properties', lines: [
		{ name: 'Amount Received', value: 'AUD XX.XX' },
		{ name: 'Amount Returned', value: 'AUD XX.XX' }
	] },
	{ type: 'empty' },
	{ type: 'center', value: 'Final bits of text at the very' },
	{ type: 'center', value: 'base of the docket.' }
]);

fs.writeFile('./example.txt', output, (err) => {
	console.log(output);
});