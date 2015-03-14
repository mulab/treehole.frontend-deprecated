'use strict';

var HTTP_STATUS_CODES = {
  'CODE_200' : 'OK',
  'CODE_201' : 'Created',
  'CODE_202' : 'Accepted',
  'CODE_203' : 'Non-Authoritative Information',
  'CODE_204' : 'No Content',
  'CODE_205' : 'Reset Content',
  'CODE_206' : 'Partial Content',
  'CODE_300' : 'Multiple Choices',
  'CODE_301' : 'Moved Permanently',
  'CODE_302' : 'Found',
  'CODE_303' : 'See Other',
  'CODE_304' : 'Not Modified',
  'CODE_305' : 'Use Proxy',
  'CODE_307' : 'Temporary Redirect',
  'CODE_400' : 'Bad Request',
  'CODE_401' : 'Unauthorized',
  'CODE_402' : 'Payment Required',
  'CODE_403' : 'Forbidden',
  'CODE_404' : 'Not Found',
  'CODE_405' : 'Method Not Allowed',
  'CODE_406' : 'Not Acceptable',
  'CODE_407' : 'Proxy Authentication Required',
  'CODE_408' : 'Request Timeout',
  'CODE_409' : 'Conflict',
  'CODE_410' : 'Gone',
  'CODE_411' : 'Length Required',
  'CODE_412' : 'Precondition Failed',
  'CODE_413' : 'Request Entity Too Large',
  'CODE_414' : 'Request-URI Too Long',
  'CODE_415' : 'Unsupported Media Type',
  'CODE_416' : 'Requested Range Not Satisfiable',
  'CODE_417' : 'Expectation Failed',
  'CODE_500' : 'Internal Server Error',
  'CODE_501' : 'Not Implemented',
  'CODE_502' : 'Bad Gateway',
  'CODE_503' : 'Service Unavailable',
  'CODE_504' : 'Gateway Timeout',
  'CODE_505' : 'HTTP Version Not Supported'
};

module.exports = function (code) {
  return HTTP_STATUS_CODES['CODE_' + code];
};
