const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
// // Create and Deploy Your First Cloud Functions //
// https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions
    .https
    .onRequest((request, response) => {
        response.send("Hello from Firebase!");
    });
exports.dataCounts = functions
    .database
    .ref('/UserData/files/{userId}/{pushId}')
    .onWrite(async(change) => {
        const collectionRef = change.after.ref.parent;
        const countRef = collectionRef
            .parent
            .child('Data_Counts');

        let increment;
        if (change.after.exists() && !change.before.exists()) {
            increment = 1;
        } else if (!change.after.exists() && change.before.exists()) {
            increment = 0;
        } else {
            return null;
        }

        // Return the promise from countRef.transaction() so our function waits for this
        // async event to complete before it exits.
        await countRef.transaction((current) => {
            return (current || 0) + increment;
        });
        console.log('Counter updated.');
        return null;
    });

// If the number of likes gets deleted, recount the number of likes
exports.recountData = functions
    .database
    .ref('/UserData/files/{UserId}/{pushId}/Data_Counts')
    .onDelete(async(snap) => {
        const counterRef = snap.ref;
        const collectionRef = counterRef
            .parent
            .child('Data_Counts');

        // Return the promise from counterRef.set() so our function waits for this async
        // event to complete before it exits.
        const messagesData = await collectionRef.once('value');
        return await counterRef.set(messagesData.numChildren());
    });


 exports.gendata = functions
     .database
     .ref('/Labeled_Images/{userId}/{pushId}')
     .onWrite(async (change) => {
         const collectionRef = change.after.ref.parent;
         const countRef = collectionRef
             .parent
             .child('Label_Counts');

         let increment;
         if (change.after.exists() && !change.before.exists()) {
             increment = 1;
         } else if (!change.after.exists() && change.before.exists()) {
             increment =0;
         } else {
             return null;
         }

         // Return the promise from countRef.transaction() so our function waits for this
         // async event to complete before it exits.
         await countRef.transaction((current) => {
             return (current || 0) + increment;
         });
         console.log('Counter updated.');
         return null;
     });

 // If the number of likes gets deleted, recount the number of likes
 exports.recountgen = functions
     .database
     .ref('/Labeled_Images/{userId}/{pushId}')
     .onDelete(async (snap) => {
         const counterRef = snap.ref;
         const collectionRef = counterRef
             .parent
             .child('Label');

         // Return the promise from counterRef.set() so our function waits for this async
         // event to complete before it exits.
         const messagesData = await collectionRef.once('value');
         return await counterRef.set(messagesData.numChildren());
     });

exports.gendata = functions
    .storage
    .ref('/Labeled_Images/{userId}/{pushId}')
    .onWrite(async (change) => {
        const collectionRef = change.after.ref.parent;
        const countRef = collectionRef
            .parent
            .child('Label_Counts');

        let increment;
        if (change.after.exists() && !change.before.exists()) {
            increment = 1;
        } else if (!change.after.exists() && change.before.exists()) {
            increment = 0;
        } else {
            return null;
        }

        // Return the promise from countRef.transaction() so our function waits for this
        // async event to complete before it exits.
        await countRef.transaction((current) => {
            return (current || 0) + increment;
        });
        console.log('Counter updated.');
        return null;
    });
