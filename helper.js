import axios from 'axios'

export class ProcessPartyPlayer {
    constructor(
        from,
        to,
        locations,
        windSpeedLimit = 30,
        temperatureLowerLimit = 20,
        temperatureUpperLimit = 30
    ) {
        this.from = from
        this.to = to
        this.weatherInfo = []
        this.locations = locations
        this.windSpeedLimit = windSpeedLimit
        this.temperatureLowerLimit = temperatureLowerLimit
        this.temperatureUpperLimit = temperatureUpperLimit
    }

    async getCordinates() {
        const url =
            'https://maps.googleapis.com/maps/api/geocode/json?address=' +
            this.locations +
            '&key=' +
            process.env.GOOGLE_API_KEY
        const data = await axios(url)
        const coordinates = data.data.results.map((result) => {
            return {
                address: result.formatted_address,
                lat: result.geometry.location.lat,
                lng: result.geometry.location.lng,
            }
        })
        return coordinates
    }

    async getWeatherInfo(lat, lng, date) {
        console.log(`Getting weather info for ${lat}, ${lng}`) // eslint-disable-line
        const url = `https://api.brightsky.dev/weather?lat=${lat}&lon=${lng}&date=${date}`
        const data = await axios(url)
        return data.data
    }

    async getWeatherInfoForAllLocations(date) {
        const latLong = await this.getCordinates()
        await Promise.all(
            latLong.map(async (location) => {
                await this.getWeatherInfo(location.lat, location.lng, date)
                    .then((weather) => {
                        const data = weather.weather.map((weather) => {
                            return {
                                ...location,
                                date,
                                sunshine: weather.sunshine,
                                precipitation: weather.precipitation,
                                wind_speed: weather.wind_speed,
                                temperature: weather.temperature,
                            }
                        })
                        this.weatherInfo = [...this.weatherInfo, ...data]
                    })
                    .catch((err) => {
                        console.log(err) // eslint-disable-line
                    })
            })
        )
        return this.weatherInfo
    }

    async getWeatherInfoForAllLocationsForDateRange() {
        const fromDate = new Date(this.from)
        const toDate = new Date(this.to)

        while (fromDate <= toDate) {
            const date = fromDate.toISOString().split('T')[0]
            await this.getWeatherInfoForAllLocations(date)
            fromDate.setDate(fromDate.getDate() + 1)
        }
        return this.weatherInfo
    }

    async getBestWeatherInfo() {
        this.weatherInfo = this.weatherInfo.filter((weather) => {
            return (
                weather.wind_speed < this.windSpeedLimit &&
                weather.temperature > this.temperatureLowerLimit &&
                weather.temperature < this.temperatureUpperLimit
            )
        })
        if (this.weatherInfo.length > 0) {
            const bestWeather = this.weatherInfo.reduce((acc, curr) => {
                if (
                    acc.sunshine &&
                    acc.sunshine >= curr.sunshine &&
                    acc.precipitation <= curr.precipitation
                ) {
                    return acc
                }
                return curr
            })
            return bestWeather
        }

    }
}
