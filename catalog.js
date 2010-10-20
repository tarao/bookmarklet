var addDebugButton = function(div, d) {
    with (GNN.UI) {
        var div2 = $new('div');
        var release = $new('a', { klass: 'button' + (d ? '' : ' selected'),
                                  child: $text('release') });
        release.href = './';
        var debug = $new('a', { klass: 'button' + (d ? ' selected' : ''),
                                child: $text('debug') });
        debug.href = './?debug=1';
        div2.appendChild(release);
        div2.appendChild(debug);
        div.appendChild(div2);
    }
}

var addCatalog = function(div, catalog, file) {
    var meta = catalog.list[file];
    var actionText = "javascript:[                                       \
        '" + meta.title + "','" + file + "','" + catalog.base + "'," +
            catalog.nocache + ",                                         \
        function(d,e,c,b,s,n){                                           \
            [e,c,b,s,n]=this;                                            \
            e=d.createElement('script');                                 \
            e.onload=function(){GNN.Let={name:n,arg:'";
    var hiddenText = "'},GNN.lib(b,c),GNN.use(s)};                       \
            e.src=b+'loader.js';                                         \
            e.charset='utf-8';                                           \
            d.body.appendChild(e);                                       \
        }].reverse()[0](document)";
    with (GNN.UI) {
        meta.title = meta.title || 'no title';
        meta.description = meta.description || 'no description';
        var div2 = $new('div', {
            klass: 'bookmarklet-info',
            child: [
                $new('h2', { child: $text(meta.title) }),
                $new('p', { child: $text(meta.description) })
            ]
        });
        if (meta.type == 'smartlet') {
            var form = $new('form');
            form.method = 'get';
            form.action = actionText.replace(/\s+/g,'');
            var p = $new('p');
            var input = $new('input', { klass: 'smart-keyword' });
            input.type = 'text';
            input.name = 's';
            var hidden = $new('input');
            hidden.type = 'hidden';
            hidden.name = 'h';
            hidden.value = hiddenText.replace(/\s+/g,'');
            p.appendChild(input);
            p.appendChild(hidden);
            form.appendChild(p);
            div2.appendChild(form);
        } else {
            var a = $new('a', {
                klass: 'simple',
                child: $text('Add this link (script to load ' + file +
                             ') to your bookmark')
            });
            a.href = actionText + hiddenText;
            div2.appendChild(a);
        }
        div.appendChild(div2);
    }
}

var init = function(div) {
    var div = GNN.UI.$(div);
    var uri = new GNN.URI(location.href);
    new GNN.JSONP(new GNN.URI('./catalog.json'), function(catalog) {
        if (catalog.debug) addDebugButton(div, uri.params.debug);
        if (uri.params.debug) {
            catalog.base = catalog.debug.base;
            catalog.nocache = catalog.debug.nocache;
        }
        for (var file in catalog.list) {
            addCatalog(div, catalog, file);
        }
    });
}
