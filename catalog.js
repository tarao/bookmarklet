var init = (function() {
    var res = Resource.res;
    var lang = Resource.lang;

    var Meta = function(meta) {
        var getProp = function(prop) {
            return meta[prop+'['+lang()+']'] || meta[prop];
        };
        var self = {};
        [ 'title', 'type', 'description', 'option', 'document'
        ].forEach(function(prop) {
            self[prop] = getProp(prop) || res('NO_'+prop.toUpperCase());
        });
        return self;
    };

    var Catalog = function(catalog, file) {
        var [ re1, re2 ] = [ new RegExp("\\\\",'g'), new RegExp("'",'g') ];
        var e = function(str) {
            return str.replace(re1, '\\\\').replace(re2, "\\'");
        };
        var meta = new Meta(catalog.list[file]);
        var actionText = "javascript:[                                       \
            '" + e(meta.title) + "','" + e(file) + "','" + e(catalog.base) +
                "'," + !!catalog.nocache + ",                                \
            function(d,e,c,b,s,n){                                           \
                [e,c,b,s,n]=this;                                            \
                e=d.createElement('script');                                 \
                e.onload=function(){GNN.Let={name:n,arg:'";
        actionText = actionText.replace(/\s+/g,'');
        var hiddenText = "'},GNN.lib(b,c),GNN.use(s)};                       \
                e.src=b+'lib.js';                                            \
                e.charset='utf-8';                                           \
                d.body.appendChild(e);                                       \
            }].reverse()[0](document)";
        hiddenText = hiddenText.replace(/\s+/g,'');
        return {
            meta: meta,
            toNode: function() {
                var id = (meta.type=='smarklet'?'SMARK':'BOOKMARK');
                id = 'LINK_' + id + 'LET';
                return res('ENTRY', file, meta,
                           res(id, file, actionText, hiddenText));
            }
        };
    };

    var addDebugButton = function(div, d) {
        div.appendChild(res('SELECTOR_DEBUG', d));
    }

    var addCatalog = function(div, catalog, file) {
        var div2 = new Catalog(catalog, file).toNode();
        if (div2) div.appendChild(div2);
    }

    return function(div, header) {
        div = GNN.UI.$(div);
        header = GNN.UI.$(header);
        header.appendChild(res('SELECTOR_LANG'));
        var uri = GNN.URI.location();
        new GNN.JSONP(new GNN.URI('./catalog.json'), function(catalog) {
            if (catalog.debug) {
                addDebugButton(div, uri.params.debug);
                if (uri.params.debug) {
                    catalog.base = catalog.debug.base;
                    catalog.nocache = catalog.debug.nocache;
                }
            }
            for (var file in catalog.list) {
                if (!uri.params.permalink ||
                    uri.params.permalink == GNN.URI.encode(file)) {
                    addCatalog(div, catalog, file);
                }
            }
            if (uri.params.permalink) {
                div.appendChild(res('BACK_TO_LIST'));
            }
        });
    }
})();
