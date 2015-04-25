'use strict';

var Bluebird = require('bluebird');
var Image = require('models/image');
var Comment = require('models/comment');
var _ = require('lodash');

var Hole = AV.Object.extend('Hole', {
  fetchComments: function () {
    var query = new AV.Query(Comment);
    query.ascending('createdAt');
    query.include('author');
    query.include('author.avatar');
    query.equalTo('hole', this);
    return query.find();
  },
  createComment: function (content) {
    return Comment.new({
      content: content,
      hole: this,
      author: AV.User.current()
    }).save();
  }
}, {
  createNewHole: function (content, channel, imageFiles, options) {
    return Bluebird.coroutine(function* () {
      var i;
      var images = [];
      var imageAcl = new AV.ACL();
      imageAcl.setPublicReadAccess(true);
      for (i = 0; i < imageFiles.length; i ++) {
        if (_.isFunction(options.onImageUploadStart)) {
          options.onImageUploadStart(i);
        }

        var file;
        var imageFile;

        var times = 3;
        var result = false;
        while (times > 0) {
          file = imageFiles[i];
          imageFile = new AV.File(file.name, { base64: file.dataUrl.replace(/^data:image\/\w+;base64,/, '') });
          imageFile.setACL(imageAcl);

          result = yield imageFile.save().then(function () {
            return AV.Promise.as(true);
          }, function (err) {
            if (err.message === 'Rate limit exceeded.') {
              return AV.Promise.as(false);
            } else {
              return AV.Promise.error(err);
            }
          });
          if (result) {
            break;
          } else {
            yield Bluebird.delay(1000);
          }
          times--;
        }
        if (!result) {
          yield AV.Promise.error(new Error('Rate limit exceeded.'));
        }

        var image = Image.new({
          file: imageFile
        });
        images.push(image);

        yield image.save();
      }
      if (_.isFunction(options.onPublishStart)) {
        options.onPublishStart();
      }
      var hole = Hole.new({
        content: content,
        channel: channel,
        images: images,
        author: AV.User.current()
      });
      yield hole.save();
    })();
  }
});

module.exports = Hole;
