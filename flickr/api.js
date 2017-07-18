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
  const photo_id = req.query.photo_id

  const get_path = (_term, _offset, _limit, _photo_id) => {
    
    let photo_path = `${FLICKR_ROOT}`
    photo_path += `method=${FLICKR_METHOD_SEARCH_PHOTO}`
    photo_path += `&api_key=${config.flickrApiKey}`
    photo_path += `&tags=${term}`
    photo_path += `&per_page=${limit}`
    photo_path += `&page=${offset === 0 ? 1: offset*limit}`
    photo_path += `&extras=description,license,date_upload,date_taken,owner_name,icon_server,original_format,last_update,geo,tags,machine_tags,o_dims,views,media,path_alias,url_sq,url_t,url_s,url_q,url_m,url_n,url_z,url_c,url_l,url_o`
    photo_path += `&format=json&nojsoncallback=1`

    let photo_id_path = `${FLICKR_ROOT}`
    photo_id_path += `method=${FLICKR_METHOD_SEARCH_PHOTO_ID}`
    photo_id_path += `&api_key=${config.flickrApiKey}`
    photo_id_path += `&photo_id=${photo_id}`
    photo_id_path += `&format=json&nojsoncallback=1`

    if ((_term !== undefined
      || _offset !== undefined
      || _limit !== undefined)
      & _photo_id === undefined) return photo_path;

    if (_photo_id !== undefined) return photo_id_path;
  }

  //console.log(get_path(term,offset,limit,photo_id))

  let options = {
    uri: get_path(term,offset,limit,photo_id),
    json: true
  }

  return request(options)
    .then(reply)
    .catch(error => reply(Boom.badRequest(error)))
}
