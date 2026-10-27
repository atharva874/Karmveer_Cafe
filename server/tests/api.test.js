import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../.api-test-data');
process.env.NODE_ENV='test';process.env.DATA_DIR=root;process.env.JWT_SECRET='test-secret-long-enough-for-local-api-tests-only';process.env.CLIENT_ORIGIN='http://localhost:5173';process.env.COOKIE_SECURE='false';
let server,base,store;
before(async()=>{await fs.rm(root,{recursive:true,force:true});const [{default:app},s]=await Promise.all([import('../src/app.js'),import('../src/store.js')]);store=s;server=app.listen(0);await new Promise(resolve=>server.once('listening',resolve));base=`http://127.0.0.1:${server.address().port}/api`;});
after(async()=>{if(server)await new Promise(resolve=>server.close(resolve));await fs.rm(root,{recursive:true,force:true});});
async function request(route,{method='GET',body,cookie}={}){const response=await fetch(`${base}${route}`,{method,headers:{...(body?{'content-type':'application/json'}:{}),...(cookie?{cookie}: {})},body:body?JSON.stringify(body):undefined});return {status:response.status,data:await response.json(),cookie:response.headers.get('set-cookie')?.split(';')[0],setCookie:response.headers.get('set-cookie')};}
test('anonymous session check returns signed-out state and production cookies support cross-site auth',async()=>{
  const anonymous=await request('/auth/me');assert.equal(anonymous.status,200);assert.equal(anonymous.data.user,null);
  const reg=await request('/auth/register',{method:'POST',body:{name:'Cookie Test',email:'cookie@example.com',phone:'+919800000004',password:'StrongPassword1!'}});assert.equal(reg.status,201);
  process.env.NODE_ENV='production';
  try{const login=await request('/auth/login',{method:'POST',body:{email:'cookie@example.com',password:'StrongPassword1!'}});assert.equal(login.status,200);assert.match(login.setCookie,/SameSite=None/i);assert.match(login.setCookie,/;\s*Secure/i);}
  finally{process.env.NODE_ENV='test';}
});
test('auth, authorization, guest and registered orders, server pricing, admin workflow, and contact validation',async()=>{
  const denied=await request('/admin/dashboard');assert.equal(denied.status,401);
  const badLogin=await request('/auth/login',{method:'POST',body:{email:'nobody@example.com',password:'wrong-pass'}});assert.equal(badLogin.status,401);
  const reg=await request('/auth/register',{method:'POST',body:{name:'Test Customer',email:'test@example.com',phone:'+919800000001',password:'StrongPassword1!'}});assert.equal(reg.status,201);assert.equal(reg.data.user.role,'customer');assert.equal('passwordHash' in reg.data.user,false);const customerCookie=reg.cookie;
  const validLogin=await request('/auth/login',{method:'POST',body:{email:'test@example.com',password:'StrongPassword1!'}});assert.equal(validLogin.status,200);assert.ok(validLogin.cookie);
  const guest=await request('/orders',{method:'POST',body:{customerName:'Guest Customer',customerPhone:'989800000002',orderType:'takeaway',items:[{id:'cutting-chai',quantity:2,price:0.01}]}});assert.equal(guest.status,201);assert.equal(guest.data.order.total,30);assert.equal(guest.data.order.items[0].price,15);
  const guestBill=await request(`/orders/${guest.data.order.id}/bill`);assert.equal(guestBill.status,200);assert.equal(guestBill.data.order.paymentStatus,'Unpaid');
  const own=await request('/orders',{method:'POST',cookie:customerCookie,body:{customerName:'Test Customer',customerPhone:'+919800000001',orderType:'takeaway',items:[{id:'vada-pav',quantity:2}]}});assert.equal(own.status,201);
  const foreign=await request(`/orders/${own.data.order.id}`);assert.equal(foreign.status,401);
  const second=await request('/auth/register',{method:'POST',body:{name:'Other Customer',email:'other@example.com',phone:'+919800000003',password:'OtherStrongPass2!'}});const otherOrder=await request(`/orders/${own.data.order.id}`,{cookie:second.cookie});assert.equal(otherOrder.status,403);
  const badOrder=await request('/orders',{method:'POST',body:{customerName:'Bad Guest',customerPhone:'bad',orderType:'takeaway',items:[]}});assert.equal(badOrder.status,400);
  await store.updateDb(db=>{db.menu.find(x=>x.id==='cutting-chai').isAvailable=false;db.users.push({id:'admin-test',name:'Cafe Admin',email:'admin@example.com',phone:'',passwordHash:'unused',role:'admin',createdAt:new Date().toISOString()});});
  const unavailable=await request('/orders',{method:'POST',body:{customerName:'Guest Customer',customerPhone:'989800000002',orderType:'takeaway',items:[{id:'cutting-chai',quantity:1}]}});assert.equal(unavailable.status,400);
  const jwt=(await import('jsonwebtoken')).default;const adminCookie=`kc_session=${jwt.sign({id:'admin-test',role:'admin'},process.env.JWT_SECRET)}`;
  const dashboard=await request('/admin/dashboard',{cookie:adminCookie});assert.equal(dashboard.status,200);assert.equal(dashboard.data.totalOrders,2);
  const status=await request(`/admin/orders/${own.data.order.id}/status`,{method:'PATCH',cookie:adminCookie,body:{status:'Accepted'}});assert.equal(status.status,200);assert.equal(status.data.order.orderStatus,'Accepted');
  const createMenu=await request('/admin/menu',{method:'POST',cookie:adminCookie,body:{name:'Test Snack',description:'Test item',categoryId:'snacks',price:22,image:'',isVegetarian:true,isAvailable:true,isPopular:false}});assert.equal(createMenu.status,201);
  const editMenu=await request(`/admin/menu/${createMenu.data.item.id}`,{method:'PATCH',cookie:adminCookie,body:{name:'Updated Snack',description:'Updated',categoryId:'snacks',price:25,image:'',isVegetarian:true,isAvailable:true,isPopular:false}});assert.equal(editMenu.status,200);assert.equal(editMenu.data.item.price,25);
  const invalidContact=await request('/contact',{method:'POST',body:{name:'A',contact:'x',message:'x'}});assert.equal(invalidContact.status,400);
  const contact=await request('/contact',{method:'POST',body:{name:'Cafe Guest',contact:'guest@example.com',message:'Can I ask about opening hours?'}});assert.equal(contact.status,201);
});
