import express from 'express';
import request from 'request';

const app = express();

module.exports.app = app;

app.set('port', process.env.PORT || 8080);

app.use(express.static('public'))

app.get('/apple-app-site-association', (req, res) => {
    res.send({
        "applinks": {
            "appIDs": [ "NG3WB68YZJ.ai.whispr.works" ],
            "components": [
                {
                    "/": "*",
                    "comment": "Allow any path after the domain"
                },
            ],
            "apps": [],
            "details": [
                {
                    "appID": "NG3WB68YZJ.ai.whispr.works",
                    "paths": [ "*" ]
                }
            ]
        }
    })
});

// Doesn't work for devices >= iOS 13, see https://developer.apple.com/documentation/safariservices/supporting_associated_domains
// Remove after above config is proven to work
/*app.get('/apple-app-site-association', (req, res) => {
    res.send({
        "applinks": {
            "apps": [],
            "details": [
                {
                    "appID": "NG3WB68YZJ.ai.whispr.works",
                    "paths": [ "*"]
                }
            ]
        }
    })
});*/

app.get('/.well-known/assetlinks.json', (req, res) => {
  res.send([{
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "ai.whispr.android",
      "sha256_cert_fingerprints":
      ["27:DD:6B:18:1C:D5:FB:2B:21:F3:FC:CF:A4:C8:3C:8C:95:12:4E:D4:7D:DE:87:0E:38:D7:39:47:24:D6:FB:79",
      "82:B1:A6:E5:A8:84:E2:A8:08:1A:9A:E2:86:F3:BB:C6:A4:8A:FE:B4:94:54:DF:DC:06:4B:2B:FE:D3:70:CC:96"]
    }
  }])
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
app.listen(app.get('port'), err => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${app.get('port')}`);
});

