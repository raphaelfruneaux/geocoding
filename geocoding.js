'use strict'

const request = require('sync-request')

const APIconf = require('./config/api')
const db = require('./config/db')

const utils = require('./modules/utils')
const sleep = require('./modules/sleep')

const establishments = db.collection('establishments_geocoding')
const query = { 'coords': { $exists: false } }
const MAX_REQUEST = 5000 
const TIMEOUT = 1000

let count = 0

const fetchPlace = (doc) => {
    const prefix = '[FetchPlace]'

    let queryParams = doc.nomeFantasia
    let url = `${APIconf.endpoints.places}query=${encodeURIComponent(queryParams)}`

    console.log(`${prefix} Requesting Place: ${doc.nomeFantasia}`)
    console.log(`${prefix} Requesting URL: ${url}`)

    let res = request('GET', url)
    let data = JSON.parse(res.getBody())

    if (data && data.status == 'ZERO_RESULTS') {
        return null
    }

    return data 
}

const fetchGeocode = (doc) => {
    let queryParams = doc.nomeFantasia
    let url = `${APIconf.endpoints.geocode}address=${encodeURIComponent(utils.parseAddress(doc))}`

    console.log(`[Geocode] Requesting Address: ${utils.parseAddress(doc)}`)
    console.log(`[Geocode] Requesting URL: ${url}`)

    let res = request('GET', url)
    let data = JSON.parse(res.getBody())

    console.log('**********')
    console.log(data)
    console.log('**********')
}

const synchronize = async () => {
    const prefix = '[Synchronize]'

    if (count == MAX_REQUEST)
        return
    
    if (count > 0)
        await sleep(TIMEOUT)

    return establishments.count(query).then((c) => {
        if (!c)
            return 

        console.log(`${prefix} Found ${c} record(s)`)

        return establishments.findOne(query).then((doc) => {
            console.log(`${prefix} Found record!`)
            console.log(`${prefix} Doc: ${doc.nomeFantasia}`)
            
            let data = fetchPlace(doc)

            if (data) {
                establishments
                .update({ _id: doc._id }, { $set: { gmapinfo: data } })
                .then((doc) => {
                    console.log(`${prefix}[Success] Doc: ${doc.nomeFantasia} updated successfully`)
                })
                .catch((err) => {
                    console.log('ERROR', err)
                })
                .then(() => {
                    console.log(`-----------------------------`)
                })
            }
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

init().then(() => {
    console.log('Finished')
    process.exit()
}, (err) => {
    console.log('Finished with error')
    console.log(err);
    process.exit()
})
