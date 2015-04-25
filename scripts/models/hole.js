'use strict';

var Bluebird = require('bluebird');
var Image = require('models/image');
var Comment = require('models/comment');

var Hole = AV.Object.extend('Hole', {
  fetchComments: function () {
    var query = new AV.Query(Comment);
    query.ascending('createdAt');
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
  createNewHole: function (content, channel, imageFiles) {
    return Bluebird.coroutine(function* () {
      var i;
      var images = [];
      var imageAcl = new AV.ACL();
      imageAcl.setPublicReadAccess(true);
      for (i = 0; i < imageFiles.length; i ++) {
        var file = imageFiles[i];
        var imageFile = new AV.File(file.name, file);
        imageFile.setACL(imageAcl);
        yield imageFile.save();
        var image = Image.new({
          file: imageFile
        });
        images.push(image);
        yield image.save();
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
