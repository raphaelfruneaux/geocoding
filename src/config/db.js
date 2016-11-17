'use strict'

const pmongo = require('promised-mongo')
const settings = {}

settings.protocol = process.env.GEOCODING_PROTOCOL || 'mongodb'
settings.hostname = process.env.GEOCODING_HOSTNAME || 'localhost'
settings.port = process.env.GEOCODING_PORT || '27017'
settings.scheme = process.env.GEOCODING_SCHEME || 'meusus'
settings.uri = `${settings.protocol}://${settings.hostname}:${settings.port}/${settings.scheme}`

var db = pmongo(settings.uri);

module.exports = db;