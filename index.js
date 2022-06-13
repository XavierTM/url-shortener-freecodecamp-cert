
console.clear();


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const { Entry } = require('./db');
const dns = require('dns');
const { URL } = require('url');


function isURL(url) {

  let hostname;

  try {
    const urlObject = new URL(url);

    if (urlObject.protocol.indexOf('http') !== 0)
      return false;

    hostname = urlObject.hostname;

  } catch (err) {

    return false;

  };

  

  
  return new Promise(resolve => {

    dns.lookup(hostname, function(err) {
      console.log(String(err));
      if (err)
        resolve(false);
      else
        resolve(true);
    })
  })
}


// Basic Configuration
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', async function(req, res) {

  const url = req.body.url;


  if (!url) {
    return res.send({ error: 'url is required' });
  }

  const urlValid = await isURL(url);
  console.log(`url ${url} valid: ${urlValid}`);

  if (!urlValid) {
    return res.send({ error: 'invalid url' });
  }

  const entry = await Entry.create({ url });

  res.send({
    shorturl: entry.id,
    original_url: url
  });

});

app.all('/api/shorturl/:short_url', async function(req, res) {

  console.log('Short URL:', req.params.short_url);

  const entry = await Entry.findOne({ where: { id: req.params.short_url } });

  if (!entry) {
    console.log('Not Found');
    return res.send({ error: 'Wrong format' });
  }

  // res.redirect(entry.url);
  res.status(307);
  res.header('location', entry.url);
  res.send();

});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
