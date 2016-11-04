'use strict'

console.log(process.env.apikey)

const request = require('sync-request')
const MongoClient = require('mongodb').MongoClient

const APIconf = require('./config/api')
const db = require('./config/db')

const collection = db.collection('establishments_geocoding')

collection.findOne({ 'coords' : { $exists: false }}).then((docs) => {
    console.log(`Find record!`)
    console.log(`Doc: ${docs.nomeFantasia}`)
})