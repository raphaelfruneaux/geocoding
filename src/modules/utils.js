'use strict'

const parseAddress = (doc) => {
    let address = []

    for (let key in doc.endereco) {
        if (key != 'municipio' && key != 'cep' && doc.endereco[key]) {
            address.push(doc.endereco[key])
        }
    }

    return address.join(', ')
} 

module.exports.parseAddress = parseAddress