/*
 * @title              hatena
 * @description[en]    A navigator for *.hatena.ne.jp
 * @description[ja]    *.hatena.ne.jp内のページを簡単に開く
 * @documentation[en]  ./doc/hatena.en.md
 * @documentation[ja]  ./doc/hatena.ja.md
 * @type               smarklet
 * @option             def:javascript
 *
 * [TODO]
 * - load user definition
 * - merge other hatena.ne.jp related bookmarklets
 * - support *.hatelabo.jp?
 */

GNN.use([
    'argv.js',
    'navigate.js'
], function() {
    var def = {
        domain: 'hatena.ne.jp',
        'default': {
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
            c: {
                1: {
                    '*': '*/',
                },
            },
            d: {
                2: {
                    profile: 'about',
                },
            },
            f: {
                2: {
                    fav: 'follow',
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
            www: {
                2: {
                    a: 'antenna',
                    fav: 'favorites',
                    fan: 'fans',
                    get follower(){ return this.fan; },
                    friend: 'friends',
                    get f(){ return this.friend; },
                },
            },
        },
    };
    GNN.Let.navigate(def, GNN.Let.argv);
});
