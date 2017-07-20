// const LSQ = require('lsq')
const request = require('request-promise')
const Boom = require('boom')

const Utils = require('./common/utils')
const Normalize = require('./common/normalize')

const FLICKR_ROOT = 'https://api.flickr.com/services/rest/?'
const FLICKR_METHOD_PHOTOS_SEARCH = 'flickr.photos.search'
const FLICKR_METHOD_PHOTOS_GET_INFO = 'flickr.photos.getInfo'
const FLICKR_METHOD_PHOTOS_GET_SIZES = 'flickr.photos.getSizes'

const config = {}

// LSQ.config.get()
// .done(c => {
//   config.flickrApiKey = c.flickr_api_key
// })

//
// if not lsq
//
config.flickrApiKey = '035845d8f12006199c3942da46accecc'

const Api = {}
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
  uri += `&page=${offset === 0 ? 1 : offset * limit}`
  uri += '&format=json&nojsoncallback=1'
    // uri +=
    //   '&extras=description,license,date_upload,date_taken,owner_name,icon_server,original_format,last_update,geo,tags,machine_tags,o_dims,views,media,path_alias,url_sq,url_t,url_s,url_q,url_m,url_n,url_z,url_c,url_l,url_o'

  const start = new Date()
  const options = {
    uri,
    json: true,
  }
  let raw
  return request(options)
    .then(flickrResponse => {
      raw = flickrResponse
      const promises = []
      flickrResponse.photos.photo.map(item => promises.push(Api.singleCall(
        item.id)))
      return Promise.all(promises)
    })
    .then(promises => promises.map(promise => promise.result))
    .then(items => Object.assign({}, {
      took: {
        flickr: (new Date()) - start,
      },
      matches: {
        flickr: parseInt(raw.photos.total, 10),
      },
      totals: {
        flickr: 10000000000,
      },
      results: items,
    }))
    .then(reply)
    .catch(error => reply(Boom.badRequest(error)))
}

Api.dimensions = (flickrResponse) => {
  let uri = `${FLICKR_ROOT}`
  uri += `method=${FLICKR_METHOD_PHOTOS_GET_SIZES}`
  uri += `&api_key=${config.flickrApiKey}`
  uri += `&photo_id=${flickrResponse.photo.id}`
  uri += '&format=json&nojsoncallback=1'

  const options = {
    uri,
    json: true,
  }

  return request(options)
    .then(response => {
      const dimensions = response.sizes.size[response.sizes.size.length -
        1]
      const orientation = Utils.getImageOrientation(dimensions.width,
        dimensions.height)
      return {
        height: parseInt(dimensions.height, 10),
        width: parseInt(dimensions.width, 10),
        original: dimensions.source,
        orientation,
      }
    })
    .then(dimensions => Object.assign({}, flickrResponse, dimensions))
}

Api.keywords = (flickrResponse) => {
  const tags = flickrResponse.photo.tags.tag
  const keywords = []

  tags.map(keyword => keywords.push(keyword.raw))

  return Object.assign({}, flickrResponse, {
    keywords,
  })
}

Api.license = (flickrResponse) => {
  // <license id="0" name="All Rights Reserved" url="" />
  // <license id="1" name="Attribution-NonCommercial-ShareAlike License" url="http://creativecommons.org/licenses/by-nc-sa/2.0/" />
  // <license id="2" name="Attribution-NonCommercial License" url="http://creativecommons.org/licenses/by-nc/2.0/" />
  // <license id="3" name="Attribution-NonCommercial-NoDerivs License" url="http://creativecommons.org/licenses/by-nc-nd/2.0/" />
  // <license id="4" name="Attribution License" url="http://creativecommons.org/licenses/by/2.0/" />
  // <license id="5" name="Attribution-ShareAlike License" url="http://creativecommons.org/licenses/by-sa/2.0/" />
  // <license id="6" name="Attribution-NoDerivs License" url="http://creativecommons.org/licenses/by-nd/2.0/" />
  // <license id="7" name="No known copyright restrictions" url="http://flickr.com/commons/usage/" />
  // <license id="8" name="United States Government Work" url="http://www.usa.gov/copyright.shtml" />
  // 0 = royalty free, 1 = rights managed, 2 = creativecommons, 3 = gov
  // 21	Creative Commons License Non Commercial Attribution
  // 22	Creative Commons License Non Commercial No Derivatives
  // 23	Creative Commons License Non Commercial Share Alike
  // 24	Creative Commons License Attribution
  // 25	Creative Commons License No Derivatives
  // 26	Creative Commons License Share Alike
  // 27	Creative Commons License Public Domain Mark 1.0
  // 28	Creative Commons License Public Domain Dedication
  let license = 1

  if (flickrResponse.license === 1) license = 23
  else if (flickrResponse.license === 2) license = 21
  else if (flickrResponse.license === 3) license = 22
  else if (flickrResponse.license === 4) license = 24
  else if (flickrResponse.license === 5) license = 26
  else if (flickrResponse.license === 6) license = 25
  else if (flickrResponse.license === 7) license = 2
  else if (flickrResponse.license === 8) license = 3

  return Object.assign({}, flickrResponse, {
    license,
  })
}

Api.singleCall = (id) => {
  const start = new Date().getTime()
  let uri = `${FLICKR_ROOT}`
  uri += `method=${FLICKR_METHOD_PHOTOS_GET_INFO}`
  uri += `&api_key=${config.flickrApiKey}`
  uri += `&photo_id=${id}`
  uri += '&format=json&nojsoncallback=1'

  const options = {
    uri,
    json: true,
  }

  return request(options)
    .then(flickrResponse => Object.assign({}, flickrResponse, {
      took: ((new Date().getTime()) - start),
    }))
    .then(Api.dimensions)
    .then(Api.keywords)
    .then(Api.license)
    .then(Normalize.flickr)
}

Api.single = (req, reply) => {
  const id = req.params.id

  Api.singleCall(id)
    .then(reply)
    .catch(error => reply(Boom.badRequest(error)))
}
