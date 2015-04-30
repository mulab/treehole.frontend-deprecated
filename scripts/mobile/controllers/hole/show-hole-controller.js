'use strict';

var Hole = require('models/hole');

module.exports = function ($scope, $rootScope) {
  var holeId = navi.getCurrentPage().options.holeId;
  $scope.user = AV.User.current();
  var imageArray;
  var commentDialogs = {};
  var currentHold;

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
      currentHold = hole;
      return hole.fetchComments();
    }).then(function (comments) {
      commentDialogs = {};
      $scope.$apply(function () {
        $scope.hole = currentHold;
        $scope.comments = comments;
      });
    });
  }
  refresh();
  $scope.refresh = refresh;

  $scope.showCommentDialog = function (replyTo) {
    var key = replyTo ? replyTo.getObjectId() : '';

    function show(dialog) {
      $rootScope.goBackHandler = function () {
        dialog.hide();
      };
      dialog.on('prehide', function () {
        console.log('onprehide');
        $rootScope.goBackHandler = null;
      });
      $scope.currentCommentDialog = dialog;
      $scope.replyTo = replyTo;
      dialog.show();
    }

    if (!commentDialogs[key]) {
      ons.createDialog('hole/comment-dialog.html', {
        parentScope: $scope
      }).then(function (dialog) {
        commentDialogs[key] = dialog;
        show(dialog);
      });
    } else {
      show(commentDialogs[key]);
    }
  };

  $scope.showGallery = function (index) {
    var pswpElement = document.querySelectorAll('.pswp')[0];
    var options = {
      index: index,
      history: false,
      captionEl: false,
      fullscreenEl: false,
      pinchToClose: false,
      closeOnScroll: false,
      closeOnVerticalDrag: false,
      shareEl: false,
      isClickableElement: function(el) {
        return el.tagName === 'A' || el.tagName === 'IMG';
      }
    };
    var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, imageArray, options);
    $rootScope.goBackHandler = function () {
      gallery.close();
    };
    gallery.listen('destroy', function () {
      $rootScope.goBackHandler = null;
    });
    gallery.init();
  };
};
