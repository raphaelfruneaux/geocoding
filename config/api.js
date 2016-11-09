const apiKey = process.env.APIKEY || '<apikey>'

const apiBaseUrl = 'https://maps.googleapis.com/maps/api'
const endpoints = {}

endpoints.places = `${apiBaseUrl}/place/textsearch/json?key=${apiKey}&`
endpoints.geocode = `${apiBaseUrl}/geocode/json?`

module.exports.endpoints = endpoints