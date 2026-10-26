import 'dotenv/config';
import bcrypt from 'bcryptjs';
import {randomUUID} from 'node:crypto';
import {updateDb} from './store.js';
const email=process.env.BOOTSTRAP_ADMIN_EMAIL?.toLowerCase(),password=process.env.BOOTSTRAP_ADMIN_PASSWORD;
if(!email||!password||password.length<12)throw new Error('Set BOOTSTRAP_ADMIN_EMAIL and a BOOTSTRAP_ADMIN_PASSWORD of at least 12 characters in server/.env first.');
await updateDb(async d=>{const existing=d.users.find(u=>u.email===email);if(existing){if(existing.role!=='admin')existing.role='admin';existing.passwordHash=await bcrypt.hash(password,12);console.log('Existing account promoted to admin and password updated.');return;}d.users.push({id:randomUUID(),name:'Cafe Administrator',email,phone:'',passwordHash:await bcrypt.hash(password,12),role:'admin',createdAt:new Date().toISOString()});console.log('Admin account created.');});
