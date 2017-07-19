'use strict'
const Utils = require('./utils')

let Normalize = {}
module.exports = Normalize

Normalize.flickr = (data) => {  
  const SOURCE_NAME = 'flickr'
  let raw = data.photo
  let processed = {}  

  processed.contentId = raw.id  
  processed.hayId = Utils.getImageID(SOURCE_NAME, processed.contentId)
  processed.sourceName = SOURCE_NAME
  processed.collection = null

  // processed.name = raw.name
  // processed.description = raw.description
  // processed.creator = raw.creator

  // processed.keywords = keywordsList || null
  // processed.keywordsSearch = null

  // processed.tiny = raw.tiny
  // processed.thumb = raw.thumb
  // processed.large = raw.large
  // processed.largeWatermarked = raw.large_watermarked || null
  // processed.url = raw.url

  processed.width = data.width === 0 ? 1000 : data.width
  processed.height = data.height === 0 ? 1000 : data.height
  processed.orientation = data.orientation || 2

  // processed.dateSource = raw.date_source
  // processed.dateCamera = raw.date_camera

  // processed.license = raw.license
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
    {original: raw}
   )
}
