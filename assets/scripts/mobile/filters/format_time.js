'use strict';

module.exports = function (input) {
  var moment = require('moment');
  moment.locale('zh-cn', {
    calendar: {
      lastDay: '昨天 H:mm',
      sameDay: '今天 H:mm',
      nextDay: '明天 H:mm',
      lastWeek: '本ddd H:mm',
      nextWeek: '下ddd H:mm',
      sameElse: 'YYYY年M月D日 H:mm'
    },
    relativeTime: {
      future: '%s之后',
      past:   '%s以前',
      s:  '几秒',
      m:  '一分钟',
      mm: '%d分钟',
      h:  '一小时',
      hh: '%d小时',
      d:  '一天',
      dd: '%d天',
      M:  '一个月',
      MM: '%d月',
      y:  '一年',
      yy: '%d年'
    }
  });

  var time = moment(input);
  if (moment().diff(time, 'hours', true) <= 1) {
    return time.fromNow();
  } else {
    return time.calendar();
  }
};
