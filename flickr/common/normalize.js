'use strict'
const Utils = require('./utils')

let Normalize = {}
module.exports = Normalize

Normalize.flickr = (data) => {
  //console.log(data);
  const SOURCE_NAME = 'flickr'
  let raw = data.photo
  let processed = {}

  processed.contentId = raw.id
  processed.hayId = Utils.getImageID(SOURCE_NAME, processed.contentId)
  processed.sourceName = SOURCE_NAME
  processed.collection = null

  processed.name = raw.title._content
  processed.description = raw.description._content
  processed.creator = raw.owner.realname

  processed.keywords = data.keywords
  //processed.keywordsSearch = null

  processed.tiny = data.tiny
  processed.thumb = data.thumb
  processed.large = data.large
  processed.original = data.original || null

  // processed.largeWatermarked = raw.large_watermarked || null
  processed.url = raw.urls.url[0]._content

  processed.width = data.width === 0 ? 1000 : data.width
  processed.height = data.height === 0 ? 1000 : data.height
  processed.orientation = data.orientation || 2

  processed.dateSource = raw.dates.posted
  processed.dateCamera = raw.dates.taken

  processed.license = raw.license
  // processed.modelRelease = null
  // processed.propertyRelease = null
  // processed.commercial = null
  // processed.editorial = null
  // processed.readyToBuy = null

  // processed.exif = null
  // processed.iptc = null
  // processed.publish = raw.publish
  // processed.rating = null

  // processed.rating = null

  return Object.assign({},
    {
      took: data.took,
      contentId: raw.id,
      sourceName: SOURCE_NAME,
      result: processed,
    },
    {raw}
   )
}
