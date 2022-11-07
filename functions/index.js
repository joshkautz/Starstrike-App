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

        // Get the authenticated user via the GitHub API.
        const getUserRequest = await axios({
            method: 'GET',
            url: 'https://api.github.com/user',
            headers: { 'Authorization': `Bearer ${accessTokenRequest.data.access_token}`, 'Accept': 'application/vnd.github+json' }
        });

        // Store the Access Token in Firestore using the Firebase Admin SDK.
        await admin.firestore().collection('authorizations').doc(`${getUserRequest.data.id}`).set(accessTokenRequest.data, { merge: true });

        // Redirect to Starstruck website success screen!
        response.redirect('https://starstrike.app?authorization=succeeded');
    } catch (error) {
        // Log the error.
        functions.logger.error(error);

        // Redirect to Starstruck website error screen!
        response.redirect('https://starstrike.app?authorization=failed');
    }
});

// Triggered upon creation of documents in the `/authorizations` Firestore collection.
// Creates a new repository for the GitHub user via the GitHub REST API.
exports.createRepo = functions.firestore.document('/authorizations/{documentId}')
    .onCreate(async (snap, context) => {
        try {
            // Get the current value of what was written to Firestore.
            const data = snap.data();

            // Create a new repository using the GitHub API.
            const createRepoRequest = await axios({
                method: 'POST',
                url: 'https://api.github.com/user/repos',
                headers: { 'Authorization': `Bearer ${data.access_token}` },
                data: { "name": `Starstrike` }
            });

            // Add the authenticated user's repository to the Firestore document using the Firebase Admin SDK.
            snap.ref.update({
                full_name: createRepoRequest.data.full_name
            });
        } catch (error) {
            // Log the error.
            functions.logger.error(error);
        }
    });


exports.starRepos = functions.pubsub.schedule('every 1 hours').onRun(async (context) => {
    const promises = [];

    try {
        // Retrieve all authorizations from Firestore.
        const querySnapshot = await admin.firestore().collection('authorizations').get();

        // Star each authorization in Firestore with each authorization in Firestore.
        querySnapshot.forEach((documentToAuthenticate) => {
            const documentToAuthenticateData = documentToAuthenticate.data();

            querySnapshot.forEach((documentToStar) => {
                const documentToStarData = documentToStar.data();

                const starRepoRequest = axios({
                    method: 'PUT',
                    url: `https://api.github.com/user/starred/${documentToStarData.full_name}`,
                    headers: { 'Authorization': `Bearer ${documentToAuthenticateData.access_token}`, 'Accept': 'application/vnd.github+json' }
                });

                promises.push(starRepoRequest);
            });
        });

    } catch (error) {
        // Log the error.
        functions.logger.error(error);
    }

    // Return a promise to ensure all GitHub Star API requests complete.
    return Promise.all(promises);
});