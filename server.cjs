//express_demo.js 文件
const express = require('express')
const app = express();
const bodyParser = require('body-parser');

const dirname = process.cwd()

// set static file director
app.use('/', express.static( dirname + '/dist' ));
app.use(bodyParser.urlencoded({ extended: false }));
//解析json数据格式
app.use(bodyParser.json())  
// cros

app.get('/', function (req, res) {
    res.sendFile( dirname + "/dist/" + "index.html" );
})

var server = app.listen(81, function () {
 
  var host = server.address().address
  var port = server.address().port

  console.log("website: http://%s:%s", host, port);
  console.log("workdir: %s", dirname);
})