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

    var popup = function(captions, text) {
        var body = d.getElementsByTagName('body')[0];

        var cap = d.createElement('span');
        cap.style.zIndex = 10000;
        cap.style.position = 'fixed';
        cap.style.padding = '0 1em';
        cap.style.fontSize = '9pt';
        cap.style.whiteSpace = 'nowrap';
        cap.style.backgroundColor = '#ccccff';

        if (!(captions instanceof Array)) captions = [ captions ];
        for (var i=captions.length; 0 < i; i--) {
            var caption = captions.shift();
            if (typeof caption == 'string') caption=d.createTextNode(caption);
            cap.appendChild(caption);
        }
        body.appendChild(cap);

        var x = 0;
        var y = 0;
        cap.style.left = x + 'px';
        cap.style.top = y + 'px';

        if (text) {
            var t = d.createElement('textarea');
            t.style.zIndex = 10000;
            t.style.position = 'fixed';
            t.style.border = 'solid 4px #cccccc';
            t.style.backgroundColor = '#eeeeee';
            t.style.opacity = 0.9;
            t.style.width = '20em';

            t.addEventListener('blur', function() {
                cap.parentNode.removeChild(cap);
                t.parentNode.removeChild(t);
            }, false);

            t.appendChild(d.createTextNode(text));
            body.appendChild(t);

            y += cap.offsetHeight + 4;
            t.style.left = x + 'px';
            t.style.top = y + 'px';

            t.focus();
            t.select();
        } else {
            var close = d.createElement('a');
            close.href = location.href;
            close.addEventListener('click', function(e) {
                cap.parentNode.removeChild(cap);
                if (e.stopPropagation) {
                    e.stopPropagation();
                    e.preventDefault();
                } else {
                    e.cancelBubble = true;
                    e.returnValue = false;
                }
            }, false);
            close.appendChild(d.createTextNode('close'));
            cap.appendChild(d.createTextNode(' '));
            cap.appendChild(close);
        }
    };

    if (!argv.defs || !argv.defs.login || !argv.defs.apiKey) {
        var yourApiKey = 'http://bit.ly/a/your_api_key';
        if (location.href == yourApiKey) {
            var login = d.getElementById('bitly_login');
            var apiKey = d.getElementById('bitly_api_key');
            if (login.value && apiKey.value) {
                var loc = "javascript:['bit.ly',true,'http://github.com/tarao/bookmarklet/raw/master/js/bit.ly.js',function(d,i,e,z){ARG0=this.pop();ARGV='%s'.split(/\s+/);" + "ARGV.defs={login:'" + login.value + "',apiKey:'" + apiKey.value + "'};z=this.pop();for(i=this.length;--i;d.body.appendChild(e))e=d.createElement('script'),e.src=this[i]+(z&&'?'+encodeURI(Date())||''),e.charset='utf-8'}].reverse()[0](document)";
                popup([
                    'Override the location of this bookmarklet ',
                    'by the following text.',
                    d.createElement('br'),
                    'After that, you will be able to get short URL for ',
                    'the page you are visiting by opening the bookmarklet.'
                ], loc)
            } else {
                popup([
                    "Couldn't get your ID or API key.",
                    d.createElement('br'),
                    "Are you sure you've logged in with your bit.ly account?",
                    d.createElement('br'),
                    'If you are sure, ',
                    'then please contact the developer of this bookmarklet.'
                ]);
            }
        } else {
            var a = d.createElement('a');
            a.href = yourApiKey;
            a.appendChild(d.createTextNode(yourApiKey));
            popup([
                'You must first setup your login ID and API key ',
                'for using bit.ly API.',
                d.createElement('br'),
                'Visit ', a, ' and run this bookmark again, ',
                'and then follow the instruction.'
            ]);
        }
        return;
    }

    var api = 'http://api.bit.ly/v3/shorten?';
    var url = argv[0] || location.href;
    var defs = override({
        domain: 'j.mp',
        format: 'json',
        longUrl: encodeURIComponent(url)
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
