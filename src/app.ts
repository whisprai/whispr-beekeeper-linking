import express from 'express';
import request from 'request';

const app = express();

module.exports.app = app;

const port = 3000;
app.use(express.static('public'))
app.get('/apple-app-site-association', (req, res) => {
    res.send({
        "applinks": {
            "apps": [],
            "details": [
                {
                    "appID": "NG3WB68YZJ.ai.whispr.works",
                    "paths": [ "beekeeperlogin/*"]
                }
            ]
        }
    })
});

app.get('/beekeeperlogin/:userid/:hash', (req, res) => {
    const URL = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data='+req.originalUrl;
    request(URL, (err, response, body) => {
        if (err || response.statusCode !== 200) {
            return res.sendStatus(500);
          }
    const html = `
    <!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
.button {
  background-color: #4D80F5;
  border: none;
  color: white;
  padding: 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
}
.a {
  text-decoration: none;
}

.button1 {border-radius: 12px;}

</style>
</head>
<body>

<button class="button button1">
    <div>Download from Testflight</div>
    <a href="https://testflight.apple.com/join/jYgnNSbZ"></a>
</button>
<br>
<br>
Or scan this code to download <br>or open from another phone:
<br>
<br>
<img src="${URL}"></img>
</body>
</html>`;
    res.send(html);
});
});
app.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});

