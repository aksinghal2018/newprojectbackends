const fs = require('fs');
const PDFDocument=require('pdfkit')
module.exports=function createInvoice(invoice, path) {
	let doc = new PDFDocument({ margin: 50 });

	generateHeader(doc,invoice);
	generateHeader1(doc,invoice);
	generateCustomerInformation(doc, invoice);
	generateInvoiceTable(doc, invoice);
	generateFooter(doc,invoice);
    //console.log(doc)
    console.log(path)
	doc.end();
	doc.pipe(fs.createWriteStream(path));
}
var data1=0
function generateHeader(doc,invoice) {
	const shipping = invoice.shipping;
	console.log(invoice)
	doc
		.fillColor('#444444')
		.fontSize(17)
		.text('Final Details for Order', 220, 45)
		.fontSize(12)
		.text(`#${invoice.order_id}`, 223, 65)
		.moveDown();
}

function generateHeader1(doc,invoice) {
	doc
	.fillColor('blue')
	.fontSize(16)
	.text(`${invoice.shipping.name}`,60,100)
	.fillColor("black")
	.fontSize(16)
	.text("Status:",60,120)
	.fontSize(12)
	.fillColor('red')
	.text(`${invoice.status}`,120,120)
	.fontSize(12)
	.fillColor('black')
		.text('Order Placed at : ', 60, 140)
		.fontSize(14)
		.text(`${invoice.order_date}`,160,140)
		.fontSize(12)
	.fillColor('Black')
		.text("Neosoft.in Order NO.",60,160)
		.fontSize(12)
		.text(`${invoice.order_id}`,180,160)
		.fillColor('Black')
		.fontSize(12)
		.text("Order Total.",60,180)
		.fontSize(12)
		.text(solveitems(invoice)+"Rs",150,180)
		.text("------------------------------------------------------------------------------------------------------------------------",60,200)
		.fillColor("Black")
		.fontSize(15)
		.text(`Order on ${invoice.order_date}`,240,220)
		.text("------------------------------------------------------------------------------------------------",60,240)
		.text("Item Ordered",60,260)
		.text("Address",400,120)
		.fontSize(12)
		.text(`${invoice.shipping.address}`,400,140)
		.text(`${invoice.shipping.city} ${invoice.shipping.state}`,400,160)
		.text(`${invoice.shipping.country}  ${invoice.shipping.pincode}`,400,180)
		
}

function generateCustomerInformation(doc, invoice) {
	const shipping = invoice.shipping;

	
}
function generateTableRow(Size,doc, index,y, c1, c2, c3, c4, c5) {
	data1=y
	var i = c1.indexOf(' ');
var partOne = c1.slice(0, 25).trim();
var partTwo = c1.slice(25, c1.length).trim();
	doc
	.text(index,44,y)
	.fontSize(Size-2)
		.text(partOne, 60, y)
		.text(partTwo, 60, y+30)
		.fontSize(Size)
		.text(c2, 230, y)
		.text(c3, 280, y, { width: 90, align: 'right' })
		.text(c4, 370, y, { width: 90, align: 'right' })
		.text(c5, 0, y, { align: 'right' });
}
function generateInvoiceTable(doc, invoice) {
	let i,
		invoiceTableTop = 300;
        generateTableRow(16,
			doc,
			"#",
			invoiceTableTop,
			"Item",
			"Price",
			"Quantity",
			"Disc(%)",
			"Amount"
		);
		//console.log(invoice.items)
	for (i = 0; i < invoice.items.length; i++) {
		const item = invoice.items[i];
		console.log(item.name)
		const position = invoiceTableTop + (i + 1) * 60;
		generateTableRow(12,
			doc,
			i+1,
			position,
			item.name,
			item.price,
			item.quantity,
			invoice.discount,
			Math.floor(item.price*item.quantity*(100-invoice.discount)*0.01)
		);
	}
}
function generateFooter(doc,invoice) {
	
	doc
	.fontSize(16)
		.fillColor("grey")
		.text(' Total Amount', 450, data1+30)
		.fontSize(20)
		.fillColor("red")
		.text(solveitems(invoice)+"Rs",450,data1+50)
		.fillColor("black")
	.fontSize(
		10,
	).text(
		`Thanks for Purchasing these items and great day ahead. `,
		50,
		data1+80,
		{ align: 'center', width: 450 },
	);
}
function solveitems(invoice){
	var sum1=0
	invoice.items.map(item=>{
		sum1=sum1+item.price*item.quantity*(100-invoice.discount)*0.01
	})
	return Math.floor(sum1)
}