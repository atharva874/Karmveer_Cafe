const inr=n=>`₹${Number(n||0).toLocaleString('en-IN')}`;
export function buildWhatsAppMessage(order,cafeName='Karmaveer Cafe'){
  return [`${cafeName.toUpperCase()} — NEW ORDER`,'',`Order No: ${order.orderNumber}`,`Date: ${new Date(order.createdAt).toLocaleString('en-IN')}`,`Customer: ${order.customerName}`,`Phone: ${order.customerPhone}`,`Order Type: ${order.orderType}`,'','Items:',...order.items.map((x,i)=>`${i+1}. ${x.name} × ${x.quantity} — ${inr(x.lineTotal)}`),'',`Subtotal: ${inr(order.subtotal)}`,`Additional Charges: ${inr(order.additionalCharges)}`,`Total Payable: ${inr(order.total)}`,...(order.customerNotes?[ '',`Notes: ${order.customerNotes}`]:[]),'',`Thank you for choosing ${cafeName}!`].join('\n');
}
export function buildWhatsAppUrl(order,number='919823739334',cafeName='Karmaveer Cafe'){
 return `https://wa.me/${number}?text=${encodeURIComponent(buildWhatsAppMessage(order,cafeName))}`;
}
