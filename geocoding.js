'use strict'

const request = require('sync-request')
const mongoose = require('mongoose')
const NodeGeocoder = require('node-geocoder')

const options = {
    provider: 'google',
    formatter: null         // 'gpx', 'string', ...
}

const geocoder = NodeGeocoder(options)

geocoder.geocode('Rua Manoel Lino, 40720-460, salvador')
.then((res) => {
    console.log(res)
    if (res.length > 0)
        console.log(`${res[0].latitude},${res[0].longitude}`)
})
.catch((err) => {
    console.log(err)
})