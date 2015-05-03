'use strict';

var Hole = require('models/hole');
var PseudoUser = require('models/pseudo-user');
var helper = require('../../helper');

module.exports = function ($scope, $rootScope) {
  var holeId = navi.getCurrentPage().options.holeId;
  $scope.user = AV.User.current();
  var imageArray;
  var commentDialogs = {};
  var currentHole;
  var currentPseudoUser;

  function refresh() {
    $scope.hole = null;
    $scope.comments = null;
    $rootScope.showLoadingPage = true;
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
      currentHole = hole;
      query = new AV.Query(PseudoUser);
      query.equalTo('user', AV.User.current());
      query.equalTo('hole', hole);
      return query.find();
    }).then(function (result) {
      if (result.length > 0) {
        currentPseudoUser = result[0];
      }
      return currentHole.fetchComments();
    }).then(function (comments) {
      commentDialogs = {};
      var nicknameDict = {};
      var currentIndex = 0;
      var i;
      var objectId;

      if (currentHole.get('anonymous')) {
        for (i = 0; i < comments.length; i ++) {
          objectId = comments[i].get('author').getObjectId();
          if (!comments[i].get('author').get('authorOf')) {
            if (!nicknameDict[objectId]) {
              nicknameDict[objectId] = helper.generateAnonymousNickname(currentIndex);
              currentIndex ++;
            }
          } else {
            nicknameDict[objectId] = '楼主';
          }
        }
      }

      $scope.$apply(function () {
        $rootScope.showLoadingPage = false;
        $scope.hole = currentHole;
        $scope.currentPseudoUser = currentPseudoUser;
        $scope.nicknameDict = nicknameDict;
        $scope.comments = comments;
      });
    });
  }
  refresh();
  $scope.refresh = refresh;

  $scope.showCommentDialog = function (replyTo) {
    var key = replyTo ? replyTo.getObjectId() : '';

    function show(dialog) {
      navi.setGoBackHandler(function () {
        dialog.hide();
      });
      dialog.on('prehide', function () {
        navi.removeGoBackHandler();
      });
      dialog.on('destroy', function () {
        navi.removeGoBackHandler();
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
    navi.setGoBackHandler(function () {
      gallery.close();
    });
    gallery.listen('destroy', function () {
      navi.removeGoBackHandler();
    });
    gallery.init();
  };
};
