'use strict';

var Hole = require('models/hole');
var Channel = require('models/channel');
var Notification = require('models/Notification');
var pushService = require('../../push-service');
var _ = require('lodash');

module.exports = function ($scope, $rootScope, $timeout) {
  function retrieveChannels(callback) {
    var query = new AV.Query(Channel);
    query.ascending('index');
    query.find().then(function (channels) {
      $scope.$apply(function () {
        $rootScope.channels = channels;
        //$rootScope.currentChannel = _.find(channels, function (channel) {
        //  return channel.get('isDefault');
        //});
        $rootScope.currentChannel = 'all';
      });
      if (_.isFunction(callback)) {
        callback();
      }
    });
  }

  function retrieveHoles(callback) {
    var query = new AV.Query(Hole);
    query.descending('createdAt');
    query.include('author');
    query.include('author.avatar');
    query.include('images');
    if ($rootScope.currentChannel !== 'all') {
      query.equalTo('channel', $rootScope.currentChannel);
    }
    var holes;
    query.find().then(function (result) {
      holes = result;
      return AV.Cloud.run('retrieveHoleLikeStat', {
        holeIds: _.map(holes, function (hole) {
          return hole.getObjectId();
        })
      });
    }).then(function (stat) {
      $scope.likeStat = stat;
      $scope.holes = holes;
      if (_.isFunction(callback)) {
        callback();
      }
    });
  }

  function checkNotification() {
    var query = new AV.Query(Notification);
    query.equalTo('toUser', AV.User.current());
    query.count().then(function (count) {
      $scope.$apply(function () {
        $scope.hasNotification = count > 0;
      });
    });
  }

  function refreshList() {
    $rootScope.showLoadingPage = true;
    retrieveHoles(function () {
      $rootScope.showLoadingPage = false;
      $scope.$apply();
    });
  }

  $scope.user = AV.User.current();
  $scope.holes = [];

  retrieveChannels(refreshList);
  checkNotification();

  var subscriberToken = pushService.subscribe('notification_' + AV.User.current().getObjectId(), function (data) {
    if (data.action === 'checkNotification') {
      checkNotification();
    }
  });
  $scope.$on('$destroy', function () {
    pushService.unsubscribe(subscriberToken);
  });

  $scope.pullToRefresh = function ($done) {
    $timeout(function () {
      retrieveHoles($done);
    }, 500);
  };

  $scope.switchChannel = function (channel) {
    $rootScope.currentChannel = channel;
    $scope.holes = [];
    refreshList();
  };

  $scope.waitingLike = false;
  $scope.toggleLike = function (hole, index) {
    if ($scope.waitingLike) {
      return;
    }
    $scope.waitingLike = true;
    AV.Cloud.run($scope.likeStat[index].includeMe ? 'holeUnlike' : 'holeLike', {
      holeId: hole.getObjectId()
    }).then(function () {
      if ($scope.likeStat[index].includeMe) {
        $scope.likeStat[index].count --;
        $scope.likeStat[index].includeMe = false;
      } else {
        $scope.likeStat[index].count ++;
        $scope.likeStat[index].includeMe = true;
      }
      $scope.waitingLike = false;
    });
  };

  $scope.refreshStat = function (index) {
    return function () {
      var query = new AV.Query(Hole);
      query.include('author');
      query.include('author.avatar');
      query.include('images');
      var hole;
      query.get($scope.holes[index].getObjectId()).then(function (result) {
        hole = result;
        return AV.Cloud.run('retrieveHoleLikeStat', { holeIds: [hole.getObjectId()] });
      }).then(function (result) {
        $scope.$apply(function () {
          $scope.holes[index] = hole;
          $scope.likeStat[index] = result[0];
        });
      });
    };
  };

  $scope.refreshList = refreshList;
  $scope.checkNotification = checkNotification;
};
