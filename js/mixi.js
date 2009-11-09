(function(d, dom, ar) {
    var override = function(obj, by) {
        for (prop in (by||{})) {
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
    if (typeof Mixi == 'undefined') Mixi = {};
    var getId = function(which) {
        var re = new RegExp((which||[]).concat(['id']).join('_')+'=(\\d+)');
        return re.test(location.href) && RegExp.$1;
    };
    var U = {
        getOwner: function(){ return { id: getId(['owner']) || getId() }; },
        getViewer: function(){ return {id: ar.id || ''}; },
    };
    Mixi.User = Mixi.User||U;
    var owner = (Mixi.User.getOwner()||U.getOwner()).id;
    var viewer = (Mixi.User.getViewer()||U.getViewer()).id;
    var move = function(what, param) {
        var q = [];
        for (var p in param){ q.push(p+'='+param[p]); }
        var uri = dom+what.join('_')+'.pl'+'?'+q.join('&');
        location.href = uri;
    };
    var moveId = function(what, id){ move(what,{id:id||owner||viewer}); };
    var how = {profile:'show',log:'show',calendar:'show'};
    var list = function(name, id){ moveId([how[name]||'list',name],id); };
    var replace = function(t, a) {
        return Array.reduce(a, function(p,c) {
            return p.replace(new RegExp(c[0], 'g'), c[1]);
        }, t);
    };
    var methods = {
        id: function() {
            d.body.innerHTML = replace(d.body.innerHTML, [
                [ 'href=\x22show_friend\\.pl\\?id=([0-9]*)\x22>',
                  'href=\x22show_friend.pl?id=$1\x22>[id:$1]' ],
                [ '<div class=\x22iconListImage\x22>'
                  +'<a href=\x22show_friend\\.pl\\?id=([0-9]*)\x22 style',
                  '<a href=\x22show_friend.pl?id=$1\x22>[id:$1]</a>'
                  +'<div class=\x22iconListImage\x22>'
                  +'<a href=\x22show_friend\.pl\?id=$1\x22 style' ],
            ]);
        },
        escape: function(cmd, n, tag, c) {
            tag = tag||'textarea';
            var s = '&nbsp;', t = d.getElementsByTagName(tag)[c||0];
            if(t) {
                var a = ['&','&amp;'];
                var r = [
                    a,
                    ['\x20{2}',s+s],
                    ['\t',s+s+s+s],
                    ['&nbsp;\x20',s+s],
                ];
                for (var i=1; i<n; i++) r.push(a);
                t.value = replace(t.value, r);
            }
        },
        logout: function(cmd) {
            move([cmd]);
        },
        add: function(cmd, name) {
            moveId([cmd,name||'diary'], viewer);
        },
        edit: function(cmd, name, id) {
            moveId([cmd,name||'diary'], id||getId());
        },
        new: function(cmd, name) {
            if (name == 'diary') {
                name = null;
            } else if (name == 'community') {
                name = 'bbs';
            }
            moveId([cmd,name||'friend_diary'], viewer);
        },
        favorite: function(cmd, name) {
            if (name == 'community') {
                return 'bookmark';
            }
            moveId(['view','mylist'], viewer);
        },
        bookmark: function(cmd, name) {
            move(['list','bookmark'], { kind: 'community' });
        },
        search: function(cmd, name) {
            var query = Array.slice(arguments,2).join(' ');
            move([cmd, name||'diary'], {
                keyword: query,
                submit: (query.length>0 && 'search')||''
            });
        },
        recent: function(cmd, name) {
            moveId([cmd, name]);
        },
    };
    var alias = override({
        _: {
            d: 'diary',
            f: 'friend',
            p: 'profile',
            m: 'message',
            bbs: 'community',
            com: 'comment',
            cal: 'calendar',
            fav: 'favorite',
            mylist: 'favorite',
        },
        0: {
            a: 'add',
            b: 'bookmark',
            e: 'edit',
            n: 'new',
            s: 'search',
            r: 'recent',
        },
    }, ar.alias);
    var resolve = function(alias, i, name) {
        return (alias[i]||{})[name] || (alias._||{})[name];
    };
    ar = ar.map(function(v,i) {
        return resolve(alias,i,v) || resolve(alias,i,v) || v;
    });
    if (!ar[0]) {
        location.href = 'https://mixi.jp/';
    } else {
        while (typeof ar[0] == 'string') {
            ar[0] = (methods[ar[0]]||list).apply(this,ar);
        }
    }
})(document, 'http://mixi.jp/', ARGV);
