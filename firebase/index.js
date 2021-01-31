var admin = require("firebase-admin");

var serviceAccount = require("../sdk/dumtick-dbb42-firebase-adminsdk-rqhz3-ee49d32d5a.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://dumtick-dbb42-default-rtdb.firebaseio.com/",
});

module.exports.admin = admin;
