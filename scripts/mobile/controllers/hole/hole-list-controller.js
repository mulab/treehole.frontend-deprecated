'use strict';

var Hole = require('models/hole');
var Channel = require('models/channel');
var _ = require('lodash');

module.exports = function ($scope, $rootScope, $timeout) {
  function retrieveChannels(callback) {
    var query = new AV.Query(Channel);
    query.ascending('index');
    query.find().then(function (channels) {
      $scope.$apply(function () {
        $rootScope.channels = channels;
        $rootScope.currentChannel = _.find(channels, function (channel) {
          return channel.get('isDefault');
        });
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
    query.equalTo('channel', $rootScope.currentChannel);
    query.find().then(function (holes) {
      $scope.holes = holes;
      if (_.isFunction(callback)) {
        callback();
      }
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

  $scope.refreshList = refreshList;
};
