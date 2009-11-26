// See:
//     http://d.hatena.ne.jp/amachang/20091125/1259124000
//     http://d.hatena.ne.jp/mandel59/20091125/1259157800
(function(){
    var sel = function() {
        var s = getSelection();
        if (!s.toString()) return;
        var r = s.getRangeAt(0);
        var n = r.startContainer;
        var p = r.startOffset;
        return (n.nodeType == 3) ?
            n.nodeValue.substr(p,2) :
            n.childNodes[p].textContent.substr(0,2);
    };
    var v = (ARGV[0] || sel() || '').charCodeAt(0);
    var code = 0xD800 <= v && v <= 0xDB7F ?
        ((v & 0x3FF) << 10 | u.charCodeAt(1) & 0x3FF) + 0x10000 :
        v;
    location.href = [
        'http://www.fileformat.info/info/unicode/char/',
        v.toString(16),
        '/index.htm',
    ].join('');
})();
