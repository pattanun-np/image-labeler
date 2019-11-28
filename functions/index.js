
// Keeps track of the length of the 'likes' child list in a separate property.
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

exports.countImagesChange = functions.firestore.document('Files/{uid}/Images/{imagesId}').onWrite((change, context) => {

  const uid  = context.params.uid;
  const categoryRef = db.collection('Files').doc(uid).collection('Images')
  let FieldValue = require('firebase-admin').firestore.FieldValue;

  if (!change.before.exists) {

    // new document created : add one to count
    categoryRef.set({
      numberOfDocs: FieldValue.increment(1)
    });
    console.log("%s numberOfDocs incremented by 1",uid);

  } else if (change.before.exists && change.after.exists) {

    // updating existing document : Do nothing

  } else if (!change.after.exists) {

    // deleting document : subtract one from count
    categoryRef.set({
      numberOfDocs: FieldValue.increment(-1)
    });
    console.log("%s numberOfDocs decremented by 1", uid);

  }

  return 0;
});