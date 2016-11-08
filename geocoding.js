'use strict'

const request = require('sync-request')

const APIconf = require('./config/api')
const db = require('./config/db')

const establishments = db.collection('establishments_geocoding')
const query = { 'coords': { $exists: false } }
const MAX_REQUEST = 5 

let count = 0

const fetchPlace = (doc) => {
    let queryParams = doc.nomeFantasia
    let url = `${APIconf.endpoints.places}query=${encodeURIComponent(queryParams)}`

    console.log(`Requesting: ${url}`)

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
