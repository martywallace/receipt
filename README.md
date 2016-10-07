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
		{ item: 'Product 2 with a really long name', qty: 1, cost: 17500, discount: { type: 'absolute', value: 1000 } },
		{ item: 'Another product wth quite a name', qty: 2, cost: 900 },
		{ item: 'Product 4', qty: 1, cost: 80, discount: { type: 'percentage', value: 0.15 } },
		{ item: 'This length is ridiculohusly lengthy', qty: 14, cost: 8516 },
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
============================================================
Qty   Product                                          Total
============================================================
1     Product 1                                       $10.00
1     Product 2 with a really long name              $165.00
        (Item Disc. -$10.00)        
2     Another product wth quite a name                $18.00
1     Product 4                                        $0.68
        (Item Disc. -15%)           
14    This length is ridiculohusly lengthy          $1192.24
3     Product 6                                       $15.00
7     Product 7                                       $89.25
============================================================
                                                            
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