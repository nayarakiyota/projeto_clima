// Função independente para testes
async function buscarClimaPorCidade(city) {
    if (!city) throw new Error("Cidade não informada.");

    const geoResp = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`
    );

    if (!geoResp.ok) throw new Error("Erro na API de geolocalização");

    const geoData = await geoResp.json();
    if (!geoData.results || geoData.results.length === 0)
        throw new Error("Cidade não encontrada.");

    const { latitude, longitude } = geoData.results[0];

    const weatherResp = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );

    if (!weatherResp.ok) throw new Error("Erro na API de clima");

    const weatherData = await weatherResp.json();

    if (!weatherData.current_weather)
        throw new Error("Dados de clima indisponíveis.");

    return {
        temperatura: weatherData.current_weather.temperature,
        codigoClima: weatherData.current_weather.weathercode,
        daily: weatherData.daily,
    };
}

module.exports = { buscarClimaPorCidade };
