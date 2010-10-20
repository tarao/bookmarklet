if (typeof GNN == 'undefined') GNN = {};
GNN.Loader = function(base, noCache) {
    var self = {}; var d = document;
    self.load = function(scripts, callback, error) {
        (scripts instanceof Array) || (scripts = [ scripts ]);
        (typeof callback != 'function') && (callback = function(){});
        (typeof error != 'function') && (error = function(src) {
            throw TypeError('GNN.Loader: Failed to load ' + src);
        });
        var load = function(src) {
            if (noCache) {
                var delim = src.match(/\?/) ? '&' : '?';
                src = src + delim + encodeURI(new Date());
            }
            var isCSS = new RegExp('.css$');
            var isAbs = new RegExp('^[a-z]+://');
            if (isCSS.test(src)) {
                var link = d.createElement('link');
                link.href = src;
                link.type = 'text/css';
                link.rel = 'stylesheet';
                (d.getElementByTagName('head')[0]||d.body).appendChild(link);
                scripts.length ? load(scripts.shift()) : callback();
            } else {
                var script = d.createElement('script');
                script.type = 'text/javascript';
                script.charset = 'utf-8';
                var next = scripts.length && scripts.shift();
                var cb = next ? function() { load(next); } : callback;
                if (window.ActiveXObject) { // IE
                    script.onreadystatechange = function() {
                        (script.readyState == 'complete' ||
                         script.readyState == 'loaded') && cb();
                    };
                } else {
                    script.onload = cb;
                    script.onerror = function() { error(src); };
                }
                script.src = isAbs.test(src) ? src : base + src;
                d.body.appendChild(script);
            }
        };
        load(scripts.shift());
    };
    return self;
};
GNN.lib = function(base, noCache) {
    GNN.use = function(scripts, callback, error) {
        var loader = new GNN.Loader(base, noCache);
        loader.load(scripts, callback, error);
    };
};
