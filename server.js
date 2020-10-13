var express = require('express');
var app = express();

app.use(express.static('./dist/akn-ui'));

app.get('/*', function (req, res) {
    res.sendFile('index.html', { root: 'dist/akn-ui' });
});

app.listen(process.env.PORT || 8080);