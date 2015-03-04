'use strict';

var router = require('express').Router();
var _ = require('lodash');
var co = require('co');
var holeApi = require('../util/rest-request').use('treehole');
var error = require('../util/error');
var imageStore = require('../util/upyun').use('treehole_images');

function getDisplayName(object) {
  if (object.options.anonymous) {
    return object.user_role.text;
  } else {
    return object.user_role.screen_name;
  }
}

router.post('/', function (req, res, next) {
  co(function* () {
    var content = req.param('content');
    if (_.isEmpty(content)) {
      throw error('Empty content.', 400);
    }
    var hole = {
      author: req.session.user,
      text: content,
      anonymous: req.param('anonymous') === 'on',
      feedbacks: req.param('feedbacks'),
      images: req.param('images'),
      channel: 'testChannel'   // TODO: implement channel
    };
    if (_.isString(hole.feedbacks)) {
      hole.feedbacks = [hole.feedbacks];
    }
    if (_.isString(hole.images)) {
      hole.images = [hole.images];
    }
    yield holeApi.post('holes', hole);
  }).catch(next);
});

router.get('/', function (req, res, next) {
  co(function* () {
    var holes = yield holeApi.get('holes');
    res.send(_.map(holes, function (hole) {
      return {
        id: hole._id,
        text: hole.text,
        publish_time: hole.publish_time,
        author: getDisplayName(hole)
      };
    }));
  }).catch(next);
});

router.get('/:id', function (req, res, next) {
  co(function* () {
    var id = req.param('id');
    var result = yield {
      hole: holeApi.get('holes', id),
      comments: holeApi.get('holes', id, 'comments')
    };
    var hole = result.hole;
    res.send({
      id: hole._id,
      text: hole.text,
      images: _.map(hole.images, imageStore.getShowUrl),
      publish_time: hole.publish_time,
      author: getDisplayName(hole),
      feedbacks: _.pick(hole.feedbacks, ['count', 'text']),
      comments: _.map(result.comments, function (comment) {
        return {
          text: comment.text,
          author: getDisplayName(comment),
          post_time: comment.post_time
        };
      })
    });
  }).catch(next);
});

router.post('/:id/comments', function (req, res, next) {
  co(function* () {
    var holeId = req.param('id');
    var text = req.param('comment-text');
    if (_.isEmpty(text)) {
      throw error('Empty content.', 400);
    }
    yield holeApi.post('holes', holeId, 'comments', {
      from_user: req.session.user,
      hole_id: holeId,
      text: text,
      anonymous: req.param('anonymous') === 'on'
    });
  }).catch(next);
});

router.post('/:id/feedbacks/:feedback_id', function (req, res, next) {
  co(function* () {
    var result = yield holeApi.post('holes', req.param('id'), 'feedbacks', req.param('feedback_id'), {
      action: req.param('action'),
      user: req.session.user
    });
    res.send(result);
  }).catch(next);
});

module.exports = router;
