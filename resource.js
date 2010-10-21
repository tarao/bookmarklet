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
    lang: function() { return document.body.lang; },
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
            data = data[context.lang]
            return Resource.gen(context, data);
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

with (Resource) { with (GNN.UI) {
    def('LANGUAGES', [ 'ja', 'en' ]);
    def('LANG_NAME', function(l) {
        return {
            ja: '日本語',
            en: 'English',
        }[l];
    });

    def('NO_TITLE', L({
        ja: '無題',
        en: 'no title'
    }));
    def('NO_DESCRIPTION', '');
    def('RELEASE', L({
        ja: 'リリース',
        en: 'release'
    }));
    def('DEBUG', L({
        ja: 'デバッグ',
        en: 'debug'
    }));

    def('SELECTOR_LANG', function() {
        return $new('div', {
            klass: 'lang',
            child: res('LANGUAGES').map(function(l) {
                return $new('a', {
                    klass: l==lang() ? 'selected' : '',
                    attr: { href: './index.xhtml.'+l },
                    child: $text(res('LANG_NAME', l))
                });
            })
        });
    });
    def('SELECTOR_DEBUG', function(d) {
        return $new('div', { klass: 'debug-or-release', child: [
            $new('a', {
                klass: (d ? '' : 'selected'),
                attr: { href: './' },
                child: $text(res('RELEASE')) }),
            $new('a', {
                klass: (d ? 'selected' : ''),
                attr: { href: './?debug=1' },
                child: $text(res('DEBUG')) }),
        ] });
    });

    def('ENTRY', function(file, meta, link) {
        return $new('div', {
            klass: 'bookmarklet-info',
            child: [
                $new('h2', { id: file,
                             child: $text(meta.title) }),
                $new('p', { klass: 'description',
                            child: $text(meta.description) }),
                link
            ]
        });
    });
    def('LINK_SMARKLET', function(file, text1, text2) {
        return $new('form', {
            attr: { method: 'get', action: text1 },
            child: $new('p', {
                child: [
                    $new('input', {
                        klass: 'smart-keyword',
                        attr: { type: 'text', name: 's',
                                value: '' } }),
                    $new('input', {
                        attr: { type: 'hidden', name: 'h',
                                value: text2 } })
                ]
            })
        });
    });
    def('LINK_BOOKMARKLET', function(file, text1, text2) {
        return $new('a', {
            klass: 'simple',
            child: $text('Add this link (script to load ' + file +
                         ') to your bookmark'),
            attr: { href: text1 + text2 }
        });
    });
} }
