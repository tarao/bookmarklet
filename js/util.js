(function() {
    var override = function(obj, by) {
        by = by||{};
        for (prop in by) {
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
    GNN.Let.override = override;
})();
