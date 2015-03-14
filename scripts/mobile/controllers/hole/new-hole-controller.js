'use strict';

var _ = require('lodash');
var Promise = require('bluebird');

var Hole = require('../../models/hole');
var Image = require('../../models/image');

module.exports = function ($scope) {
  $scope.waitingSubmit = false;
  $scope.images = [];
  $scope.submit = function () {
    $scope.waitingSubmit = true;
    Promise.coroutine(function* () {
      var i;
      var images = [];
      for (i = 0; i < $scope.images.length; i ++) {
        var file = $scope.images[i];
        var imageFile = new AV.File(file.name, file);
        yield imageFile.save();
        var image = Image.new({
          author: AV.User.current(),
          file: imageFile
        });
        images.push(image);
        yield image.save();
      }
      var hole = Hole.new({
        content: $scope.content,
        images: images,
        author: AV.User.current()
      });
      yield hole.save();
      navi.resetToPage('hole/list.html', { animation: 'fade' });
    })().catch(function (err) {
      $scope.waitingSubmit = false;
      $scope.$apply();
      console.log(err);
    });
  };
};
