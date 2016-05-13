var config = {};

/* proxy * /
config.host = 'proxy.foobar.com';
config.port = 8080;
config.path = '';
config.method = 'GET';
config.headers = {
    Host: ''
};
/* */

/* no-proxy */
config.host = '';
config.port = 80;
config.path = '';
config.method = 'GET';
/* */

config.setSubdomain = function (sub) {
    var subdomain = (
        sub === 'fr' ||
        sub === 'de' ||
        sub === 'es' ||
        sub === 'it' ||
        sub === 'pt' ||
        sub === 'ru' ||
        sub === 'ko' ||
        sub === 'cn') ? sub : 'www';
    
    //config.headers.Host = subdomain + '.hearthhead.com'; //proxy
    config.host = subdomain + '.hearthhead.com'; //no-proxy
}


module.exports = config;
