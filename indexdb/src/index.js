import { collection } from './db.js';
(async () => {
    const db = collection('TestDatabase', 'test');
    const result = await db.get('fffff2');
    console.log(result);
})();
