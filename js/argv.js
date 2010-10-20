(function() { // separate argument string into argument array
    var arg = GNN.Let.arg;
    var isQuoted = /(?:^".*"$|^'.*'$)/;
    var r = new RegExp('((?:^"|(?=[^\\\\])")[^"]*?(?:(?=[^\\\\])"|"$)|' +
                       "(?:^'|(?=[^\\\\])')[^']*?(?:(?=[^\\\\])'|'$))");
    GNN.Let.argv = arg.split(r).map(function(x) {
        return isQuoted.test(x) ? [x] : x.split(/\s+/);
    }).reduce(function(v, x) { return v.concat(x); }, []).map(function(x) {
        return isQuoted.test(x) ? x :
                x.replace(/\\"/,'"').replace(/\\'/,"'").replace(/\\\\/,"\\");
    }).filter(function(x) { return x.length > 0; });
})();
