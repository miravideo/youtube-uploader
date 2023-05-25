const {upload} = require('./dist');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const _upload = async (req) => {
  const argv = req.body;
  const credentials = { email: argv.email, pass: argv.password, recoveryemail: argv.recovery_email, job_id: argv.job_id}
  const video1 = {
    path: argv.path,
    title: argv.title,
    description: argv.description,
    onProgress: (progress) => { console.log('progress', progress) },
    onSuccess: (result) => console.log('result', result),
    channelName: argv.channel_name,
    language: argv.language,
    // publishType: argv.publish_type,
    gameTitleSearch: argv.category,
    tags: argv.tags,
    isNotForKid: argv.not_for_kid,
    thumbnail: argv.thumbnail,
    subtitle: argv.subtitle
  }
  console.log('video1', video1)
  return await upload(credentials, [video1], { headless: true, args: [ '--no-sandbox', '--disable-setuid-sandbox' ], })
}

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.post('/upload', async (req, res) => {
  _upload(req).then((videoLink) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({video: videoLink}));
  }).catch((e) => {
    const error = new Error(e);
    res.end(JSON.stringify({error: error.message}));
  })
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});