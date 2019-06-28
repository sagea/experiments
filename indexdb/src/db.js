const connectionMap = new Map();
const transactionMap = new Map();
const createConnection = () => {

}
const promisifyObjectStoreRequest = (objectStoreRequest) => {
    return new Promise((resolve, reject) => {
        objectStoreRequest.addEventListener('success', event => resolve(event.target.result));
        objectStoreRequest.addEventListener('error', event => reject(event.target.error));
    });
}
const connectToDatabase = (databaseName, collectionName) => {
    if (connectionMap.has(databaseName)) {
        return connectionMap.get(databaseName);
    }
    return new Promise((resolve, reject) => {
        const openRequest = indexedDB.open(databaseName, 4);
        openRequest.addEventListener('upgradeneeded', event => {
            const db = openRequest.result;
            // db.createObjectStore(collectionName, { keyPath: 'uid' });
        });
        openRequest.addEventListener('success', event => resolve(openRequest.result));
        openRequest.addEventListener('error', event => reject(event));
    });
}
export const collection = (databaseName, collectionName) => {
    const getDb = async () => await connectToDatabase(databaseName, collectionName);
    return {
        async add(value, key) {
            const db = await getDb();
            const transaction = db.transaction(collectionName, 'readwrite');
            const objectStore = transaction.objectStore(collectionName);
            return await promisifyObjectStoreRequest(objectStore.add(value, key));
        },
        async get(key) {
            const db = await getDb();
            const transaction = db.transaction(collectionName, 'readwrite');
            const objectStore = transaction.objectStore(collectionName);
            return await promisifyObjectStoreRequest(objectStore.get(key));
        }
    };
}