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
            default: {
                0: 'www',
            },
            sticky: {
                1: true,
                b: {
                    _: true,
                },
                f: {
                    _: true,
                },
            },
            alias: {
                1: {
                    tag: 't',
                },
                b: {
                    1: {
                        hot: 'hotentry',
                        list: 'entrylist',
                        get new(){ return this.list; },
                        e: 'entry',
                    },
                    2: {
                        fav: 'favorite',
                    },
                    hotentry: {
                        2: {
                            soc: 'social',
                            eco: 'economics',
                            get politics(){ return this.eco; },
                            get pol(){ return this.eco; },
                            ent: 'entertainment',
                            get sports(){ return this.ent; },
                            get star(){ return this.ent; },
                            science: 'knowledge',
                            get sci(){ return this.science; },
                            get academic(){ return this.science; },
                            get ac(){ return this.science; },
                            web: 'it',
                            anime: 'game',
                            neta: 'fun',
                        },
                    },
                    get entrylist(){ return this.hotentry; },
                },
                d: {
                    2: {
                        profile: 'about',
                    },
                },
                h2: {
                    1: {
                        '*': '*/',
                    },
                },
                r: {
                    2: {
                        table: '?mode=table',
                        get t(){ return this.table; },
                    },
                },
                s: {
                    1: {
                        '*': '*/',
                    },
                },
            },
        },
        statuscode: {
            domain: 'status-code.com',
        },
    }, ARGV.defs);

    var jump = function(d, url) {
        var refresh = [
            '<html><head><meta http-equiv="refresh" content="0;url=',
            url,
            '" /></head></html>',
        ].join('');
        setTimeout(function() {
            d.location.href = [
                'data:text/html;charset=utf-8,',
                encodeURIComponent(refresh),
            ].join('');
        }, 0);
    };
    var schemeRegex = new RegExp('s?https?://');

    (function(d, def, ar) {
        if (!def) throw TypeError('no definition for ' + ARG0);
        var dom = def.domain;
        var loc = d.location.href.replace(schemeRegex, '').split('/');
        var re = '^(?:([a-z0-9.]*)\\.)?'+dom;
        loc[0] = (loc[0].match(new RegExp(re,'i'))||[])[1];
        if (ar[ar.length-1] == '*') {
            while (ar.length < loc.length) ar.push(undefined);
        }

        ar = Array.reduce(ar, function(p, c, i) {
            var [ path, alias, sticky, defau ] = p;
            c = c || ((sticky[i] || sticky._) && '*') || defau[i];
            c = (alias[i]||{})[c] || (alias._||{})[c] || c;
            c = (c||'').replace(/\*/g, loc[i]||'');
            c = (c!='/') && c;
            path.push(c);
            alias = override(alias, alias[c]||{});
            sticky = override(sticky, sticky[c]||{});
            defau = override(defau, defau[c]||{});
            return [ path, alias, sticky, defau ];
        }, [ [], def.alias||{}, def.sticky||{}, def.default||{} ])[0];

        var sub = ar.shift();
        var dir = ar.filter(function(x){return x;}).join('/');

        var url = [
            (def.scheme||'http')+':/',
            [ sub, dom ].filter(function(x){return x;}).join('.'),
            dir,
        ].join('/');
        jump(d, url);
    })(document, defs[ARG0], ARGV);
})();
