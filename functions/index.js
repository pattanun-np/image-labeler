
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

exports.countDocumentsChange = functions.firestore.document('Files/{uid}/Images/{imagesId}').onWrite((change,context) => {

  const uid = context.params.uid;
  const filesRef = db.collection('Files').doc(uid)
  let FieldValue = require('firebase-admin').firestore.FieldValue;

  if (!change.before.exists) {

    // new document created : add one to count
    filesRef.update({ numberOfDocs: FieldValue.increment(1),
    });
    console.log("%s numberOfDocs incremented by 1", uid);

  } else if (change.before.exists && change.after.exists) {

    // updating existing document : Do nothing

  } else if (!change.after.exists) {

    // deleting document : subtract one from count
    filesRef.update({ numberOfDocs: FieldValue.increment(-1),
     });
    console.log("%s numberOfDocs decremented by 1", uid);

  }

  return 0;
});
exports.countLabelChange = functions.firestore.document('Lebeled/{uid}/Images/{imagesId}').onWrite((change, context) => {

  const uid = context.params.uid;
  const filesRef = db.collection('Lebeled').doc(uid)
  let FieldValue = require('firebase-admin').firestore.FieldValue;

  if (!change.before.exists) {

    // new document created : add one to count
    filesRef.update({
      numberOfLabeled: FieldValue.increment(1),
    });
    console.log("%s numberOfDocs incremented by 1", uid);

  } else if (change.before.exists && change.after.exists) {

    // updating existing document : Do nothing

  } else if (!change.after.exists) {

    // deleting document : subtract one from count
    filesRef.update({
      numberOfLabeled: FieldValue.increment(-1),
    });
    console.log("%s numberOfDocs decremented by 1", uid);

  }

  return 0;
});