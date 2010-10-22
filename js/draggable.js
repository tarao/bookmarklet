(function(ns) { with (ns) {
    var merge = GNN.Hash.merge;
    ns.Draggable = function(node, opt) {
        opt = opt || {};
        node = $(node);
        if (!getStyle(node, 'position')) node.style.position = 'absolute';
        var self = { node: node, attach: $(opt.attach || node) || node };
        var nop = function(){ return true; };
        self.callback = merge(opt.callback, {start:nop,move:nop,end:nop});
        self.pos = {};
        var pinf = Number.POSITIVE_INFINITY;
        var ninf = Number.NEGATIVE_INFINITY;
        self.lower = merge(opt.lower, { x: ninf, y: ninf });
        self.upper = merge(opt.lower, { x: pinf, y: pinf });
        self.bound = {};
        [ 'x', 'y' ].forEach(function(p) {
            self.bound[p] = function(x) {
                if (self.lower[p] > x) x = self.lower[p];
                if (self.upper[p] < x) x = self.upper[p];
                return x;
            };
        });
        self.isDragging = function(){ return !!self.o; };
        self.isListening = function(){ return !!self.l; };
        self.isDisposed = function(){ return !self.isListening(); };
        self.start = function(e) {
            if (!self.isListening()) return;
            self.pos.cursor = e.mousePos();
            if (self.callback.start(self.node, e, self.pos.cursor)) {
                self.pos.node = getPosition(self.node);
                self.o = [ new Observer(document.body, 'onmousemove', self, 'move'),
                           new Observer(document.body, 'onmouseup', self, 'stop') ];
                e.stop();
            }
        };
        self.move = function(e) {
            if (!self.isDragging() || self.isDisposed()) return;
            var pos = e.mousePos();
            if (self.callback.move(self.node, e, pos)) {
                [ 'x', 'y' ].forEach(function(p) {
                    pos[p] += self.pos.node[p] - self.pos.cursor[p];
                    pos[p] = self.bound[p](pos[p]);
                });
                self.node.style.left = pos.x + 'px';
                self.node.style.top = pos.y + 'px';
                e.stop();
            }
        };
        self.stop = function(e) {
            if (!self.isDragging() || self.isDisposed()) return;
            self.o.forEach(function(o){ o.stop(); });
            self.o = null;
            self.pos = {};
            if (self.callback.end(self.node, e) && e) e.stop();
        };
        self.dispose = function(){ self.stopListening(); };
        self.startListening = function() {
            if (self.isListening()) return;
            self.l = new Observer(self.attach, 'onmousedown',
                                  self, 'start');
        };
        self.stopListening = function(abort) {
            if (!self.isListening()) return;
            self.l.stop();
            self.l = null;
            if (abort && self.isDragging()) self.stop();
        };
        if (!opt.later) self.startListening();
        return self;
    };
} })(GNN.UI);
