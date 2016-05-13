var express = require('express'),
    fs = require('fs'),
    morgan = require('morgan'),

    crawler = require('./crawler'),
    scraper = require('./scraper'),
    config = require('./config');

var app = express();

app.set('views', __dirname + '/public');
app.set('view engine', 'html');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));


app.get('/api/language', function (req, res) {
    var language = req.acceptsLanguages('es', 'zh', 'de', 'fr', 'it', 'ko', 'pt', 'ru', 'cn');

    if (language === 'zh') {
        language = 'cn';
    }

    if (!language) {
        language = 'www';
    }

    res.send(language)
});


app.get('/api/card/:id/:sub', function (req, res) {
    function callbackCrawler(statusCode, result) {
        res.statusCode = statusCode;

        if (statusCode !== 200) {
            res.send(result);
        } else {
            scraper.getSoundsJSON(result, function (json) {
                res.send(json);
            });
        }
    }

    config.setSubdomain(req.params.sub);
    config.path = '/card=' + req.params.id;

    crawler.getHtml(config, callbackCrawler);

});

app.get('/refresh', function (req, res) {

    function callbackCrawler(statusCode, result, subdomain) {
        completedRequests += 1;
        if (completedRequests >= subdomains.length) {
            res.send('Refresh completed');
        }
        res.statusCode = statusCode;

        if (statusCode !== 200) {
            completedRequests = subdomain.length;
        } else {
            scraper.getAllDataJSON(result, function (json) {
                fs.writeFile('./public/data/data-' + subdomain + '.json', json);
            });
        }
    }

    var subdomains = ['www', 'fr', 'de', 'es', 'it', 'pt', 'ru', 'ko', 'cn'];
    var completedRequests = 0;

    config.path = '/cards';

    for (var i = 0; i < subdomains.length; i += 1) {
        config.setSubdomain(subdomains[i]);
        crawler.getHtml(config, callbackCrawler, subdomains[i]);
    }
});

var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log('Running on port:' + port);
});
