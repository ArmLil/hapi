// const LSQ = require('lsq')
const request = require('request-promise')
const Boom = require('boom')

const FLICKR_ROOT = 'https://api.flickr.com/services/rest/?'
const FLICKR_METHOD_SEARCH_PHOTO = 'flickr.photos.search'
const FLICKR_METHOD_SEARCH_PHOTO_ID = 'flickr.photos.getInfo'
//const FLICKR_PHOTO_URL = 'https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=035845d8f12006199c3942da46accecc&photo_id=35156805504&format=json&nojsoncallback=1';

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

  let uri = `${FLICKR_ROOT}`
      uri += `method=${FLICKR_METHOD_SEARCH_PHOTO}`
      uri += `&api_key=${config.flickrApiKey}`
      uri += `&tags=${term}`
      uri += `&per_page=${limit}`
      uri += `&page=${offset === 0 ? 1: offset*limit}`
      uri += `&extras=description,license,date_upload,date_taken,owner_name,icon_server,original_format,last_update,geo,tags,machine_tags,o_dims,views,media,path_alias,url_sq,url_t,url_s,url_q,url_m,url_n,url_z,url_c,url_l,url_o`
      uri += `&format=json&nojsoncallback=1`

  let options = {
    uri,
    json: true
  }

  return request(options)
    .then(reply)
    .catch(error => reply(Boom.badRequest(error)))
}


Api.single = (req, reply) => {
  const id = req.params.id

  let uri = `${FLICKR_ROOT}`
      uri += `method=${FLICKR_METHOD_SEARCH_PHOTO_ID}`
      uri += `&api_key=${config.flickrApiKey}`
      uri += `&photo_id=${id}`
      uri += `&format=json&nojsoncallback=1`

  let options = {
    uri,
    json: true,
  }

  return request(options)    
    .then(reply)
    .catch(error => reply(Boom.badRequest(error)))
}
