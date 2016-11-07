const apiKey = process.env.APIKEY || '<apikey>'

module.exports = {
    baseURL: `https://maps.googleapis.com/maps/api/place/textsearch/json?key=${apiKey}&`
}