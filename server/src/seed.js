import 'dotenv/config';
import {ensureSeeded,readDb} from './store.js';
await ensureSeeded();
const db=await readDb();
console.log(`Seed ready: ${db.categories.length} categories, ${db.menu.length} menu items. Existing orders and users were preserved.`);
