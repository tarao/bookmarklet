/* translations */
with (Resource) { with (GNN.UI) {
    def('NO_TITLE', L({
        ja: '無題',
        en: 'no title',
    }));
    def('NO_DESCRIPTION', '');
    def('RELEASE', L({
        ja: 'リリース',
        en: 'release',
    }));
    def('DEBUG', L({
        ja: 'デバッグ',
        en: 'debug',
    }));
    def('INSTALL', L({
        ja: 'インストール:',
        en: 'Install:',
    }));
    def('LINK_SMARKLET_TEXT', L({
        ja: '右クリック > [この検索にキーワードを設定]',
        en: 'Right click > [Add a Keyword for this Search]',
    }));
    def('LINK_BOOKMARKLET_TEXT', L({
        ja: '右クリック > [このリンクをブックマーク]',
        en: 'Right click > [Bookmark This Link]',
    }));
    def('BACK_TO_LIST_TEXT', L({
        ja: '<< 一覧に戻る',
        en: '<< go back',
    }));
} }

/* generic resource */
with (Resource) { with (GNN.UI) { with (GNN.URI) {
    def('LANGUAGES', [ 'ja', 'en' ]);
    def('LANG_NAME', function(l) {
        return {
            ja: '日本語',
            en: 'English',
        }[l];
    });

    def('SELECTOR_LANG', function() {
        return $new('div', {
            id: 'lang',
            child: res('LANGUAGES').map(function(l) {
                return $new('a', {
                    klass: l==lang() ? 'selected' : '',
                    attr: { href: params({ lang: l }).toLocalPath() },
                    child: $text(res('LANG_NAME', l))
                });
            })
        });
    });
    def('SELECTOR_DEBUG', function(d) {
        return $new('div', { klass: 'debug_or_release', child: [
            $new('a', {
                klass: (d ? '' : 'selected'),
                attr: { href: params({ debug: undefined }).toLocalPath() },
                child: $text(res('RELEASE')) }),
            $new('a', {
                klass: (d ? 'selected' : ''),
                attr: { href: params({ debug: 1 }).toLocalPath() },
                child: $text(res('DEBUG')) }),
        ] });
    });

    def('ENTRY', function(file, meta, link) {
        return $new('div', {
            klass: 'entry',
            child: [
                $new('h2', {
                    id: file,
                    child: $new('a', { child: $text(meta.title), attr: {
                        href: params({ permalink: file }).toLocalPath()
                    } })
                }),
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
                    $new('label', {
                        attr: { 'for': 's' },
                        child: $text(res('INSTALL')) }),
                    $new('input', {
                        klass: 'smarklet',
                        attr: { type: 'text', name: 's',
                                value: res('LINK_SMARKLET_TEXT') } }),
                    $new('input', {
                        attr: { type: 'hidden', name: 'h',
                                value: text2 } })
                ]
            })
        });
    });
    def('LINK_BOOKMARKLET', function(file, text1, text2) {
        return $new('p', { child: [
            $new('span', { child: $text(res('INSTALL')) }),
            $new('a', {
                klass: 'bookmarklet',
                child: $text(res('LINK_BOOKMARKLET_TEXT')),
                attr: { href: text1 + text2 }
            })
        ] });
    });

    def('BACK_TO_LIST', function() {
        return $new('div', {
            klass: 'navigator',
            child: $new('div', { klass: 'back', child: $new('a', {
                attr: { href: params({ permalink: undefined }).toLocalPath() },
                child: $text(res('BACK_TO_LIST_TEXT'))
            }) })
        });
    });
} } }
