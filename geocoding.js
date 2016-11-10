'use strict'

const request = require('sync-request')

const APIconf = require('./config/api')
const db = require('./config/db')

const establishments = db.collection('establishments_geocoding')
const query = { 'coords': { $exists: false } }
const MAX_REQUEST = 1 

let count = 0

const parseAddress = (doc) => {
    let address = []

    for (let key in doc.endereco) {
        if (key != 'municipio' && key != 'cep' && doc.endereco[key]) {
            address.push(doc.endereco[key])
        }
    }

    return address.join(', ')
} 

const fetchPlace = (doc) => {
    let queryParams = doc.nomeFantasia
    let url = `${APIconf.endpoints.places}query=${encodeURIComponent(queryParams)}`

    console.log(`[Place] Requesting Place: ${doc.nomeFantasia}`)
    console.log(`[Place] Requesting URL: ${url}`)

    let res = request('GET', url)
    let data = JSON.parse(res.getBody())

    console.log('**********')
    console.log(data)
    console.log('**********')

    if (data.status == 'ZERO_RESULTS') {
        return
        // fetchGeocode(doc)
    }

    establishments.update(
        { _id: doc._id },
        { $set: 
            {
                gmapinfo: data
            }
        }
    )
}

const fetchGeocode = (doc) => {
    let queryParams = doc.nomeFantasia
    let url = `${APIconf.endpoints.geocode}address=${encodeURIComponent(parseAddress(doc))}`

    console.log(`[Geocode] Requesting Address: ${parseAddress(doc)}`)
    console.log(`[Geocode] Requesting URL: ${url}`)

    let res = request('GET', url)
    let data = JSON.parse(res.getBody())

    console.log('**********')
    console.log(data)
    console.log('**********')
}

const synchronize = () => {
    if (count == MAX_REQUEST)
        return

    return establishments.count(query).then((c) => {
        if (!c)
            return 

        console.log(`Found ${c} record(s)`)

        return establishments
        .findOne(query)
        .then((doc) => {
            console.log(`Find record!`)
            console.log(`Doc: ${doc.nomeFantasia}`)
            
            fetchPlace(doc)

            console.log(`-----------------------------`)
        })
        .then(() => {
            count++ 
            return synchronize() 
        })
        
    }).catch((err) => {
        console.log(err)
    })
}

const init = () => {
    let s = Promise.resolve(synchronize())
    return Promise.all([s])
}

init().then().then(() => {
    console.log('Finished')
    process.exit()
})
