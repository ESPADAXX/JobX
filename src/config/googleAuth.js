const { google } = require('googleapis');
const credentials = require('./jobX-446709-ee39336ed062.json');

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });

module.exports = drive;