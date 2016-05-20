var express = require('express'),
    fs = require('fs'),
    morgan = require('morgan'),
    _ = require('lodash');

var app = express();

app.set('views', __dirname + '/public');
app.set('view engine', 'html');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));

app.get('/api/minions/:sub', function (req, res) {
    var data = fs.readFileSync('data/data.json', 'utf8');
    try {
         res.send(_.flatMap(JSON.parse(data), item =>
            _(item.values)
            .filter({
                sub: req.params.sub
            })
            .map(v => ({
                id: item.id,
                image: item.image,
                name: v.name
            }))
            .value()
        ));
    }
    catch (e) {
        console.error(e);
        res.status(500).send('Something broke! There\'s something wrong with these minions!')
    }
});

app.get('/api/sounds/:id/:sub', function (req, res) {
    var data = JSON.parse(fs.readFileSync('data/data.json', 'utf8'));
    var minion = _.head(_.filter(data, {
        id: parseInt(req.params.id, 10)
    }));
    res.send(_.head(_.filter(minion.values, {
        sub: req.params.sub
    })));
});

var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log('Server is running on port:' + port);
});
