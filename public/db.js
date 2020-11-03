let db;
// create a new db request for a "budget" database.
const request = window.indexedDB.open("budget", 1);

request.onupgradeneeded = function (event) {
    const db = event.target.result;
    // create object store called "pending" and set autoIncrement to true
    db.createObjectStore("pending", {
        autoIncrement: true
    })
};

request.onsuccess = function (event) {
    db = event.target.result;

    if (navigator.onLine) {
        checkDatabase();
    }
};


request.onerror = function (event) {
    // log error here
    console.log("Error")
};

function saveRecord(record) {
    // create a transaction on the pending db with readwrite access
    // request.onsuccess = () => {

    // const transactions = db.transaction(??)
    const transaction = db.transaction(["pending"], "readwrite");

    // access your pending object store
    const pendingStore = transaction.objectStore("pending");
    // add record to your store with add method.
    pendingStore.add(record);
}

function checkDatabase() {
    // open a transaction on your pending db

    const transaction = db.transaction(["pending"], "readwrite");
    const pendingStore = transaction.objectStore("pending");
    // access your pending object store

    // get all records from store and set to a variable
    // const getAll = ??

    const getAll = pendingStore.getAll();
    // getAllPend.onsuccess = () => {
    //   console.log(getAllPend.result);

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then(() => {
                    // if successful, open a transaction on your pending db
                    const transaction = db.transaction(["pending"], "readwrite");
                    const pendingStore = transaction.objectStore("pending");
                    // access your pending object store
                    // clear all items in your store
                    pendingStore.clear();


                })
        }
    };

}

// listen for app coming back online
window.addEventListener('online', checkDatabase);
