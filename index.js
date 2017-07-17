'use strict';

const Hapi = require('hapi');
const request_promise = require('request-promise');
//const fetch = require('node-fetch');
const server = new Hapi.Server();
server.connection({ port: 3000, host: 'localhost' });
//const path = 'https://www.flickr.com/services/api/explore/flickr.photos.search';
const path1 = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=035845d8f12006199c3942da46accecc&tags=yerevan&per_page=3&page=5&format=json&nojsoncallback=1';
const path_root = 'https://api.flickr.com/services/rest/';
const usr_key = '035845d8f12006199c3942da46accecc';


/*
let loadData = async(path) => {
  try{
    const req = await fetch(path);
    const result = await req.json();
    return result;
  } catch(e) {
    console.error('Opps', e);
  }
}
*/

/*
request_promise(options)
    .then(function (repos) {
        console.log('done')
    })
    .catch(function (err) {
        // API call failed...
    });
*/

let req_data = async(_options) => {
  try{
    const req = await request_promise(_options);
    //console.log(req);
    return req;
  } catch(e) {
    console.error('Opps', e);
  }
}

const get_options = (_path) => {
  return {
      uri: _path,
      json: true // Automatically parses the JSON string in the response
  };
}

const flickr_photo_path =(
  _path_root, method, api_key,
  tags, per_page, page,
  format, nojsoncallback ) => {

  return `${_path_root}?method=${method}&api_key=${api_key}`+
         `&tags=${tags}&per_page=${per_page}&page=${page}`+
         `&format=${format}&nojsoncallback=${nojsoncallback}`
}

const get_path_by = (_term, _limit, _offset ) => {
  return flickr_photo_path(
    path_root,
    'flickr.photos.search',
     usr_key,
     _term,
     _limit,
     _offset,
     'json',
      '1');
}

const handler_func = (request, reply) => {
   const q = request.query;
   //console.log(q.limit, q.offset, q.term);
   reply(req_data(get_options(get_path_by(
        q.term,
        q.limit,
        q.offset))));
 }

server.register(require('inert'), (err) => {
    if (err) {
      throw err;
    }

    server.route({
      method: 'GET',
      path: '/',
      handler: (request, reply) => {
        reply('we are in root /');
      }
    });

    server.route({
        method: 'GET',
        path: `/search`,
        handler: (request, reply) => {
          reply(req_data(get_options(path1)));
        }
    });

    server.route({
        method: 'GET',
        path: '/search/',
        handler: handler_func
    });

});


server.start(err => {
    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});


/*hapiapp

limit=per_page
offset=page
term=tags

Key:
035845d8f12006199c3942da46accecc

Secret:
60570dd3fb96b401

*/
