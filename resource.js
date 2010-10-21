var RESOURCE = {};
var Resource = {
    def: function(id, data) {
        RESOURCE[id] = Resource.fun(data);
    },
    gen: function(context, data) {
        return data && (data.apply ? data.apply(context) : data);
    },
    fun: function(f) {
        if (typeof f != 'function') return f;
        var len = f.length;
        return { apply: function(context) {
            var args = context.args;
            context.args = context.args.slice(-(context.args.length-len));
            return Resource.gen(context, f.apply(null, args));
        } };
    },
    lang: function() {
        if (!this._lang) {
            this._lang = GNN.URI.location().params.lang || document.body.lang;
        }
        return this._lang;
    },
    res: function(/* id[, args...] */) {
        var args=[]; args.push.apply(args, arguments);
        var id = args.shift();
        var data = RESOURCE[id];
        return Resource.gen({ lang: Resource.lang(), args: args }, data);
    },
    L: function(data) {
        data = Resource.fun(data);
        return { apply: function(context) {
            data = Resource.gen(context, data);
            return Resource.gen(context, data[context.lang]);
        } };
    },
    F: function(data) {
        data = Resource.fun(data);
        return { apply: function(context) {
            data =Resource.gen(context, data);
            var r = new RegExp('(?:^%|([^%])%)s');
            while (data.match(r) && context.args.length) {
                var prefix = RegExp.$1 || '';
                data = data.replace(r, prefix + context.args.shift());
            }
            data = data.replace(/%%/, '%');
            return Resource.gen(context, data);
        } };
    },
    A: function(f, data) {
        data = Resource.fun(data);
        return { apply: function(context) {
            context.args = f(context.args);
            return Resource.gen(context, data);
        } };
    }
};
