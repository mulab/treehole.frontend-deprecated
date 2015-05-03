'use strict';

var _ = require('lodash');

function getAvatarUrl(user, size) {
  if (!user.get('avatar')) {
    return CONFIG.defaultAvatar;
  }
  if (_.isUndefined(size)) {
    return user.get('avatar').thumbnailURL(size, size);
  } else {
    return user.get('avatar').url();
  }
}

function getAnonymousAvatar(object, size) {
  if (object.get('anonymous')) {
    return CONFIG.defaultAvatar;
  }
  return getAvatarUrl(object.get('author'), size);
}

exports.getAvatarUrl = getAvatarUrl;
exports.getAnonymousAvatar = getAnonymousAvatar;
