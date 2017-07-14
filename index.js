'use strict';

const Hapi = require('hapi');
const rp = require('request-promise');

const server = new Hapi.Server();
server.connection({ port: 3000, host: 'localhost' });
const path = 'https://www.flickr.com/services/api/explore/flickr.photos.search';


server.register(require('inert'), function(err) {
  if (err) {
    throw err;
  }

  server.route({
    method: 'GET',
    path: '/',
    handler: function(request, reply) {
      reply('we are in root /');
    }
  });
});

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});


/*hapiapp

Key:
035845d8f12006199c3942da46accecc

Secret:
60570dd3fb96b401

*/
