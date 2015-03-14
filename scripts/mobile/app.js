'use strict';

AV.initialize(CONFIG['APP_ID'], CONFIG['APP_KEY']);

var app = ons.bootstrap('treehole', ['onsen']);

require('./filters')(app);
require('./controllers')(app);
require('./directives')(app);
