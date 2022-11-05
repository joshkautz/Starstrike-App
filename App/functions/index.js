// Promise based HTTP client for the browser and node.js.
const axios = require('axios').default;

// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
if (admin.apps.length === 0) {
    admin.initializeApp();
}

// Use the Authorization Code to generate an Access Token. Store the Access Token in Firestore. Redirect to Starstruck website.
exports.authorization = functions.https.onRequest(async (request, response) => {
    try {
        // Request an Access Token from GitHub using the Axios library.
        const accessTokenRequest = await axios({
            method: 'POST',
            url: `https://github.com/login/oauth/access_token?client_id=9637b925c8fc340a9c4c&client_secret=${process.env.CLIENT_SECRET}&code=${request.query.code}`,
            headers: { 'Accept': 'application/json' }
        });

        functions.logger.info(createRepoRequest.data);

        // Store the Access Token in Firestore using the Firebase Admin SDK.
        await admin.firestore().collection('authorizations').add(accessTokenRequest.data);

        // Redirect to Starstruck website success screen!
        response.redirect('https://joshkautz.github.io/Starstruck-GitHub-App?authorization=succeeded');
    } catch (error) {
        // Log the error.
        functions.logger.error(error);

        // Redirect to Starstruck website error screen!
        response.redirect('https://joshkautz.github.io/Starstruck-GitHub-App?authorization=failed');
    }
});

// Triggered upon creation of documents in the `/authorizations` Firestore collection.
// Creates a new repository for the GitHub user via the GitHub REST API.
exports.createRepo = functions.firestore.document('/authorizations/{documentId}')
    .onCreate(async (snap, context) => {
        try {
            // Get the current value of what was written to Firestore.
            const data = snap.data();

            functions.logger.info(context.params.documentId, data);

            // Create a new repository using the GitHub API.
            const createRepoRequest = await axios({
                method: 'POST',
                url: 'https://api.github.com/user/repos',
                headers: { 'Authorization': `Bearer ${data.access_token}` },
                data: { "name": `Starstruck-${context.params.documentId}` }
            });

            functions.logger.info(createRepoRequest.data);

            // Get the authenticated user using the GitHub API.
            const getAuthenticatedUserRequest = await axios({
                method: 'GET',
                url: 'https://api.github.com/user',
                headers: { 'Authorization': `Bearer ${data.access_token}` }
            });

            functions.logger.info(getAuthenticatedUserRequest.data);

            // Add the username of the authenticated user to the Firestore document using the Firebase Admin SDK.
            snap.ref.update({
                user: getAuthenticatedUserRequest.data.login,
                documentId: context.params.documentId
            });
        } catch (error) {
            // Log the error.
            functions.logger.error(error);
        }
    });


// exports.starRepos = functions.pubsub.schedule('every 1 hours').onRun(async (context) => {
//     // Retrieve all Access Tokens from Firestore.
//     const querySnapshot = await admin.firestore().collection('authorizations').get();

//     querySnapshot.forEach((document) => {
//         // doc.data() is never undefined for query doc snapshots
//         console.log(doc.id, " => ", doc.data());

//         // Authenticate as user, and Star each repository  (which is available in the results from the initial query)
//     });
    
    
//     console.log('This will be run every 5 minutes!');
//     return null;
// });