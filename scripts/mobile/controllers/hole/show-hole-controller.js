'use strict';

var Hole = require('models/hole');
var PseudoUser = require('models/pseudo-user');
var helper = require('../../helper');
var _ = require('lodash');

module.exports = function ($scope, $rootScope) {
  var holeId = navi.getCurrentPage().options.holeId;
  $scope.user = AV.User.current();
  var commentDialogs = {};
  var currentHole;
  var likeStat;
  var currentPseudoUser;

  var listRefreshCallback = navi.getCurrentPage().options.callback;

  function refresh() {
    if (_.isFunction(listRefreshCallback)) {
      listRefreshCallback();
    }

    $scope.hole = null;
    $scope.comments = null;
    $rootScope.showLoadingPage = true;
    var query = new AV.Query(Hole);
    query.include('author');
    query.include('author.avatar');
    query.include('images');
    query.get(holeId).then(function (hole) {
      currentHole = hole;
      return AV.Cloud.run('retrieveHoleLikeStat', {
        holeIds: [holeId]
      });
    }).then(function (result) {
      likeStat = result[0];
      query = new AV.Query(PseudoUser);
      query.equalTo('user', AV.User.current());
      query.equalTo('hole', currentHole);
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
        $scope.likeStat = likeStat;
        $scope.currentPseudoUser = currentPseudoUser;
        $scope.nicknameDict = nicknameDict;
        $scope.comments = comments;
      });
    });
  }
  refresh();
  $scope.refresh = refresh;

  $scope.showCommentDialog = function (replyTo) {
    if (!AV.User.current().get('tsinghuaAuth')) {
      return;
    }

    var key = replyTo ? replyTo.getObjectId() : '';

    function show(dialog) {
      navi.setGoBackHandler(function () {
        dialog.hide();
      });
      dialog.on('prehide', function () {
        navi.removeGoBackHandler();
      });
      dialog.on('destroy', function () {
        commentDialogs[key] = null;
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

  $scope.waitingLike = false;
  $scope.toggleLike = function () {
    if ($scope.waitingLike) {
      return;
    }
    $scope.waitingLike = true;
    AV.Cloud.run($scope.likeStat.includeMe ? 'holeUnlike' : 'holeLike', {
      holeId: currentHole.getObjectId()
    }).then(function () {
      if ($scope.likeStat.includeMe) {
        $scope.likeStat.count --;
        $scope.likeStat.includeMe = false;
      } else {
        $scope.likeStat.count ++;
        $scope.likeStat.includeMe = true;
      }
      $scope.waitingLike = false;
      if (_.isFunction(listRefreshCallback)) {
        listRefreshCallback();
      }
    });
  };
};
