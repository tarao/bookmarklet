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
    def('DETAIL_TEXT', L({
        ja: '>> もっと詳しく',
        en: '>> more detail',
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
    def('INSTRUCTION_SMARKLET_CAPTION', L({
        ja: 'smarkletのインストール方法',
        en: 'How to install smarklets',
    }));
    def('ALT_IMG_MENU', L({
        ja: 'コンテキストメニュー [この検索にキーワードを設定]',
        en: 'context menu [Add a Keyword for this Search]',
    }));
    def('ALT_IMG_DIALOG', L({
        ja: 'キーワードつきの新しいブックマーク',
        en: 'New bookmark with a keyword',
    }));
    def('ALT_IMG_KEYWORD', L({
        ja: 'キーワードを設定',
        en: 'Specify some keyword',
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
        return $new('div', { klass: 'debug-or-release', child: [
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

    def('ENTRY', function(file, meta, desc, link) {
        return $new('div', {
            klass: 'entry',
            child: [
                $new('h2', {
                    id: file,
                    child: $new('a', { child: $text(meta.title), attr: {
                        href: params({ permalink: file }).toLocalPath()
                    } })
                }),
                desc,
                link
            ]
        });
    });
    def('DESCRIPTION', function(text) {
        return $new('p', { klass: 'description', child: $text(text) });
    });
    def('DETAIL', function(url) {
        return $new('span', { klass: 'detail', child: $new('a', {
            attr: { href: url },
            child: $text(res('DETAIL_TEXT'))
        }) });
    });
    def('DOCUMENTATION_FRAME', function(url) {
        var iframe = $new('iframe', {
            klass: 'documentation',
            attr: { src: url }
        });
        var height = window.innerHeight;
        iframe.style.height = document.body.clientHeight+'px';
        return iframe;
    });
    def('DOCUMENTATION_NODE', function(text) {
        var node = $new('div', { klass: 'documentation' });
        node.innerHTML = text;
        return node;
    });
    def('HELP_BUTTON', function() {
        return $new('a', {
            klass: 'help',
            attr: { href: params().toLocalPath() },
            child: $text('?')
        });
    });
    def('LINK_SMARKLET', function(file, text1, text2) {
        var input = $new('input', {
            klass: 'smarklet',
            attr: { type: 'text', name: 's',
                    value: res('LINK_SMARKLET_TEXT') } });
        var help = res('HELP_BUTTON');
        return {
            form: $new('form', {
                attr: { method: 'get', action: text1 },
                child: $new('p', {
                    child: [
                        $new('label', {
                            attr: { 'for': 's' },
                            child: $text(res('INSTALL')) }),
                        input,
                        help,
                        $new('input', {
                            attr: { type: 'hidden', name: 'h',
                                    value: text2 } })
                    ]
                })
            }),
            input: input,
            help: help
        };
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

    def('IMG_MENU', function() {
        return $new('img', { id: 'instruction-menu', attr: {
            src: './fig/menu.png.' + lang(),
            alt: res('ALT_IMG_MENU'),
        } });
    });
    def('IMG_DIALOG', function() {
        return $new('img', { id: 'instruction-dialog', attr: {
            src: './fig/dialog.png.' + lang(),
            alt: res('ALT_IMG_DIALOG'),
        } });
    });
    def('IMG_KEYWORD', function() {
        return $new('img', { id: 'instruction-keyword', attr: {
            src: './fig/keyword.png.' + lang(),
            alt: res('ALT_IMG_KEYWORD'),
        } });
    });
    def('INSTRUCTION_CLOSE', function(id, caption) {
        return $new('div', { child: [
            $new('a', {
                id: id,
                klass: 'instruction-close',
                attr: { href: params().toLocalPath() },
                child: $text('\u2716'),
            }),
            $new('span', {
                klass: 'instruction-caption',
                child: $text(caption)
            })
        ] });
    });
    def('INSTRUCTION_SMARKLET', function() {
        return $new('div', {
            id: 'instruction-smarklet',
            klass: 'instruction',
            child: [
                res('INSTRUCTION_CLOSE',
                    'instruction-smarklet-close',
                    res('INSTRUCTION_SMARKLET_CAPTION')),
                res('IMG_MENU'), res('IMG_DIALOG'), res('IMG_KEYWORD')
            ]
        });
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
