const {upload} = require('./dist');
const argv = require('minimist')(process.argv.slice(2));

const credentials = { email: argv.email, pass: argv.password, recoveryemail: argv.recovery_email}
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
  tags: argv.tags.split(','),
  isNotForKid: argv.not_for_kid,
  thumbnail: argv.thumbnail
}
upload(credentials, [video1], { headless: true }).then(console.log)