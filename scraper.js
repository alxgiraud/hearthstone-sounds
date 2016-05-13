var cheerio = require('cheerio');

exports.getSoundsJSON = function (html, callbackScraper) {

    var obj = {
        sounds: []
    };

    var $ = cheerio.load(html);
    
    var id = 0;
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


    callbackScraper(JSON.stringify(obj, null, 4));
};


exports.getAllDataJSON = function (html, callbackScraper) {
    var $ = cheerio.load(html);
    var rawScript = $('script:contains(\'var hearthstoneCards\')').text();
    var regex = /\[(.*?)\];/;
    var resultRegex = regex.exec(rawScript);    
    var data;
    
    if (typeof resultRegex !== 'undefined' && resultRegex !== null) {
        data = JSON.parse(resultRegex[0]
            .slice(0, -1) // Remove last ';'
            .replace(new RegExp('popularity', 'g'), '"popularity"') // Replace popularity to "popularity" (JSON format)
        );
    }


    callbackScraper(JSON.stringify(data, null, 4));
};
