var Funnel = require('broccoli-funnel');

module.exports = {
  name: 'mobiledoc-html-renderer',
  treeForVendor: function() {
    var files = new Funnel(__dirname + '/../dist/', {
      files: [
        'global/mobiledoc-html-renderer.js'
      ],
      destDir: 'mobiledoc-html-renderer'
    });
    return files;
  },
  included: function(app) {
    app.import('vendor/mobiledoc-html-renderer/global/mobiledoc-html-renderer.js');
  }
};
