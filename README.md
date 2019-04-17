# Netatmo Forecast
Netatmo weather forecast controlling script. You can specify timewindow around sunrise when your netatmo thermostat will be off in case of non-cloudiness weather. I noticed that when sunrising, it happens that heating is running even before sunrise and when it's clear day in my case it makes nonsense to preheat. So you can save some 💰and save the 🌏.

Used APIs:
- Netatmo (no-limits) - [dev.netatmo.com](https://dev.netatmo.com/resources/technical/reference/energy)
- DarkSky (max. 1000 req/day)- [darksky.net](https://darksky.net/dev)

# Before usage
![Clear morning, before handling](https://raw.githubusercontent.com/tomwagner/netatmo-forecast/master/netatmo-before.png "Clear morning, before handling")

# After usage
![Clear morning, after handling](https://raw.githubusercontent.com/tomwagner/netatmo-forecast/master/netatmo-after.png "Clear morning, after handling")

- [x] Everything packed and runable in Docker

