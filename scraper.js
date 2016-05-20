var cheerio = require('cheerio'),
    _ = require('lodash');

exports.getSounds = function (html, callbackScraper) {

    var obj = {
        sounds: []
    };

    var $ = cheerio.load(html);

    var id = 0;

    obj.name = $('.heading-size-1').first().text();
    $('#sounds').find('audio').each(function (i) {
        id += 1;
        obj.sounds.push({
            id: id,
            sources: []
        });

        $(this).find('source').each(function () {
            if (typeof obj.sounds[i] !== 'undefined') {
                obj.sounds[i].sources.push({
                    src: $(this).attr('src'),
                    type: $(this).attr('type'),
                    extension: '.' + $(this).attr('src').split('.').pop()
                });
            }
        });
    });

    $('#sounds').find('a').each(function (i) {
        if (typeof obj.sounds[i] !== 'undefined') {
            obj.sounds[i].event = $(this).text();
        }
    });


    callbackScraper(obj);
};

exports.getAllMinions = function (html, callbackScraper) {
    var $ = cheerio.load(html),
        rawScript = $('script:contains(\'var hearthstoneCards\')').text(),
        regex = /\[(.*?)\];/,
        resultRegex = regex.exec(rawScript),
        data,
        minions;

    if (typeof resultRegex !== 'undefined' && resultRegex !== null) {
        data = JSON.parse(resultRegex[0]
            .slice(0, -1) // Remove last ';'
            .replace(new RegExp('popularity', 'g'), '"popularity"') // Replace popularity to "popularity" (JSON format)
        );
        minions = _.map(_.filter(data, { 'type': 4 }), function (o) {
            return _.pick(o, ['id', 'image']);
        });
    }
    callbackScraper(minions);
};
