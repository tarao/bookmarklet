/*
 * @title[en]        test
 * @title[ja]        テスト
 * @description[en]  This is a test
 * @description[ja]  これはテスト
 * @type             smarklet
 */

GNN.use([
    'argv.js',
    'jump.js'
], function() {
    GNN.Let.jump('http://www.google.com/search?q=' +
                 GNN.Let.argv.map(function(x){return encodeURI(x)}).join('+'));
});
