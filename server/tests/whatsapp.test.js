import test from 'node:test';
import assert from 'node:assert/strict';
import {buildWhatsAppMessage,buildWhatsAppUrl} from '../src/whatsapp.js';
const order={orderNumber:'KCF-2026-0001',createdAt:'2026-10-20T08:00:00.000Z',customerName:'Rahul Patil',customerPhone:'9899999999',orderType:'takeaway',items:[{name:'Masala Tea',quantity:2,lineTotal:50}],subtotal:50,additionalCharges:0,total:50,customerNotes:'No sugar'};
test('WhatsApp message includes order summary, totals, and notes',()=>{const s=buildWhatsAppMessage(order);assert.match(s,/KCF-2026-0001/);assert.match(s,/Masala Tea × 2 — ₹50/);assert.match(s,/Total Payable: ₹50/);assert.match(s,/Notes: No sugar/);});
test('WhatsApp link uses official wa.me number and URL-encodes the order',()=>{const url=buildWhatsAppUrl(order);assert.match(url,/^https:\/\/wa\.me\/919823739334\?text=/);assert.match(url,/%0A/);assert.ok(decodeURIComponent(url.split('text=')[1]).includes('Customer: Rahul Patil'));});
