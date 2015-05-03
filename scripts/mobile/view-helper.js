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

function showGallery(hole, index) {
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
  var imageArray = [];
  var i;
  for (i = 0; i < hole.get('images').length; i ++) {
    var item = hole.get('images')[i];
    imageArray.push({
      w: item.get('width'),
      h: item.get('height'),
      src: item.get('file').url()
    });
  }
  var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, imageArray, options);
  navi.setGoBackHandler(function () {
    gallery.close();
  });
  gallery.listen('destroy', function () {
    navi.removeGoBackHandler();
  });
  gallery.init();
}

exports.getAvatarUrl = getAvatarUrl;
exports.getAnonymousAvatar = getAnonymousAvatar;
exports.showGallery = showGallery;
