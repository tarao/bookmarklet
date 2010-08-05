(function(d, argv) {
    var popup = function(caption, text) {
        var body = d.getElementsByTagName('body')[0];
        var t = d.createElement('textarea');
        t.style.position = 'absolute';
        t.style.border = 'solid 4px #cccccc';
        t.style.backgroundColor = '#eeeeee';
        t.style.opacity = 0.9;
        t.style.width = '20em';

        var cap = d.createElement('span');
        cap.style.position = 'absolute';
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

        var x = (body.clientWidth-t.offsetWidth)/2;
        var y = (body.clientHeight-t.offsetHeight)/2;
        t.style.left = x + 'px';
        t.style.top = y + 'px';
        y -= cap.offsetHeight + 4;
        cap.style.left = x + 'px';
        cap.style.top = y + 'px';

        t.focus();
        t.select();
    };
    var req = new XMLHttpRequest();
    var url = argv.shift() || location.href;
    req.open('GET', '/api/shortenurl?text='+url);
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status >= 200 && req.status < 300) {
            var json = eval('('+req.responseText+')');
            popup("Short URI for '" + url + "'",
                  decodeURIComponent(json.result));
        }
    };
    req.send(null);
})(document, ARGV);
