/**
 * @fileoverview Script responsável por buscar e exibir informações meteorológicas
 * utilizando a API Open-Meteo, com base na cidade informada pelo usuário.
 *
 * Este módulo manipula o DOM, trata exceções, alterna temas (dia/noite) e exibe
 * mensagens amigáveis. É parte integrante do aplicativo de clima.
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

weatherDescEl.id = "weather-description";
dateEl.id = "weather-date";

cityNameEl.insertAdjacentElement("afterend", weatherDescEl);
weatherDescEl.insertAdjacentElement("afterend", dateEl);

// === FUNÇÕES AUXILIARES ===

/**
 * Retorna a data atual formatada em português.
 * @returns {string} Data formatada no estilo "segunda-feira, 10 de novembro de 2025".
 */
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

/**
 * Retorna o nome do ícone de clima com base no código fornecido pela API Open-Meteo.
 * @param {number} code - Código do clima retornado pela API.
 * @returns {string} Nome da classe de ícone (ex: "wi-day-cloudy").
 */
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

/**
 * Retorna a descrição textual correspondente ao código meteorológico.
 * @param {number} code - Código do clima retornado pela API.
 * @returns {string} Descrição legível do clima.
 */
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

/**
 * Alterna o tema visual (modo dia/noite) de acordo com o horário local.
 * @example definirTemaDiaNoite();
 */
function definirTemaDiaNoite() {
    const hora = new Date().getHours();
    const body = document.body;
    const isNight = hora >= 18 || hora < 6;
    body.style.background = isNight
        ? "linear-gradient(to bottom, #0f172a, #1e293b)"
        : "linear-gradient(to bottom, #9ddaf7, #d9f0ff)";
}

/**
 * Exibe mensagens para o usuário, incluindo erros e status.
 * @param {string} text - Texto da mensagem a ser exibida.
 * @param {boolean} [isError=false] - Define se a mensagem é de erro.
 * @example showMessage("Cidade não encontrada.", true);
 */
function showMessage(text, isError = false) {
    message.textContent = text;
    if (!text) {
        message.classList.add("hidden");
    } else {
        message.classList.remove("hidden");
        message.classList.toggle("error", isError);
    }
}

// === FUNÇÃO PRINCIPAL ===

/**
 * Lida com o evento de envio do formulário de pesquisa e busca os dados meteorológicos.
 * Inclui tratamento de exceções, feedback visual e alternância de telas.
 *
 * @async
 * @function handleCitySearch
 * @param {SubmitEvent} e - Evento de envio do formulário.
 * @throws {Error} Quando ocorre falha na API ou a cidade não é encontrada.
 */
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const city = input.value.trim();

    if (!city) return showMessage("Por favor, digite o nome de uma cidade.", true);

    showMessage("Buscando...");
    result.classList.add("hidden");

    try {
        // === GEOLOCALIZAÇÃO ===
        const geoResp = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
                city
            )}&count=1&language=pt&format=json`
        );

        if (!geoResp.ok) throw new Error("Erro na requisição de localização.");

        const geoData = await geoResp.json();
        if (!geoData.results?.length)
            return showMessage("Cidade não encontrada. Tente novamente.", true);

        const { latitude, longitude, name, country } = geoData.results[0];

        // === CLIMA ATUAL ===
        const weatherResp = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );

        if (!weatherResp.ok) throw new Error("Erro ao obter dados meteorológicos.");

        const weatherData = await weatherResp.json();
        const weather = weatherData.current_weather;

        if (!weather)
            return showMessage("Dados meteorológicos indisponíveis.", true);

        // === EXIBIÇÃO ===
        tempEl.innerHTML = `<i class="wi ${getWeatherIcon(
            weather.weathercode
        )}"></i> ${Math.round(weather.temperature)}°`;
        cityNameEl.textContent = `${name}, ${country}`;
        weatherDescEl.textContent = getWeatherDescription(weather.weathercode);
        dateEl.textContent = formatarDataHora();

        definirTemaDiaNoite();

        // === INTERFACE ===
        title.classList.add("hidden-elements");
        form.classList.add("hidden-elements");
        message.textContent = "";
        result.classList.remove("hidden");
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        showMessage("Erro ao buscar dados. Verifique sua conexão.", true);
    }
});

// === BOTÃO VOLTAR ===

/**
 * Retorna à tela inicial do aplicativo, limpando os dados e restaurando o tema.
 * @function handleHomeButton
 */
homeBtn.addEventListener("click", () => {
    result.classList.add("hidden");
    title.classList.remove("hidden-elements");
    form.classList.remove("hidden-elements");
    input.value = "";
    showMessage("");
    definirTemaDiaNoite();
});

// === INICIALIZAÇÃO ===
definirTemaDiaNoite();
