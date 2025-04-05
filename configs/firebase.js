const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
const serviceAccount = require('./firebaseConfig.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'pullmeout.appspot.com',
});

function replaceAll(string, search, replace) {
  return string.split(search).join(replace);
}

var bucket = admin.storage().bucket();

async function uploadFile(filename, type, mimeType, path) {
  
  try {
    const token = uuidv4().toString();
    const metadata = {
      metadata: {
        firebaseStorageDownloadTokens: token,
      },
      contentType: mimeType,
    };

    const options = {
      destination: `${type}/${filename}`,
      predefinedAcl: 'publicRead',
      gzip: true,
      metadata: metadata,
    };
    type = replaceAll(type, '/', '%2F');
    let result = await bucket.upload(path, options);
    let url =
      `https://firebasestorage.googleapis.com/v0/b/pullmeout.appspot.com/o/${type}%2F` +
      filename +
      '?alt=media&token=' +
      token;

    console.log(`${path} uploaded.`);
    return url;
  } catch (err) {
    console.log(`MEAAN  APP UPLODE FILE ERROR : ${err.message}`);
    return;
  }
}

module.exports = uploadFile;
