const express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    usersRoutes = require('./users'),
    port = 3070;

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "id, auth, Origin, X-Requested-With, Content-Type, Accept");
    next();
});  
app.use('/api/users', usersRoutes);

app.get('/', function(req, res) {
    res.send('App works!!');
})

app.listen(port, function(err) {
    console.log('running server on from port:::::::' + port);
});
