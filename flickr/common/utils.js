'use strict'
const requestPromise = require('request-promise')
const uuid = require('node-uuid')
const Timezone = require('timezone/loaded')
const querystring = require('querystring')
const entities = require("entities")


let Utils = {}
module.exports = Utils

// Helper function that standardizes computation of orientation
// from image height and width
Utils.getImageOrientation = (width, height) => {
  if ((width/height <= 0.8) && !(width/height == 1)){
    return 1
  } else if (((width/height) > 1.8)){
    return 2
  } else if (((width/height) > 0.8) && !((width/height) == 1) && !((width/height) > 1.5)){
    return 0
  } else if (((width/height) > 0.8) && ((width/height) < 1.2)){
    return 3
  } else{
    return 0
  }
}

Utils.convertOrientationStringToCode = (code) =>{
  if(code == 'horizontal') return 0
  if(code == 'vertical') return 1
  if(code == 'panoramic') return 2
  if(code == 'square') return 3
}

// Helper function that standardizes computation of image_id
// from source and id
Utils.getImageID = (source, id) => {
  return source + "_" + id;
}

Utils.underscoreToCamel = (data) => {
  let isArray
  if(data.constructor !== Array){
    isArray = true
    data = [data]
  }

  data = data.map(item => {
    let obj = {}
    Object.keys(item).map(key => obj[key.replace(/(\_[a-z])/g, val => val.toUpperCase().replace('_',''))] = item[key])
    return obj
  })

  return isArray ? data[0] : data
}

Utils.dbToUserTransform = (data) => {
  let isArray

  if(data.constructor !== Array){
    isArray = true
    data = [data]
  }

  data = data.map(item => {
    item['keywords'] = item['keywords'] ? item['keywords'].split(',') : []
    item['keywords_search'] = item['keywords_search'] ? item['keywords_search'].split(',') : []
    return item
  })

  data = Utils.underscoreToCamel(data)

  return isArray ? data[0] : data
}

Utils.dbToSearch = (data, took) => {
  return {
      took: took || 100,
      contentId: data.contentId,
      sourceName: data.sourceName,
      result:
      {
        contentId: data.contentId,
        hayId: data.hayId,
        sourceName: data.sourceName,
        collection: data.collection,

        name: entities.decodeHTML(data.name),
        description: entities.decodeHTML(data.description),
        creator: entities.decodeHTML(data.creator),

        keywords: data.keywords,
        keywordsSearch: data.keywordsSearch,

        tiny: data.tiny,
        thumb: data.thumb,
        large: data.large,
        largeWatermarked: data.largeWatermarked ? data.largeWatermarked : null,
        url: data.url,
        width: data.width,
        height: data.height,
        orientation: data.orientation,
        license: data.license,
        dateSource: data.dateSource,
        dateCamera: data.dateCamera,
    }
  }
}

Utils.camelToUnderscore = (data) => {
  let isArray
  if(data.constructor !== Array){
    isArray = true
    data = [data]
  }

  data = data.map(item => {
    let obj = {}
    Object.keys(item).map(key => obj[key.replace(/([A-Z])/g, val => "_"+val.toLowerCase() )] = item[key])
    return obj
  })

  return isArray ? data[0] : data
}

/**
 * Creates an iterator that gives subarrays of an array, yielding the result.
 *
 * @param array The array to get the subarrays.
 * @param num The number of elements inside the subarray.
 */
Utils.sliceArrayIterator = function*(array, num){
  let position = 0
  while (position < array.length){
    let result = array.slice(position, position + num)
    yield result
    position += num
  }
}

Utils.generateHash = () => {
  return uuid.v4()
}

/**
 * Creates a query url from an object, example: limit=1&offset=30
 *
 * @param query Object to convert.
 * @returns Query url string
 */
Utils.objectToQueryString = (query) => {

  let data = Object.create(null)

  let array = []
  for(let key in query)
    if (Object.prototype.hasOwnProperty.call(query, key)){
      array.push(encodeURIComponent(key) + "=" + encodeURIComponent(query[key]));
    }
  return array.join("&");
}

/**
 * Converts an object to string with a comma separated format.
 * For example: 'offset:10,size:20,name:fullname'
 *
 * @param {any} object
 * @returns object with string format.
 */
Utils.objectToString = (object) => {
  let array = []
  for (let key in object) {
    array.push(key + ": " + object[key])
  }
  return array.join()
}

/*
 * Use localizeNewYork to transform an object which has keys that meet the
 * TIMEZONE array in const ../common/constants passed throught check
 *
 * @object, check
 * @returns original objects with the transformation, Timzone time with New York timezone.
 */

Utils.timeZone = (object, check) => {
  let keys = Object.keys(object)
  let matched = keys.filter(key => check.indexOf(key) != -1 )
  let transformed = Object.assign({}, object)

  matched.forEach(item => {
    transformed[item] =  Utils.localizeNewYork(transformed[item])
  })
  return transformed
}

/**
* Localizes a date based on New York time.
*
* @param dateTime The dateTime to convert.
* @returns Timzone time with New York timezone.
*/
Utils.localizeNewYork = (dateTime) => {
  return Timezone(dateTime, '%c', 'en_US', 'America/New_York')
}

Utils.unique = (value, index, self) => {
  return self.indexOf(value) === index
}

/**
 * Encodes text to base64.
 *
 * @param {string} Text to transform to base64.
 * @returns a base64 encoded text.
 */
Utils.toBase64 = (text) => {
  return new Buffer(text).toString('base64')
}

/**
 * Generates a random string
 *
 * @param {Integer} length
 * @returns a random string of size specified.
 */
Utils.randomString = (length) => {
  if (!length) return ''
  var rand = Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length)))
  return rand.toString(36).slice(1)
}

Utils.uniqueArray = (a) => [...new Set(a)]

/**
 * Extend the Array object
 * @param candid The string to search for
 * @returns Returns the index of the first match or -1 if not found
*/
Array.prototype.searchFor = function(candid) {
  for (var i=0; i<this.length; i++)
    if (this[i].indexOf(candid) == 0)
      return i
  return -1
}
