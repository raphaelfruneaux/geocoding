'use strict'

const pmongo = require('promised-mongo')
const settings = {}

settings.protocol = 'mongodb'
settings.hostname = 'localhost'
settings.port = '27017'
settings.scheme = 'meusus'
settings.uri = `${settings.protocol}://${settings.hostname}:${settings.port}/${settings.scheme}`

var db = pmongo(settings.uri);

module.exports = db;