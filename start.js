const {upload} = require('./dist');
const uuid = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

const headless = (process.argv[3] === undefined) ? true : (process.argv[3] === 'true')

const _upload = async (req, currentKey) => {
  const argv = req.body;
  // const credentials = { email: argv.email, pass: argv.password, recoveryemail: argv.recovery_email, job_id: argv.job_id}
  const credentials = { email: 'asd576225953@gmail.com', pass: argv.password, recoveryemail: argv.recovery_email, job_id: argv.job_id}
  const video1 = {
    path: argv.path,
    title: argv.title,
    description: argv.description.slice(0, 4900) + `\n${currentKey}`,
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
  credentials.port = process.argv[4] || 9222
  return await upload(credentials, [video1], { headless: headless, args: [ '--no-sandbox', '--disable-setuid-sandbox' ], 'executablePath': '/Applications/Thorium.app/Contents/MacOS/Thorium'})
}

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

let lock = false

const getKey = () => {
  const newUuid = uuid.v4();
  return newUuid.slice(0, 4)
}

const currentTime = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const seconds = String(currentDate.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

app.post('/upload', async (req, res) => {
  if (lock) {
    res.end(JSON.stringify({reject: true}));
    return
  }
  lock = true
  const cacheFolder = '/tmp/uploadJob'
  fs.mkdirSync(cacheFolder, { recursive: true })

  const currentKey = getKey()
  const argv = req.body;
  const jobId = argv.job_id;
  const cachePath = `${cacheFolder}/${jobId}.txt`
  if (fs.existsSync(cachePath)) {
    const videoLink = fs.readFileSync(cachePath, 'utf8');
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({video: [videoLink]}));
    return
  }
  _upload(req, currentKey).then((videoLink) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({video: videoLink}));
    fs.writeFileSync(cachePath, videoLink[0], 'utf8');
    lock = false
    console.log(`${currentTime()} [info]|KEY:[${currentKey}]|JOBID[${jobId}]:`, videoLink)

  }).catch((e) => {
    const error = new Error(e);
    console.log(`${currentTime()} [error]|KEY:[${currentKey}]|JOBID[${jobId}]:`, error)
    res.end(JSON.stringify({error: error.message}));
    lock = false
  })
});

const port = process.argv[2] || 3000;

app.listen(Number(port), () => {
  console.log(`Server running on port ${port}`);
});