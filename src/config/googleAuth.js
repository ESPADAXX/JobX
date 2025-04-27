const { google } = require('googleapis');
const credentials = require('./jobx-458123-d3df768fed22.json');

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });

module.exports = drive;