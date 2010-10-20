(function() {
    var URI = GNN.inherit(function(str) {
        var sch;
        if (new RegExp('^([^:]+)://').test(str)) sch = RegExp.$1;
        var uri = str.replace(new RegExp('^([^:]+)://'), '').split('/');
        var dom = uri.shift();
        uri = uri.filter(function(v){ return v.length!=0; });
        var params = {};
        var last = uri.pop();
        var q = '?';
        if (last && /=/.test(last)) {
            if (/\?(.*)$/.test(last)) {
                last = RegExp.$1;
                q = '?';
            }
            last.split(/&/).forEach(function(v) {
                if (/^([^=]+)=(.*)$/.test(v)) {
                    params[RegExp.$1] = RegExp.$2;
                } else {
                    params['_flags'] = params['_flags'] || [];
                    params['_flags'].push(v);
                }
            });
        } else if (last) {
            uri.push(last)
        }
        var self = {
            scheme: sch,
            domain: dom,
            local: uri,
            params: params,
            q: q
        };
        self.toString = function() {
            params = [];
            for (var p in self.params) {
                if (p == '_flags') {
                    params += self.params[p];
                } else {
                    var val = self.params[p];
                    var encoded = URI.encode(val);
                    params.push(p + '=' + (/%/.test(val) ? val : encoded));
                }
            }
            var s = self.domain+'/'+self.local.join('/');
            if (self.scheme) s = self.scheme+'://'+s;
            params = params.join('&');
            return params.length ? s + self.q + params : s;
        };
        return self;
    }, {
        encode: function(str/*, unsafe*/) {
            var unsafe = arguments[1] || '[^\\w\\d]';
            var s = '';
            var len = str.length;
            for (var i=0; i < len; i++) {
                var ch = str.charAt(i);
                var code = str.charCodeAt(i);
                if (!new RegExp('^'+unsafe+'$').test(ch) || ch > 0xff) {
                    s += ch;
                } else {
                    s += '%'+code.toString(16);
                }
            }
            return s;
        }
    });
    GNN.URI = URI;
})();
