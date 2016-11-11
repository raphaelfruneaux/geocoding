'use strict'

const delay = (ms) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                ms: ms,
                msg: 'finished timeout'
            })
        }, ms)
    })
}

module.exports = delay