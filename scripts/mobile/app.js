'use strict';

AV.initialize(CONFIG.appId, CONFIG.appKey);
AV.setProduction(CONFIG.isProduction);

var app = ons.bootstrap('treehole', ['onsen']);

require('./filters')(app);
require('./controllers')(app);
require('./directives')(app);
