var _ = require('underscore');
var url = require('url');
var request = require('request-promise');
var Promise = require('bluebird');

module.exports = function(options) {
   var options = _.extend({
             apiKey: null,
             apiUrl: null,
        }, options);

   if (!_.has(options, 'apiKey')) {
      throw new TypeError('Must pass apiKey');
   }
   if (!_.has(options, 'apiUrl')) {
      throw new TypeError('Must pass apiUrl');
   }

   function _request(apiFunction, payload, callback) {
    var reqUrl = url.parse(options.apiUrl + '/' + apiFunction);

    request({
       method: 'POST',
       uri: reqUrl.href,
       headers: {
          'X-API-Key': options.apiKey,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'WowWee HK Support Interface'
       },
       json: true,
       form: JSON.stringify(payload)
    }).then(function(body) {
       callback(null, body);
    });
  }

  var osTicketApi = {};

  osTicketApi.createTicket = Promise.promisify(function(params, callback) {
     params = _.pick(params, 'email','name','subject','message','alert','autorespond','ip','priority','source','topicId','attachments');
     if (!_.has(params, "email") ||
         !_.has(params, "name") ||
         !_.has(params, "subject") ||
         !_.has(params, "message")) {
         throw new TypeError();
     }
     return _request('tickets.json', params, callback);
  });

  return osTicketApi;
}
