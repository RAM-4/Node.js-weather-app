// Config
const path = require('path')
const express = require('express')
const hbs = require('hbs')
const app = express()
const port = process.env.PORT || 3000

// Utils
    // App
    const forecast = require('./utils/forecast')
    const geocode = require('./utils/geocode')
    // Content  
    const label = require('./utils/label')

// Define paths for Express config
const publicDirectoryPath = path.join( __dirname, '../public' )
const viewsPath = path.join( __dirname, '../templates/views' )
const partialsPath = path.join ( __dirname, '../templates/partials' )

// Setup handlebars engine and views location
app.set( 'view engine', 'hbs' )
app.set( 'views', viewsPath )
hbs.registerPartials( partialsPath )

// Static directory to serve
app.use(express.static( publicDirectoryPath ))

// Route to index
app.get('', ( req, res ) => {
    res.render( label.site.index, {
        title: label.site.name,
        name: label.author
    })
})

// Route to about
app.get('/about', ( req, res ) => {
    res.render( label.site.about, {
        title: label.site.about,
        name: label.author
    })
})

// Route to help
app.get('/help', ( req, res ) => {
    res.render( label.site.help, {
        title: label.site.help.title,
        message: label.site.help.message,
        name: label.author
    })
})

app.get( '/help/*', ( req, res ) => {
    res.render( label.site.error.message, {
        title: label.site.error,
        name: label.author,
        error: label.site.help.message
    })
})

// Route to weather
app.get('/weather', ( req, res ) => {
    if( !req.query.address ){
        return res.send({ 
            error: label.site.weather.error
        })
    }

    geocode( req.query.address, ( error, { latitude, longitude, location } = {} ) => {

        if( error ){
          return res.send({ error })
        }
        
        forecast( latitude, longitude, ( error, forecastData ) => {

          if( error ){
            return res.send({ error })
          }

          res.send({
            address: req.query.address,
            forecast: forecastData, location
          })

        })

      })

})

// 404 handling
app.get('*', ( req, res ) => {
    res.render ('404', {
        title: label.site.error.title,
        name: label.author,
        error: label.site.error.error
    })
})


app.listen( port, () => {
    console.log( 'Server is up on port ' + port )
})