'use strict';

AV.initialize(CONFIG.appId, CONFIG.appKey);
AV.setProduction(CONFIG.isProduction);

var app = ons.bootstrap('treehole', ['onsen', 'ngImgCrop', 'images-resizer']);

require('./filters')(app);
require('./controllers')(app);
require('./directives')(app);
