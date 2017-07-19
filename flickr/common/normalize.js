'use strict'
let Normalize = {}
module.exports = Normalize

Normalize.image = (data) => {
  let raw = data._source
  let processed = {}

  let keywordsList
  if(raw.keywords && !Array.isArray(raw.keywords)){
    keywordsList = raw.keywords.split(',')
  }
  else{
    if(raw.keywords) keywordsList =  raw.keywords.join(', ')
  }

  processed.contentId = raw.content_id
  processed.hayId = raw.hay_id
  processed.sourceName = raw.source_name
  processed.collection = raw.collection

  processed.name = raw.name
  processed.description = raw.description
  processed.creator = raw.creator

  processed.keywords = keywordsList || null
  processed.keywordsSearch = null

  processed.tiny = raw.tiny
  processed.thumb = raw.thumb
  processed.large = raw.large
  processed.largeWatermarked = raw.large_watermarked || null
  processed.url = raw.url

  processed.width = raw.width === 0 ? 1000 : raw.width
  processed.height = raw.height === 0 ? 1000 : raw.height
  processed.orientation = raw.orientation

  processed.dateSource = raw.date_source
  processed.dateCamera = raw.date_camera

  processed.license = raw.license
  processed.modelRelease = null
  processed.propertyRelease = null
  processed.commercial = null
  processed.editorial = null
  processed.readyToBuy = null

  processed.exif = null
  processed.iptc = null
  processed.publish = raw.publish
  processed.rating = null

  return processed
}
