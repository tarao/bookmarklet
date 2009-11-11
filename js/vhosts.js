(function(){
    var override = function(obj, by) {
        by = by||{};
        for (prop in by) {
            if (obj[prop] === null
                || typeof by[prop] != 'object'
                || typeof obj[prop] != 'object') {
                obj[prop] = by[prop];
            } else {
                override(obj[prop], by[prop]);
            }
        }
        return obj;
    };
    var defs = override({
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
                        new: 'entrylist',
                        e: 'entry',
                        tag: 't',
                    },
                    2: {
                        fav: 'favorite',
                    },
                    hotentry: {
                        2: {
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
                    get entrylist() { return this.hotentry; },
                },
            },
        },
        statuscode: {
            domain: 'status-code.com',
        },
    }, ARGV.defs);

    (function(d, def, ar) {
        if (!def) throw TypeError('no definition for ' + ARG0);
        var dom = def.domain;

        ar = Array.reduce((ar||[]).length ? ar : [def.sub], function(p, c, i) {
            var [ path, alias ] = p;
            var c = (alias[i]||{})[c] || (alias._||{})[c] || c;
            path.push(c);
            alias = override(alias, alias[c]||{});
            return [ path, alias ];
        }, [ [], def.alias||{} ])[0];

        var sub = ar.shift();
        var dir = ar.join('/');

        if (!dir) {
            var re = new RegExp('^.+?://(?:[a-z.]*\\.)?'+dom+'/([^/]+)','i');
            dir = d.location.href.match(re)?RegExp.$1:(def.dirs||[]).join('/');
        }
        d.location.href = [
            (def.scheme||'http')+':/',
            [ sub, dom ].filter(function(x){return x;}).join('.'),
            dir,
        ].join('/');
    })(document, defs[ARG0], ARGV);
})();
