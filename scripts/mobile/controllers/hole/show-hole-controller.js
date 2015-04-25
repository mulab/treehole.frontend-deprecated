'use strict';

var Hole = require('models/hole');

module.exports = function ($scope) {
  var hole = navi.getCurrentPage().options.hole;
  $scope.hole = hole;
  $scope.user = AV.User.current();

  function refreshComments() {
    hole.fetchComments().then(function (comments) {
      $scope.$apply(function () {
        $scope.comments = comments;
      });
    });
  }
  refreshComments();
  $scope.refreshComments = refreshComments;

  $scope.showCommentDialog = function () {
    ons.createDialog('hole/comment-dialog.html', {
      parentScope: $scope
    }).then(function (dialog) {
      $scope.commentDialog = dialog;
      dialog.show();
    });
  };

  var images = [];
  var i;
  for (i = 0; i < hole.get('images').length; i ++) {
    var item = hole.get('images')[i];
    images.push({
      w: item.get('width'),
      h: item.get('height'),
      src: item.get('file').url()
    });
  }

  $scope.showGallery = function (index) {
    var pswpElement = document.querySelectorAll('.pswp')[0];
    var options = { index: index, history: false, shareEl: false, captionEl: false, fullscreenEl: false };
    var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, images, options);
    gallery.init();
  };
};
