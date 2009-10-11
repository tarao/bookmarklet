(function(){
    var defs = {
        gnn: {
            domain: 'orezdnu.org',
            alias: {
                0: {
                    l: 'localweb',
                },
            },
        },
        hatena: {
            domain: 'hatena.ne.jp',
            sub: 'www',
            alias: {
                b: {
                    1: {
                        hot: 'hotentry',
                        list: 'entrylist',
                        e: 'entry',
                    },
                    2: {
                        fav: 'favorite',
                        soc: 'social',
                        eco: 'economics',
                        politics: 'economics',
                        pol: 'economics',
                        ent: 'entertainment',
                        sports: 'entertainment',
                        star: 'entertainment',
                        science: 'knowledge',
                        sci: 'knowledge',
                        academic: 'knowledge',
                        ac: 'knowledge',
                        web: 'it',
                        anime: 'game',
                        neta: 'fun',
                    },
                },
            },
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
        var resolve = function(alias, i, name) {
            return (alias[i]||{})[name] || (alias._||{})[name];
        };
        var a1 = def.alias||{};
        sub = resolve(a1, 0, sub) || sub;
        var a2 = (def.alias||{})[sub]||{};
        ar = ar.map(function(v,i) {
            return resolve(a2,i+1,v) || resolve(a1,i+1,v) || v;
        });
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
