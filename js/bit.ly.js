(function(d, argv) {
    var override = function(obj, by) {
        by = by||{};
        for (var prop in by) {
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

    var JSONP = override(function(uri, obj, method) {
        if (JSONP.callbacks.length || JSONP.queue.length) {
            JSONP.queue.push({ uri: uri, obj: obj, method: method});
            JSONP.deq();
            return null;
        }
        return JSONP.add(uri, obj, method);
    }, {
        add: function(uri, obj, method) {
            var callback = '&callback=GNN.JSONP.callback';
            var timestamp = '&timestamp='+encodeURI(new Date());

            if (typeof(obj) == 'function' && typeof(method) == 'undefined') {
                obj = { callback: obj };
                method = 'callback';
            }

            var self = {};
            if (obj && method) JSONP.addCallback(obj, method);
            self.script = document.createElement('script');
            self.script.src = uri+callback+timestamp;
            self.script.type = 'text/javascript';
            document.getElementsByTagName('head')[0].appendChild(self.script);
            return self;
        },
        addCallback: function(obj, method) {
            JSONP.callbacks.push({ object: obj, method: method });
        },
        callback: function(args) {
            JSONP.callbacks.forEach(function(cb) {
                cb.object[cb.method].call(cb.object, args);
            });
            JSONP.callbacks = [];
        },
        deq: function() {
            if (!JSONP.queue.length) return; // queue is already empty
            if (JSONP.callbacks.length) {
                setTimeout(function(){ JSONP.deq(); }, 200);
                return;
            }
            var q = JSONP.queue.shift();
            JSONP.add(q.uri, q.obj, q.method);
        },
        callbacks: [],
        queue: []
    });
    if (typeof window.GNN == 'undefined') window.GNN = {};
    window.GNN.JSONP = JSONP;

    var popup = function(caption, text) {
        var body = d.getElementsByTagName('body')[0];
        var t = d.createElement('textarea');
        t.style.position = 'fixed';
        t.style.border = 'solid 4px #cccccc';
        t.style.backgroundColor = '#eeeeee';
        t.style.opacity = 0.9;
        t.style.width = '20em';

        var cap = d.createElement('span');
        cap.style.position = 'fixed';
        cap.style.padding = '0 1em';
        cap.style.fontSize = '9pt';
        cap.style.whiteSpace = 'nowrap';
        cap.style.backgroundColor = '#cccccc';
        cap.appendChild(d.createTextNode(caption));
        body.appendChild(cap);

        t.addEventListener('blur', function() {
            cap.parentNode.removeChild(cap);
            t.parentNode.removeChild(t);
        }, false);

        t.appendChild(d.createTextNode(text));
        body.appendChild(t);

        var x = 0;
        var y = 0;
        cap.style.left = x + 'px';
        cap.style.top = y + 'px';
        y += cap.offsetHeight + 4;
        t.style.left = x + 'px';
        t.style.top = y + 'px';

        t.focus();
        t.select();
    };

    var api = 'http://api.bit.ly/v3/shorten?';
    var url = argv[0] || location.href;
    var defs = override({
        domain: 'j.mp',
        format: 'json',
        longUrl: encodeURI(url)
    }, argv.defs);

    var params = []; for (var p in defs) params.push(p+'='+defs[p]);
    new JSONP(api+params.join('&'), function(res) {
        if (res.status_code == 200) {
            popup("Shor URL for '" + url + "'", res.data.url);
        } else {
            alert('failed: ' + res.status_code);
        }
    });
})(document, ARGV);
