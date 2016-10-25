# Receipt.

Generate receipt-like output for printing in a kiosk, POS system, etc.

## Configuration.

Some aspects of the output can be configured via the `config` property:

```
const receipt = require('receipt');

receipt.config.currency = '$'; // The currency symbol to use in output.
receipt.config.width = 50;     // The amount of characters used to give the output a "width".
receipt.config.ruler = '=';    // The character used for ruler output.
```

## Example:

```
const receipt = require('receipt');

receipt.config.currency = '£';
receipt.config.width = 60;
receipt.config.ruler = '-';

const output = receipt.create([
	{ type: 'text', value: [
		'MY AWESOME STORE',
		'123 STORE ST',
		'store@store.com',
		'www.store.com'
	], align: 'center' },
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
	{ type: 'text', value: 'Some extra information to add to the footer of this docket.', align: 'center' },
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
	{ type: 'text', value: 'Final bits of text at the very base of a docket. This text wraps around as well!', align: 'center', padding: 5 }
]);

console.log(output);
```

Which generates:

```
                 MY AWESOME STORE                 
                   123 STORE ST                   
                  store@store.com                 
                   www.store.com                  
                                                  
Order Number:    XXXXXXXXXXXX
Date:            XX/XX/XXXX XX:XX
--------------------------------------------------
Qty   Product                                Total
--------------------------------------------------
1     Product 1                             £10.00
1     Product 2 with a really long nam     £165.00
        (Item Disc. -£10.00)
2     Another product wth quite a name      £18.00
1     Product 4                              £0.68
        (Item Disc. -15%)
14    This length is ridiculously leng    £1192.24
3     Product 6                             £15.00
3     Product 7                             £10.00
        (3 for the price of 2)
--------------------------------------------------
                                                  
  Some extra information to add to the footer of  
                   this docket.                   
                                                  
GST (10.00%):                AUD XX.XX
Total amount (excl. GST):    AUD XX.XX
Total amount (incl. GST):    AUD XX.XX
                                                  
Amount Received:    AUD XX.XX
Amount Returned:    AUD XX.XX
                                                  
     Final bits of text at the very base of a     
      docket. This text wraps around as well!     
```

## Formatting.

When creating a receipt, simply feed in an array of "chunks". Each chunk defines the format for that
chunk, the value to output and other auxiliary information depending on the chunk type.

The inbuilt chunk types and their formats are:

<table>
	<thead>
		<tr>
			<th>Name</th>
			<th>Description</th>
			<th>Schema</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>text</code></td>
			<td>Normal input text. Text will wrap across multiple lines depending on the <code>width</code> configured.</td>
			<td><pre>{
	value: string|string[],
	align?: string,
	padding?: number
}</pre></td>
		</tr>
		<tr>
			<td><code>empty</code></td>
			<td>An empty line.</td>
			<td><pre>{ }</pre></td>
		</tr>
		<tr>
			<td><code>ruler</code></td>
			<td>A ruler, that being a whole line made up of what is configured for <code>ruler</code>.</td>
			<td><pre>{ }</pre></td>
		</tr>
		<tr>
			<td><code>properties</code></td>
			<td>A list of "properties". Each property has a <code>name</code> which appears on the left, and a <code>value</code> which appears on the right. The property values are lined up based on the longest property name.</td>
			<td><pre>{
	lines: {
		name: string,
		value: string
	}[]
}</pre></td>
		</tr>
		<tr>
			<td><code>table</code></td>
			<td>A breakdown table including item quantity, name and price. Items can also include discounts. Total price is automatically calculated based on the quantity and unit price.</td>
			<td><pre>{
	lines: {
		item: string,
		qty: number,
		cost: number,
		discount?: {
			type: string,
			value: number,
			message?: string
		}
	}[]
}</pre></td>
		</tr>
	</tbody>
</table>

## Custom Formatters.

You can define your own formatting types using `addFormatter()`:

```
const receipt = require('receipt');

receipt.addFormatter('custom', function(chunk) {
	return 'Custom: ' + chunk.value;
});

let output = receipt.create([{ type: 'custom', value: 'Test' }]);
```

The formatters are bound to `receipt`, so you are able to access the configuration via `this.config`
or other formatters via `this.formatters.x` etc.