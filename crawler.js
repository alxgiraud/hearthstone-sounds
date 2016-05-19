var http = require('http');

exports.getHtml = function (options, onResult, subdomain) {
    var req = http.get(options, function (res) {
        var output = '';
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function () {
            onResult(res.statusCode, output, subdomain);
        });
    });

    req.on('error', function (err) {
        onResult(500, err);
    });

    req.end();
};
