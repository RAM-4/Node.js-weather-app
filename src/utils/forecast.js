const request = require('request')

const forecast = ( latitude, longitude, callback ) => {
  const url = 'http://api.weatherstack.com/current?access_key=SOMEAPIKEY&query=' + latitude + ',' + longitude

  request( { url, json: true }, ( error, { body } ) => {
    if( error ){
      callback( 'Unable to connect to weather services !', undefined )
    } else if( body.error ) {
      callback( 'Unable to find location. Please try another search.', undefined )
    } else {
      callback( undefined, {
        forecastString: 'Temperature  ' + body.current.temperature + ' celsius degrees. Precipitation risk : ' + body.current.precip + ' %.'
      })
    }
  })
}

module.exports = forecast
