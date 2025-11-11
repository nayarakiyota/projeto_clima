/**
 * @fileoverview Script responsável por buscar e exibir informações meteorológicas
 * utilizando a API Open-Meteo, com base na cidade informada pelo usuário.
 *
 * Corrigido para sincronizar corretamente o dia atual da API (current_weather)
 * com o array daily.time, evitando duplicação da data de hoje nos “Próximos dias”.
 */

// === SELETORES DO DOM ===
const form = document.getElementById("search-form");
const input = document.getElementById("city-input");
const result = document.getElementById("result");
const message = document.getElementById("message");
const tempEl = document.getElementById("temperature");
const cityNameEl = document.getElementById("city-name");
const homeBtn = document.getElementById("home-btn");
const title = document.getElementById("title");

// === ELEMENTOS DINÂMICOS ===
const weatherDescEl = document.createElement("p");
const dateEl = document.createElement("p");
const forecastContainer = document.createElement("div");

weatherDescEl.id = "weather-description";
dateEl.id = "weather-date";
forecastContainer.id = "forecast-container";
forecastContainer.classList.add("forecast");

cityNameEl.insertAdjacentElement("afterend", weatherDescEl);
weatherDescEl.insertAdjacentElement("afterend", dateEl);
dateEl.insertAdjacentElement("afterend", forecastContainer);

// === FUNÇÕES AUXILIARES ===

/** Retorna a data atual formatada em português */
function formatarDataHora() {
    const agora = new Date();
    const opcoes = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    };
    return agora.toLocaleDateString("pt-BR", opcoes);
}

/** Retorna a classe de ícone do clima */
function getWeatherIcon(code) {
    const map = {
        0: "wi-day-sunny",
        1: "wi-day-sunny-overcast",
        2: "wi-day-cloudy",
        3: "wi-cloudy",
        45: "wi-fog",
        48: "wi-fog",
        51: "wi-sprinkle",
        61: "wi-rain",
        63: "wi-rain-mix",
        65: "wi-showers",
        71: "wi-snow",
        80: "wi-showers",
        95: "wi-thunderstorm",
    };
    return map[code] || "wi-na";
}

/** Retorna a descrição textual do clima */
function getWeatherDescription(code) {
    const map = {
        0: "Céu limpo",
        1: "Parcialmente nublado",
        2: "Nublado",
        3: "Encoberto",
        45: "Nevoeiro",
        48: "Nevoeiro",
        51: "Chuvisco leve",
        61: "Chuva leve",
        63: "Chuva moderada",
        65: "Chuva intensa",
        71: "Neve",
        80: "Pancadas de chuva",
        95: "Trovoadas",
    };
    return map[code] || "Tempo desconhecido";
}

/** Define o tema (dia/noite) */
function definirTemaDiaNoite() {
    const hora = new Date().getHours();
    const body = document.body;
    const isNight = hora >= 18 || hora < 6;
    body.style.background = isNight
        ? "linear-gradient(to bottom, #0f172a, #1e293b)"
        : "linear-gradient(to bottom, #9ddaf7, #d9f0ff)";
}

/** Exibe mensagens (erro ou status) */
function showMessage(text, isError = false) {
    message.textContent = text;
    if (!text) {
        message.classList.add("hidden");
    } else {
        message.classList.remove("hidden");
        message.classList.toggle("error", isError);
    }
}

/**
 * Renderiza a previsão para os próximos 5 dias.
 * Corrigido para alinhar o dia atual (current_weather.time) com daily.time.
 */
function renderForecast(forecast, currentWeatherDate) {
    forecastContainer.innerHTML = "";

    if (!forecast || !forecast.time || !forecast.temperature_2m_max) {
        console.warn("Dados de previsão inválidos:", forecast);
        return;
    }

    // Título
    const titulo = document.createElement("h3");
    titulo.textContent = "Próximos Dias";
    titulo.classList.add("forecast-title");
    forecastContainer.appendChild(titulo);

    // === Alinha o índice com a data real do current_weather ===
    // Exemplo: currentWeatherDate = "2025-11-11T02:00"
    const currentDate = currentWeatherDate.split("T")[0];
    let todayIndex = forecast.time.indexOf(currentDate);

    // Se não encontrar a data exata, assume o índice 0 (segurança)
    if (todayIndex === -1) todayIndex = 0;

    // Começa no próximo dia após o índice atual
    const startIndex = todayIndex + 1;
    const diasParaMostrar = 5;

    for (let i = startIndex; i < startIndex + diasParaMostrar; i++) {
        if (!forecast.time[i]) break;

        const dia = forecast.time[i];
        const tempMax = Math.round(forecast.temperature_2m_max[i]);
        const tempMin = Math.round(forecast.temperature_2m_min[i]);
        const code = forecast.weathercode[i];
        const desc = getWeatherDescription(code);

        const data = new Date(dia);
        const nomeDia = data.toLocaleDateString("pt-BR", { weekday: "long" });
        const dataFormatada = data.toLocaleDateString("pt-BR", {
            day: "numeric",
            month: "long",
        });

        const card = document.createElement("div");
        card.classList.add("forecast-day");
        card.innerHTML = `
            <div class="forecast-info">
                <p class="forecast-day-name">
                    ${nomeDia.charAt(0).toUpperCase() + nomeDia.slice(1)}
                </p>
                <span class="forecast-date">${dataFormatada}</span>
            </div>
            <div class="forecast-icon-temp">
                <i class="wi ${getWeatherIcon(code)}"></i>
                <div class="forecast-desc">${desc}</div>
            </div>
            <div class="forecast-temps">
                <span class="max"><i class="wi wi-direction-up"></i> ${tempMax}°</span>
                <span class="min"><i class="wi wi-direction-down"></i> ${tempMin}°</span>
            </div>
        `;
        forecastContainer.appendChild(card);
    }
}

// === EVENTO PRINCIPAL DE BUSCA ===
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const city = input.value.trim();

    if (!city) return showMessage("Por favor, digite o nome de uma cidade.", true);

    showMessage("Buscando...");
    result.classList.add("hidden");
    forecastContainer.innerHTML = "";

    try {
        // === GEOLOCALIZAÇÃO ===
        const geoResp = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`
        );
        if (!geoResp.ok) throw new Error("Erro na requisição de localização.");

        const geoData = await geoResp.json();
        if (!geoData.results?.length)
            return showMessage("Cidade não encontrada. Tente novamente.", true);

        const { latitude, longitude, name, country } = geoData.results[0];

        // === CLIMA ATUAL + PREVISÃO ===
        const weatherResp = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`
        );
        if (!weatherResp.ok) throw new Error("Erro ao obter dados meteorológicos.");

        const weatherData = await weatherResp.json();
        const weather = weatherData.current_weather;
        const forecast = weatherData.daily;

        if (!weather) return showMessage("Dados meteorológicos indisponíveis.", true);

        // === EXIBIÇÃO ===
        const tempAtual = Math.round(weather.temperature);

        tempEl.innerHTML = `<i class="wi ${getWeatherIcon(weather.weathercode)}"></i> ${tempAtual}°`;


        cityNameEl.textContent = `${name}, ${country}`;
        weatherDescEl.textContent = getWeatherDescription(weather.weathercode);
        dateEl.textContent = formatarDataHora();

        document.body.classList.remove("sunny", "cloudy", "rainy", "night");

        const code = weather.weathercode;
        const hora = new Date().getHours();
        const isNight = hora >= 18 || hora < 6;

        if (isNight) {
            document.body.classList.add("night");
        } else if ([61, 63, 65, 80].includes(code)) {
            document.body.classList.add("rainy");
        } else if ([2, 3].includes(code)) {
            document.body.classList.add("cloudy");
        } else if ([0, 1].includes(code)) {
            document.body.classList.add("sunny");
        }


        // === PREVISÃO (com sincronização) ===
        renderForecast(forecast, weather.time);

        definirTemaDiaNoite();

        // === INTERFACE ===
        title.classList.remove("hidden-elements");
        form.classList.add("hidden-elements");
        message.textContent = "";
        result.classList.remove("hidden");
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        showMessage("Erro ao buscar dados. Verifique sua conexão.", true);
    }
});

// === BOTÃO VOLTAR ===
homeBtn.addEventListener("click", () => {
    result.classList.add("hidden");
    title.classList.remove("hidden-elements");
    form.classList.remove("hidden-elements");
    input.value = "";
    showMessage("");
    forecastContainer.innerHTML = "";
    definirTemaDiaNoite();
});

// === INICIALIZAÇÃO ===
definirTemaDiaNoite();
