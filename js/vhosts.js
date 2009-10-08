(function(){
    var defs = {
        gnn: {
            domain: 'orezdnu.org',
        },
        hatena: {
            domain: 'hatena.ne.jp',
            sub: 'www',
        },
        statuscode: {
            domain: 'status-code.com',
        },
    };
    (function(d, def) {
        if (!def) throw TypeError('no definition for ' + ARG0);
        var ar = ARGV;
        var dom = def.domain;
        var sub = ar.shift() || def.sub;
        var dir = ar.join('/');
        if(!dir) {
            var re = new RegExp('^.+?://(?:[a-z.]*\\.)?'+dom+'/([^/]+)','i');
            dir = d.location.href.match(re)?RegExp.$1:(def.dirs||[]).join('/');
        }
        d.location.href = [
            (def.scheme||'http')+':/',
            [ sub, dom ].filter(function(x){return x;}).join('.'),
            dir,
        ].join('/');
    })(document, defs[ARG0]);
})();
