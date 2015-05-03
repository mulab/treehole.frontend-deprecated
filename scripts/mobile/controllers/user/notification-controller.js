'use strict';

var Notification = require('models/Notification');
var _ = require('lodash');

module.exports = function ($scope, $rootScope) {
  var query = new AV.Query(Notification);
  query.descending('createdAt');
  query.equalTo('toUser', AV.User.current());
  query.include('attachedComment');
  query.include('attachedComment.author');
  query.include('attachedComment.author.avatar');
  query.include('attachedComment.replyTo');
  query.include('attachedComment.hole');
  query.include('attachedComment.hole.author');
  $rootScope.showLoadingPage = true;
  query.find().then(function (notifications) {
    $scope.$apply(function () {
      $rootScope.showLoadingPage = false;
      $scope.notifications = notifications;
    });
  });

  $scope.toggle = function (notification) {
    switch (notification.get('type')) {
      case 'replyToCommentAuthor':
      case 'replyToHoleAuthor':
        notification.destroy();
        _.pull($scope.notifications, notification);
        navi.pushPageWithHistory('hole/show.html', {
          animation: 'fade',
          holeId: notification.get('attachedComment').get('hole').getObjectId()
        });
        break;
      default:
    }
  };
};
