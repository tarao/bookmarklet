(function () { // open URL without referrer
    GNN.Let.jump = function(url) {
        var refresh = [
            '<html><head><meta http-equiv="refresh" content="0;url=',
            url,
            '" /></head></html>',
        ].join('');
        setTimeout(function() {
            document.location.href = [
                'data:text/html;charset=utf-8,',
                encodeURIComponent(refresh),
            ].join('');
        }, 0);
    };
})();
