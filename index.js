import dotenv from 'dotenv'
import express from 'express'
import { ProcessPartyPlayer } from './helper.js'

dotenv.config()

const app = express()
const port = 3000

app.get('/party-plan', async (req, res) => {
    const locations = req.query.locations
    if (!locations || locations.length < 1) {
        res.status(400).send('Please provide at least one locations')
        return
    }
    const processPartyPlayer = new ProcessPartyPlayer(
        req.query.from,
        req.query.to,
        locations
    )
    let formatedPrediction = {
        error: 'No place with a suitable weather condition found',
    }
    await processPartyPlayer.getWeatherInfoForAllLocationsForDateRange()
    const bestWeather = await processPartyPlayer.getBestWeatherInfo()
    if (bestWeather) {
        formatedPrediction = {
            location: bestWeather.address,
            date: bestWeather.date,
        }
    }
    res.send(formatedPrediction)
})

if (!process.env.GOOGLE_API_KEY) {
    throw Error('Please set the GOOGLE_API_KEY environment variable')
}

app.listen(port, () => {
    console.log(`Party plan app listening on port ${port}`) // eslint-disable-line
})
