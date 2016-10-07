'use strict';

const fs = require('fs');
const receipt = require('./src/receipt');

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
		{ item: 'Product 2 With A Really Long Name', qty: 1, cost: 17500 },
		{ item: 'Product 3', qty: 2, cost: 900 },
		{ item: 'Product 4', qty: 1, cost: 80 },
		{ item: 'Product 5', qty: 14, cost: 8516 },
		{ item: 'Product 6', qty: 3, cost: 500 },
		{ item: 'Product 7', qty: 7, cost: 1275 }
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