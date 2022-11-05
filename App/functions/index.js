// Promise based HTTP client for the browser and node.js.
const axios = require('axios').default;

// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
if (admin.apps.length === 0) {
    admin.initializeApp();
}


// Store the Authorization Code in Firestore, and use it to generate an Access Token. Redirect to Starstruck website.
exports.authorization = functions.https.onRequest(async (request, response) => {
    try {
        // Request an Access Token from GitHub using the Axios library.
        const response = await axios({
            method: 'POST',
            url: `https://github.com/login/oauth/access_token?client_id=9637b925c8fc340a9c4c&client_secret=${process.env.CLIENT_SECRET}&code=${request.query.code}`,
            headers: { 'Accept': 'application/json' }
        });

        if (response.status != 200)
            throw 'Error retrieving Access Token';

        // Store the Access Token in Firestore using the Firebase Admin SDK.
        const writeResult = await admin.firestore().collection('authorizations').add(response.data);

        // Redirect to Starstruck website success screen!
        response.redirect('https://joshkautz.github.io/Starstruck-GitHub-App/');
    } catch (error) {
        // Log the error.
        functions.logger.error(error);

        // Redirect to Starstruck website error screen!
        response.redirect('https://www.google.com/');
    }
});

// Triggered upon creation of documents in the `/authorizations` Firestore collection.
// Creates a new repository for the GitHub user via the GitHub REST API.
exports.createRepo = functions.firestore.document('/authorizations/{documentId}')
    .onCreate((snap, context) => {
        try {
            // Grab the current value of what was written to Firestore.
            const data = snap.data();

            // Create a new repository using the GitHub API.
            return axios({
                method: 'POST',
                url: 'https://api.github.com/user/repos',
                headers: { 'Authorization': `Bearer ${data.access_token}` },
                json: { "name": `Starstruck-${context.params.documentId}` }
            });
        } catch (error) {
            // Log the error.
            functions.logger.error(error);
        }
    });

// Receive GitHub Hooks to monitor if users uninstall the GitHub App or Revoke Authorization.
// exports.hook = functions.https.onRequest(async (request, response) => {
//     // Log the original request.
//     functions.logger.log(request);

//     // TODO: Remove user from Firestore. (Delete their repo? Have users unstar their repo?)

//     // Send back a message that we've successfully written the message.
//     response.json(request);
// });

// Store the GitHub passed to this HTTP endpoint and insert it into 
// Firestore under the path /installations/:documentId
// exports.install = functions.https.onRequest(async (request, response) => {
//     // Log the original request.
//     functions.logger.log(request.query);

//     // Push the new message into Firestore using the Firebase Admin SDK.
//     const writeResult = await admin.firestore().collection('installations').add(request.query);

//     // Send back a message that we've successfully written the message.
//     response.json(writeResult);
// });