function getWeatherIcon(code) {
    const icons = {
        0: "wi-day-sunny",
        1: "wi-day-sunny-overcast",
        2: "wi-day-cloudy",
        3: "wi-cloudy",
        45: "wi-fog",
        48: "wi-fog",
        51: "wi-sprinkle",
        53: "wi-sprinkle",
        55: "wi-showers",
        56: "wi-rain-mix",
        57: "wi-rain-mix",
        61: "wi-rain",
        63: "wi-rain-mix",
        65: "wi-rain-wind",
        66: "wi-rain-mix",
        67: "wi-rain-mix",
        71: "wi-snow",
        73: "wi-snow",
        75: "wi-snow-wind",
        77: "wi-snow",
        80: "wi-showers",
        81: "wi-showers",
        82: "wi-rain-wind",
        85: "wi-snow",
        86: "wi-snow-wind",
        95: "wi-thunderstorm",
        96: "wi-storm-showers",
        99: "wi-hail"
    };

    return icons[code] || "wi-na";
}

function getWeatherDescription(code) {
    const descriptions = {
        0: "Céu limpo",
        1: "Principalmente limpo",
        2: "Parcialmente nublado",
        3: "Encoberto",
        45: "Nevoeiro",
        48: "Nevoeiro",
        51: "Garoa leve",
        53: "Garoa moderada",
        55: "Garoa forte",
        56: "Garoa congelante",
        57: "Garoa congelante forte",
        61: "Chuva leve",
        63: "Chuva moderada",
        65: "Chuva forte",
        66: "Chuva congelante",
        67: "Chuva congelante forte",
        71: "Neve leve",
        73: "Neve moderada",
        75: "Neve intensa",
        77: "Grânulos de neve",
        80: "Pancadas de chuva leves",
        81: "Pancadas moderadas",
        82: "Pancadas fortes",
        85: "Neve fraca",
        86: "Neve forte",
        95: "Tempestade",
        96: "Tempestade com granizo",
        99: "Tempestade severa"
    };

    return descriptions[code] || "Tempo desconhecido";
}

async function buscarClimaMock(fetchFn, cidade) {
    if (!cidade.trim()) {
        throw new Error("CIDADE_VAZIA");
    }

    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${cidade}`;
    const geoResp = await fetchFn(geoUrl);
    const geoData = await geoResp.json();

    if (!geoData.results || geoData.results.length === 0) {
        throw new Error("CIDADE_NAO_ENCONTRADA");
    }

    const { latitude, longitude } = geoData.results[0];
    const weatherUrl =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

    const weatherResp = await fetchFn(weatherUrl);
    if (!weatherResp.ok) throw new Error("API_ERROR");

    const weatherData = await weatherResp.json();
    return weatherData.current_weather;
}

module.exports = {
    getWeatherIcon,
    getWeatherDescription,
    buscarClimaMock,
};
