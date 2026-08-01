const admin = require("firebase-admin");

console.log("PROJECT_ID =", process.env.FIREBASE_PROJECT_ID);
console.log("CLIENT_EMAIL =", process.env.FIREBASE_CLIENT_EMAIL);
console.log("PRIVATE_KEY EXISTS =", !!process.env.FIREBASE_PRIVATE_KEY);

try {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
      }),
    });
  }

  console.log("Firebase initialized successfully");
} catch (e) {
  console.error("FIREBASE INIT ERROR");
  console.error(e);
  throw e;
}

const db = admin.firestore();

module.exports = { admin, db };
