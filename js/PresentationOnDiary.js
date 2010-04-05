// Use presentation mode on Hatena::Group diary
(function(d) {
    var array = function(a) {
        var r=[]; for (var i=0; i<a.length; i++) r.push(a[i]); return r;
    };
    var rm = function(e){ (e||{}).parentNode && e.parentNode.removeChild(e); };
    var $ = function(id){ return d.getElementById(id); };
    var $tag = function(tag, filter) {
        var nodes = array(d.getElementsByTagName(tag));
        if (filter) {
            nodes = nodes.filter(function(x){
                for (var p in filter) {
                    if (x[p] == filter[p]) return true;
                }
                return false;
            });
        }
        return nodes;
    };
    var $cr = function(tag, props) {
        var node = d.createElement(tag);
        for (var p in props) node[p] = props[p];
        return node;
    };

    var head = $tag('head')[0];

    $tag('link', { rel: 'stylesheet' }).forEach(rm);
    var css = $cr('link', {
        rel: 'stylesheet', type: 'text/css', charset: 'utf-8',
        href: '/css/presentation.css'
    });
    head.appendChild(css);

    var load = function(src) {
        var script = $cr('script', { type: 'text/javascript', src: src });
        $tag('head')[0].appendChild(script);
    };
    var wait = function(n, cont) {
        var global = (function(){ return this; }).apply(null);
        if (n.split('.').reduce(function(r,x){ return (r||{})[x];}, global)) {
            cont();
        } else {
            setTimeout(function(){wait(n, cont);}, 100);
        }
    };

    load('/js/MochiKit/060829/Base.js');
    load('/js/MochiKit/060829/Iter.js');
    load('/js/MochiKit/060829/Logging.js');
    load('/js/MochiKit/060829/DateTime.js');
    load('/js/MochiKit/060829/Format.js');
    load('/js/MochiKit/060829/Async.js');
    load('/js/MochiKit/060829/DOM.js');
    load('/js/MochiKit/060829/Style.js');
    load('/js/MochiKit/060829/LoggingPane.js');
    load('/js/MochiKit/060829/Color.js');
    load('/js/MochiKit/060829/Signal.js');
    load('/js/MochiKit/060829/Visual.js');
    wait('MochiKit.Base', function() {
        load('/js/MochiKit/060829/New.js');
        load('/js/Presentation.js');
        wait('MochiKit.Signal', function() {
            load('/js/KeyTypeListener.js');
        });
    });
    wait('Hatena.Presentation', function() {
        rm($('simple-header'));
        rm($('banner'));
        rm($tag('h1')[0]);
        rm($('pager-top'));
        rm($('pager-bottom'));
        $tag('div', {className:'comment'}).forEach(rm);
        $tag('span', {className:'timestamp'}).forEach(rm);
        $tag('p', {className:'sectionheader'}).forEach(rm);
        $tag('a', {href:'javascript:;'}).forEach(rm);
        Hatena.Presentation.initialize($tag('div', {className:'section'}));
    });
})(document);
