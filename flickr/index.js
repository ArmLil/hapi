'use strict';
const Hapi = require('hapi')
const Joi = require('joi')
const server = new Hapi.Server()
const Api = require('./api')


server.connection({
  port: process.env.PORT || 3000,
  host: 'localhost'
})

server.register(require('inert'), (err) => {
    if (err) {
      throw err;
    }

    server.route({
      method: 'GET',
      path: '/',
      handler: (request, reply) => {
        reply('we are in root /')
      }
    })

    server.route({
        method: 'GET',
        path: '/search/',
        handler: Api.search,
        config: {
          validate: {
            query: {
              term: Joi.string(),
              offset: Joi.number(),
              limit: Joi.number()
            }
          }
        }
    })

    server.route({
        method: 'GET',
        path: '/search/single/',
        handler: Api.single,
        config: {
          validate: {
            query: {
              photo_id: Joi.number(),
            }
          }
        }
    })

})


server.start(err => {
    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});
