// const LSQ = require('lsq')
const request = require('request-promise')
const Boom = require('boom')

const Utils = require('./common/utils')

const FLICKR_ROOT = 'https://api.flickr.com/services/rest/?'
const FLICKR_METHOD_PHOTOS_SEARCH = 'flickr.photos.search'
const FLICKR_METHOD_PHOTOS_GET_INFO = 'flickr.photos.getInfo'
const FLICKR_METHOD_PHOTOS_GET_SIZES = 'flickr.photos.getSizes'
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
      uri += `method=${FLICKR_METHOD_PHOTOS_SEARCH}`
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

Api.size = (id) => {
  let uri = `${FLICKR_ROOT}`
      uri += `method=${FLICKR_METHOD_PHOTOS_GET_SIZES}`
      uri += `&api_key=${config.flickrApiKey}`
      uri += `&photo_id=${id}`
      uri += `&format=json&nojsoncallback=1`

  let options = {
    uri,
    json: true,
  }

  return request(options)
    .then(response => {
      let size = response.sizes.size[response.sizes.size.length-1]
      let orientation = Utils.getImageOrientation(size.width, size.height)

      return {
        orientation,
        width: size.width,
        height: size.height,
      }
    })
}

Api.single = (req, reply) => {
  const id = req.params.id

  let uri = `${FLICKR_ROOT}`
      uri += `method=${FLICKR_METHOD_PHOTOS_GET_INFO}`
      uri += `&api_key=${config.flickrApiKey}`
      uri += `&photo_id=${id}`
      uri += `&format=json&nojsoncallback=1`

  let options = {
    uri,
    json: true,
  }

  return request(options)    
    .then(response => {
      return Api.size(response.photo.id)
        .then(size => Object.assign({}, response.photo, size))
    })
    .then(reply)
    .catch(error => reply(Boom.badRequest(error)))
}
