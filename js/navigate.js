/*
 * [TODO]
 * - check specification for 'sticky'
 * - function in alias
 * - support multiple domains?
 */
(function () {
    var resolveRequirements = function(body) {
        GNN.require({
            'util.js': 'Let.override',
            'jump.js': 'Let.jump',
        }, body);
    };
    var schemeRegex = new RegExp('^s?https?://');
    var d = document;

    GNN.Let.navigate = function(def, ar) {
        resolveRequirements(function() {
            if (!def) throw TypeError('GNN.Let.navigate: no definition');
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
                alias = GNN.override(alias, alias[c]||{});
                sticky = GNN.override(sticky, sticky[c]||{});
                defau = GNN.override(defau, defau[c]||{});
                return [ path, alias, sticky, defau ];
            }, [ [], def.alias||{}, def.sticky||{}, def.default||{} ])[0];

            var sub = ar.shift();
            var dir = ar.filter(function(x){return x;}).join('/');

            GNN.Let.jump([
                (def.scheme||'http')+':/',
                [ sub, dom ].filter(function(x){return x;}).join('.'),
                dir,
            ].join('/'));
        });
    };
})();
