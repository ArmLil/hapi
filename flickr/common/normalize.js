const Utils = require('./utils')

const Normalize = {}
module.exports = Normalize

Normalize.flickr = (data) => {
  const SOURCE_NAME = 'flickr'
  const photo = data.photo
  const processed = {}

  processed.contentId = photo.id
  processed.hayId = Utils.getImageID(SOURCE_NAME, processed.contentId)
  processed.sourceName = SOURCE_NAME
  processed.collection = null

  processed.name = photo.title._content // eslint-disable-line no-underscore-dangle
  processed.description = photo.description._content // eslint-disable-line no-underscore-dangle
  processed.creator = photo.owner.realname || photo.owner.username

  processed.keywords = data.keywords
  processed.keywordsSearch = null

  processed.tiny = data.tiny || null
  processed.thumb = data.thumb || null
  processed.large = data.large || null
  processed.original = data.original || null

  processed.url = photo.urls.url[0]._content // eslint-disable-line no-underscore-dangle

  processed.width = data.width === 0 ? 1000 : data.width
  processed.height = data.height === 0 ? 1000 : data.height
  processed.orientation = data.orientation || 2

  processed.dateSource = new Date(photo.dates.posted * 1000)
  processed.dateCamera = new Date(photo.dates.taken)

  processed.license = data.license
  processed.modelRelease = null
  processed.propertyRelease = null
  processed.commercial = null
  processed.editorial = data.license === 2 ||
    (data.license >= 20 && data.license <= 30)
  processed.readyToBuy = false

  // processed.exif = null
  // processed.iptc = null
  processed.publish = false

  return Object.assign({}, {
    took: data.took,
    contentId: photo.id,
    sourceName: SOURCE_NAME,
    result: processed,
  }, {
    raw: photo,
  })
}
