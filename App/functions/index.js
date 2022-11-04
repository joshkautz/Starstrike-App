// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

// Take the GitHub Payload passed to this HTTP endpoint and insert it into 
// Firestore under the path /users/:documentId
exports.install = functions.https.onRequest(async (request, response) => {
    // Log the original request.
    functions.logger.log(request);

    // Push the new message into Firestore using the Firebase Admin SDK.
    // const writeResult = await admin.firestore().collection('users').add(request);
    
    // Send back a message that we've successfully written the message.
    response.json({'message': 'Successfully Installed'});
});

// Listens for new documents added to /users/:documentId and performs actions
// with the GitHub Starring REST API.
// exports.createRepo = functions.firestore.document('/users/{documentId}')
//     .onCreate((snap, context) => {
//         functions.logger.log(snap);
//         functions.logger.log(snap.data());

//         // Grab the current value of what was written to Firestore.
//         // const data = snap.data();

//         // Access the parameter `{documentId}` with `context.params`
//         // functions.logger.log('Accessing GitHub Starring REST API.', context.params.documentId, data);

//         // Create Repo
//         // Star other Repos.
//         // Have other users star this repo.

//         // You must return a Promise when performing asynchronous tasks inside a Functions such as
//         // writing to Firestore.
//         // Setting an 'uppercase' field in Firestore document returns a Promise.
//         // return snap.ref.set({ uppercase }, { merge: true });

//         return;
//     });

// Receive GitHub Hooks to monitor if users uninstall the GitHub App or Revoke Authorization.
exports.hook = functions.https.onRequest(async (request, response) => {
    // Log the original request.
    functions.logger.log(request);
    
    // TODO: Remove user from Firestore. (Delete their repo? Have users unstar their repo?)

    // Send back a message that we've successfully written the message.
    response.json({'message': 'Hook Received'});
});