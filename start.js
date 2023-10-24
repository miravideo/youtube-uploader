const {upload} = require('./dist');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const headless = (process.argv[3] === undefined) ? true : (process.argv[3] === 'true')

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
    subtitle: argv.subtitle,
    playlist: argv.playlist,
    job_id: argv.job_id
  }
  const currentTime = new Date();
  console.log(currentTime.toLocaleString(), ': ', video1)
  return await upload(credentials, [video1], { headless: headless, args: [ '--no-sandbox', '--disable-setuid-sandbox' ], 'executablePath': '/Applications/Thorium.app/Contents/MacOS/Thorium'})
}

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

let lock = false

app.post('/upload', async (req, res) => {
  if (lock) {
    res.end(JSON.stringify({reject: true}));
    return
  }
  lock = true
  _upload(req).then((videoLink) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({video: videoLink}));
    lock = false
  }).catch((e) => {
    const error = new Error(e);
    console.log('error', error)
    res.end(JSON.stringify({error: error.message}));
    lock = false
  })
});

const port = process.argv[2] || 3000;

app.listen(Number(port), () => {
  console.log(`Server running on port ${port}`);
});