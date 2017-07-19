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
        path: '/search',
        handler: Api.search,
        config: {
          validate: {
            query: {
              term: Joi.string(),
              offset: Joi.number().min(0).default(0),
              limit: Joi.number().min(1).max(200).default(60)
            }
          }
        }
    })

    server.route({
        method: 'GET',
        path: '/search/{id}',
        handler: Api.single,
        config: {
          validate: {
            params: {
              id: Joi.string()
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
