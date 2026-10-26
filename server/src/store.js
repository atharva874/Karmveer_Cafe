import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {categories as cafeCategories,menu as cafeMenu} from './cafe-menu.js';
const here=path.dirname(fileURLToPath(import.meta.url));
export const dataDir=path.resolve(here,'../',process.env.DATA_DIR||'data');
const file=path.join(dataDir,'db.json');
export const defaultDb={users:[],categories:cafeCategories,menu:cafeMenu,orders:[],inquiries:[],settings:{cafeName:'Karmaveer Cafe',subtitle:'Amruttulya',description:'A welcoming neighbourhood stop for freshly prepared tea, comforting snacks, and an easy cafe break.',phone:'+91 98237 39334',whatsappNumber:'919823739334',address:'Near PVGCOE,Meri,Mhasrul,422004',mapEmbedUrl:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59973.28316302952!2d73.73604893125001!3d20.036607499999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bddeb50e4ec9c9d%3A0x33674db454bcce87!2sKARMVEER%20CAFE%20(Amruttulya%20)!5e0!3m2!1sen!2sin!4v1792486585471!5m2!1sen!2sin',businessHours:'Sample hours — please confirm with the cafe.',facilities:['Comfortable seating','Takeaway options','Freshly prepared','Friendly service','Easy location access','Quick service'],enabledOrderTypes:['takeaway','dine-in'],charges:0}};
let queue=Promise.resolve();
export async function ensureSeeded(){await fs.mkdir(dataDir,{recursive:true});try{await fs.access(file);}catch{await writeDb(defaultDb);}}
export async function readDb(){await ensureSeeded();return JSON.parse(await fs.readFile(file,'utf8'));}
async function writeDb(db){const tmp=`${file}.${process.pid}.${Date.now()}.tmp`;await fs.writeFile(tmp,JSON.stringify(db,null,2),'utf8');try{await fs.rename(tmp,file);}catch(err){if(!['EPERM','EEXIST'].includes(err.code))throw err;const backup=`${file}.${process.pid}.bak`;let hadFile=false;try{await fs.rename(file,backup);hadFile=true;}catch(e){if(e.code!=='ENOENT')throw e;}try{await fs.rename(tmp,file);if(hadFile)await fs.rm(backup,{force:true});}catch(e){if(hadFile)await fs.rename(backup,file).catch(()=>{});throw e;}}}
export async function updateDb(fn){const job=queue.then(async()=>{const db=await readDb();const result=await fn(db);await writeDb(db);return result;});queue=job.catch(()=>{});return job;}
