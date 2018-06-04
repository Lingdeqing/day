var express = require('express');
var app = express();

app.get('/getData', function (req, res) {
    if(req.query.callback){
        res.end(`${req.query.callback}('Hello JSONP!')`);
    } else {
        res.header('Access-Control-Allow-Origin', 'http://localhost:63342')
        res.end(`Hello CORS!`);
    }
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});