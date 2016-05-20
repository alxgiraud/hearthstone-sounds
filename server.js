var express = require('express'),
    fs = require('fs'),
    morgan = require('morgan'),
    _ = require('lodash'),

    crawler = require('./crawler'),
    scraper = require('./scraper'),
    config = require('./config');

var app = express();

app.set('views', __dirname + '/public');
app.set('view engine', 'html');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));

app.get('/api/minions/:sub', function (req, res) {
    var data = JSON.parse(fs.readFileSync('data/data.json', 'utf8'));
    res.send(_.flatMap(data, item =>
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


app.get('/refresh', function (req, res) {
    res.send('Refresh started');
    var data = [];

    var helper = {

        callbackCardCrawler: function (statusCode, result) {
            if (statusCode !== 200) {
                res.send('Refresh Failed: callbackIdCrawler (' + statusCode + ')');
            } else {
                scraper.getAllMinions(result, function (res) {
                    i = 0;
                    helper.getMinion(i, res);
                });
            }
        },

        getMinion: function (i, data) {
            if (i >= data.length) {
                fs.writeFile('data/data.json', JSON.stringify(data));
                console.log('Refresh completed: ' + i + ' minions inserted');
                fs.appendFile('data/logs.txt', 'Refresh completed: ' + i + ' minions inserted');
            } else {
                var minion = data[i];
                data[i].values = [];
                config.path = '/card=' + minion.id;

                var subdomains = ['www', 'fr', 'de', 'es', 'it', 'pt', 'ru', 'ko', 'cn'];
                var completedRequests = 0;

                for (var j = 0; j < subdomains.length; j += 1) {
                    config.setSubdomain(subdomains[j]);
                    crawler.getHtml(config, function (statusCode, result, subdomain) {

                        res.statusCode = statusCode;

                        if (statusCode !== 200) {
                            res.send('Error: getMinion (' + i + ')');

                        } else {
                            scraper.getSounds(result, function (soundsObject) {
                                data[i].values.push({
                                    sub: subdomain,
                                    name: soundsObject.name,
                                    sounds: soundsObject.sounds
                                });

                                completedRequests += 1;
                                if (completedRequests >= subdomains.length) {
                                    console.log('All sounds added for minion: ' + data[i].id);
                                    fs.appendFile('data/logs.txt', 'All sounds added for minion: ' + data[i].id + '\r\n');
                                    i += 1;
                                    
                                    helper.getMinion(i, data);
                                }
                            });
                        }
                    }, subdomains[j]);
                }
            }
        }
    };

    config.path = '/cards';
    config.setSubdomain('www');
    
    fs.writeFile('data/logs.txt', '----- Refresh logs -----\r\n');
    fs.appendFile('data/logs.txt', new Date().toDateString() + ' ' + new Date().toTimeString() + '\r\n');
    
    crawler.getHtml(config, helper.callbackCardCrawler);

});

app.get('/logs', function (req, res) {
    res.sendFile(__dirname + '/data/logs.txt');
});


var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log('Running on port:' + port);
});
