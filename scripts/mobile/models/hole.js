'use strict';

var Hole = AV.Object.extend('Hole', {
  initialize: function () {
    this.set('channel', null);
  }
});

module.exports = Hole;
