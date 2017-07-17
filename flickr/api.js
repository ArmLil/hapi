// const LSQ = require('lsq')
const request = require('request-promise')
const Boom = require('boom')

const FLICKR_ROOT = 'https://api.flickr.com/services/rest/?'
const FLICKR_METHOD_SEARCH = 'flickr.photos.search'

let config = {}

// LSQ.config.get()
// .done(c => {
//   config.flickrApiKey = c.flickr_api_key
// })

//
//if not lsq
//
config.flickrApiKey = '035845d8f12006199c3942da46accecc'

let Api = {}
module.exports = Api

Api.search = (req, reply) => {
  const term = req.query.term
  const offset = req.query.offset
  const limit = req.query.limit  

  let options = `${FLICKR_ROOT}`
      options += `method=${FLICKR_METHOD_SEARCH}`
      options += `&api_key=${config.flickrApiKey}`
      options += `&tags=${term}`
      options += `&per_page=${limit}`
      options += `&page=${offset === 0 ? 1: offset*limit}`
      options += `&extras=description,license,date_upload,date_taken,owner_name,icon_server,original_format,last_update,geo,tags,machine_tags,o_dims,views,media,path_alias,url_sq,url_t,url_s,url_q,url_m,url_n,url_z,url_c,url_l,url_o`
      options += `&format=json&nojsoncallback=1`

  return request(options)
    .then(reply)
    .catch(error => reply(Boom.badRequest(error)))
}