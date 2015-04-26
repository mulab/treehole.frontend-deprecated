'use strict';

var Hole = require('models/hole');

module.exports = function ($scope, $rootScope) {
  var holeId = navi.getCurrentPage().options.holeId;
  $scope.user = AV.User.current();
  var imageArray;

  function refresh() {
    var query = new AV.Query(Hole);
    query.include('author');
    query.include('author.avatar');
    query.include('images');
    query.get(holeId).then(function (hole) {
      imageArray = [];
      var i;
      for (i = 0; i < hole.get('images').length; i ++) {
        var item = hole.get('images')[i];
        imageArray.push({
          w: item.get('width'),
          h: item.get('height'),
          src: item.get('file').url()
        });
      }
      $scope.$apply(function () {
        $scope.hole = hole;
      });
      return hole.fetchComments();
    }).then(function (comments) {
      $scope.$apply(function () {
        $scope.comments = comments;
      });
    });
  }
  refresh();
  $scope.refresh = refresh;

  $scope.showCommentDialog = function () {
    ons.createDialog('hole/comment-dialog.html', {
      parentScope: $scope
    }).then(function (dialog) {
      $scope.commentDialog = dialog;
      dialog.show();
    });
  };

  $scope.showGallery = function (index) {
    var pswpElement = document.querySelectorAll('.pswp')[0];
    var options = { index: index, history: false, shareEl: false, captionEl: false, fullscreenEl: false };
    var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, imageArray, options);
    $rootScope.photoSwipe = gallery;
    gallery.listen('destroy', function () {
      $rootScope.photoSwipe = null;
    });
    gallery.init();
  };
};
