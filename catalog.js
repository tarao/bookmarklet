var init = (function() {
    var res = Resource.res;
    var lang = Resource.lang;

    var Meta = function(meta) {
        var getProp = function(prop) {
            return meta[prop+'['+lang()+']'] || meta[prop];
        };
        var self = {};
        [ 'title', 'type', 'description', 'option', 'documentation'
        ].forEach(function(prop) {
            self[prop] = getProp(prop) || res('NO_'+prop.toUpperCase());
        });
        return self;
    };

    var SmartKeywordInstruction = function() {
        var self = {};
        self.node = res('INSTRUCTION_SMARKLET');
        document.body.appendChild(self.node);
        new GNN.UI.Draggable(self.node);
        new GNN.UI.Observer(
            GNN.UI.$('instruction-smarklet-close'),
            'onclick',
            function(e) { e.stop(); self.deactivate(); });
        var hideAll = function() {
            GNN.UI.$('instruction-menu').style.visibility = 'hidden';
            GNN.UI.$('instruction-dialog').style.visibility = 'hidden';
            GNN.UI.$('instruction-keyword').style.visibility = 'hidden';
        };
        var transitions = [
            function() { // show menu
                GNN.UI.$('instruction-menu').style.visibility = 'visible';
                GNN.UI.$('instruction-dialog').style.visibility = 'hidden';
                GNN.UI.$('instruction-keyword').style.visibility = 'hidden';
            },
            function() { // show dialog
                GNN.UI.$('instruction-dialog').style.visibility = 'visible';
            },
            function() { // swap dialog
                GNN.UI.$('instruction-dialog').style.visibility = 'hidden';
                GNN.UI.$('instruction-keyword').style.visibility = 'visible';
            }
        ];
        var transit = function() {
            transitions[self.state]();
            self.state = (self.state+1) % transitions.length;
        };
        self.activate = function(target) {
            self.deactivate();
            if (target) {
                var pos = GNN.UI.getPosition(target);
                pos.y += target.offsetHeight + 30;
                self.node.style.left = pos.x+'px';
                self.node.style.top = pos.y+'px';
            }
            self.node.style.visibility = 'visible';
            var [ m, d ] = [
                GNN.UI.$('instruction-menu'), GNN.UI.$('instruction-dialog')
            ];
            self.node.style.width = (m.offsetWidth+d.offsetWidth)+'px';
            self.node.style.height = (m.offsetHeight+d.offsetHeight)+'px';

            self.state = 0;
            self.timer = setInterval(function(){ transit(); }, 1500);
            transit();
        };
        self.deactivate = function() {
            clearInterval(self.timer);
            self.node.style.visibility = 'hidden';
            hideAll();
        };
        return self;
    };
    var instruction;

    var Description = function(file, meta) {
        var desc = res('DESCRIPTION', meta.description);
        if (!meta.permalink && meta.documentation) {
            var p = { permalink: file };
            desc.appendChild(res('DETAIL', GNN.URI.params(p)));
        }
        return desc;
    };

    var showdown = function() {
        if (typeof Showdown == 'undefined') return null;
        if (!Showdown.converter) return null;
        return new Showdown.converter();
    };

    var documentation = function(div, uri) {
        var iframeDoc = function() {
            div.appendChild(res('DOCUMENTATION_FRAME', uri));
        };
        var dom = new GNN.URI(uri).domain;
        var sd = showdown();
        if ((!dom || dom == '.' || dom == GNN.URI.location().domain) &&
            /\.md$/.test(uri) && sd) {
            // FIXME?: support other browsers
            var req = new XMLHttpRequest();
            req.open('GET', uri);
            req.onreadystatechange = function(e) {
                if (req.readyState == 4 && req.status == 200) {
                    var text = sd.makeHtml(req.responseText);
                    div.appendChild(res('DOCUMENTATION_NODE', text));
                }
            };
            req.send(null);
        } else {
            iframeDoc();
        }
    };

    var Catalog = function(catalog, file, permalink) {
        var [ re1, re2 ] = [ new RegExp("\\\\",'g'), new RegExp("'",'g') ];
        var e = function(str) {
            return str.replace(re1, '\\\\').replace(re2, "\\'");
        };
        var meta = new Meta(catalog.list[file]);
        meta.permalink = permalink;
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
                var form = res(id, file, actionText, hiddenText);
                if (meta.type == 'smarklet') {
                    var input = form.input;
                    var help = form.help;
                    new GNN.UI.Observer(help, 'onclick', function(e) {
                        e.stop();
                        instruction.activate(input);
                    });
                    new GNN.UI.Observer(input, 'onfocus', function(e) {
                        e.stop();
                        e.event.target.blur();
                    });
                    form = form.form;
                }
                var desc = new Description(file, meta);
                var entry = res('ENTRY', file, meta, desc, form);
                if (permalink && meta.documentation) {
                    documentation(entry, meta.documentation);
                }
                return entry;
            }
        };
    };

    var addDebugButton = function(div, d) {
        div.appendChild(res('SELECTOR_DEBUG', d));
    }

    var addCatalog = function(div, catalog, file, permalink) {
        var div2 = new Catalog(catalog, file, permalink).toNode();
        if (div2) div.appendChild(div2);
    }

    return function(div, header) {
        instruction = new SmartKeywordInstruction();
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
                    addCatalog(div, catalog, file, uri.params.permalink);
                }
            }
            if (uri.params.permalink) {
                div.appendChild(res('BACK_TO_LIST'));
            }
        });
    }
})();
