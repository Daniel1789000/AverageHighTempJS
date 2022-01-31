const request = require('request');

const places = [
    { placeName: "Salt Lake City", woeid: "2487610" },
    { placeName: "Los Angeles", woeid: "2442047" },
    { placeName: "Boise", woeid: "2366355" },
    //{"nowhere", "0"},
]


places.forEach(place => metaweatherRequest(place, requestCallback))


function getPlaceName(woeid) {
    var result = null
    var length = places.length
    for (index = 0; index < length, result == null; index++) {
        if (places[index].woeid == woeid) {
            result = places[index].placeName
        }
    }
    return(result)
}

function metaweatherRequest(place, woeid){

    const options = {
        url: "https://www.metaweather.com/api/location/" + place.woeid + "/",
        headers: {
            "User-Agent": "request",
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    };
    request(options, requestCallback)
}

function celsiusToFahrenheit(celsius) {
    return (celsius * 9 / 5 + 32)
}

function requestCallback(error, response, body) {
    if (error) {
        console.error(`Could not send request to API: ${error.message}`);
        return;
    }

    if (response.statusCode != 200) {
        console.error(`Expected status code 200 but received ${response.statusCode}.`);
        return;
    }

    responseObject = JSON.parse(body);

    var weatherEvents = responseObject.consolidated_weather
    var numConsolidatedWeatherEvents = weatherEvents.length
    var accumulator = 0.0
    weatherEvents.forEach(event => accumulator += event.max_temp)
    var averageHighTemp = accumulator / numConsolidatedWeatherEvents

    process.stdout.write("for " +
        getPlaceName(responseObject.woeid) +
        " the average high temperature was " +
        Math.round(averageHighTemp) + "\xB0C "+
        Math.round(celsiusToFahrenheit(averageHighTemp)) + "(\xB0F)\n")
}
