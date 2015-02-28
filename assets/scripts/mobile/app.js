'use strict';

var app = ons.bootstrap('myApp', ['onsen']);
app.controller('AppController', function ($scope) { });
app.controller('PageController', function ($scope) {
  ons.ready(function() {
    // Init code here
  });
});
