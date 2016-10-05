# Receipt.

Generate receipt-like output.

## Example:

```
const receipt = require('receipt');

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
		{ item: 'Product 2', qty: 1, cost: 17500 },
		{ item: 'Product 3', qty: 2, cost: 900 },
		{ item: 'Product 4', qty: 1, cost: 80 },
		{ item: 'Product 5', qty: 14, cost: 8515 },
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
Product           Qty    Unit $      GST       Amt
--------------------------------------------------
Product 1          1x       $10       $1       $10
Product 2          1x      $175    $17.5      $175
Product 3          2x        $9     $0.9       $18
Product 4          1x      $0.8    $0.08      $0.8
Product 5         14x    $85.16    $8.52  $1192.24
Product 6          3x        $5     $0.5       $15
Product 7          7x    $12.75    $1.28    $89.25
--------------------------------------------------
                                                  
             Some extra information to            
             add to the footer of this            
                      docket.                     
                                                  
GST (10.00%):                AUD XX.XX
Total amount (excl. GST):    AUD XX.XX
Total amount (incl. GST):    AUD XX.XX
                                                  
Amount Received:    AUD XX.XX
Amount Returned:    AUD XX.XX
                                                  
          Final bits of text at the very          
                base of the docket.               
```