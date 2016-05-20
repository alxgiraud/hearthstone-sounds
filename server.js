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
        .filter({ sub: req.params.sub })
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
    var minion = _.head(_.filter(data, { id: parseInt(req.params.id, 10) }));
    res.send(_.head(_.filter(minion.values, { sub: req.params.sub })));
});

app.get('/init', function (req, res) {

    function callbackCardCrawler(statusCode, result) {
        if (statusCode !== 200) {
            res.send('Error: callbackIdCrawler (' + statusCode + ')');
        } else {
            scraper.getMinions(result, function (minions) {
                fs.writeFile('data/data.json', JSON.stringify(minions), function (err) {
                    if (err) {
                        console.error(err);
                        res.send('Error on init');
                    } else {
                        res.send('Data initialized');
                    }
                });
            });
        }
    }
    
    config.path = '/cards';
    config.setSubdomain('www');

    crawler.getHtml(config, callbackCardCrawler);
});

app.get('/refresh/:start/:end', function (req, res) {
    var data = JSON.parse(fs.readFileSync('data/data.json', 'utf8')),
        start = parseInt(req.params.start, 10),
        end = parseInt(req.params.end, 10);

    function getMinion(i, data) {
        var minion = data[i],
            subdomains = ['www', 'fr', 'de', 'es', 'it', 'pt', 'ru', 'ko', 'cn'],
            completedRequests = 0;

        if (i >= end || typeof minion === 'undefined') {
            fs.writeFile('data/data.json', JSON.stringify(data));
            res.send('Refresh completed: ' + (i - parseInt(req.params.start, 10)) + ' minions refreshed');

        } else {
            minion.values = [];
            config.path = '/card=' + minion.id;


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
                                console.log('[INFO] All sounds added for minion: ' + data[i].id);
                                i += 1;

                                getMinion(i, data);
                            }
                        });
                    }
                }, subdomains[j]);
            }
        }
    }

    getMinion(start, data);
});

app.get('/data', function (req, res) {
    res.sendFile(__dirname + '/data/data.json');
});

var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log('Running on port:' + port);
});
