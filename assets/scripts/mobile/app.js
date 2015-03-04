'use strict';

var app = ons.bootstrap('treehole', ['onsen', 'ngRoute']);

require('./filters')(app);
require('./controllers')(app);
