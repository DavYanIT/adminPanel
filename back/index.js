const express = require('express'),
    app = express(),
    port = 3070;

app.get('/', function(req, res) {
    res.send('App works!!');
})

app.listen(port, function(err) {
    console.log('running server on from port:::::::' + port);
});
