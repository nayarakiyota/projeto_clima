/**
 * @fileoverview Sistema de Previsão do Tempo.
 * @description 
 * Gerencia a busca, tratamento e exibição de dados climáticos utilizando
 * as APIs Open-Meteo (Geocoding + Forecast). Controla sanitização da entrada,
 * troca de temas, renderização de clima atual e previsão dos próximos dias.
 *
 * Interface e estilização originais foram preservadas, apenas reorganizadas
 * conforme boas práticas de clean code.
 *
 * @author 
 *   Nayara Kiyota
 */

// ============================================================================
//  SELEÇÃO DE ELEMENTOS DO DOM
// ============================================================================
const form = document.getElementById("search-form");
const input = document.getElementById("city-input");
const result = document.getElementById("result");
const message = document.getElementById("message");
const tempEl = document.getElementById("temperature");
const cityNameEl = document.getElementById("city-name");
const homeBtn = document.getElementById("home-btn");
const title = document.getElementById("title");

// Elementos criados dinamicamente
const weatherDescEl = document.createElement("p");
const dateEl = document.createElement("p");
const forecastContainer = document.createElement("div");

weatherDescEl.id = "weather-description";
dateEl.id = "weather-date";
forecastContainer.id = "forecast-container";
forecastContainer.classList.add("forecast");

// Inserção na interface
cityNameEl.insertAdjacentElement("afterend", weatherDescEl);
weatherDescEl.insertAdjacentElement("afterend", dateEl);
dateEl.insertAdjacentElement("afterend", forecastContainer);


// ============================================================================
//  FUNÇÕES UTILITÁRIAS
// ============================================================================

/**
 * Formata a data atual para o padrão pt-BR com nome do dia da semana.
 *
 * @function formatarDataHora
 * @returns {string} Data completa formatada.
 *
 * @example
 * formatarDataHora();
 * // "segunda-feira, 18 de novembro de 2024"
 */
function formatarDataHora() {
    return new Date().toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

/**
 * Retorna a classe CSS referente ao ícone da biblioteca Weather Icons
 * conforme o código meteorológico da Open-Meteo.
 *
 * @function getWeatherIcon
 * @param {number} code - Código numérico do clima.
 * @returns {string} Classe do ícone.
 *
 * @example
 * getWeatherIcon(0); // "wi-day-sunny"
 */
function getWeatherIcon(code) {
    const icons = {
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
    return icons[code] || "wi-na";
}

/**
 * Converte o código meteorológico em uma descrição textual amigável.
 *
 * @function getWeatherDescription
 * @param {number} code - Código do clima.
 * @returns {string} Descrição do clima.
 *
 * @example
 * getWeatherDescription(3); 
 * // "Encoberto"
 */
function getWeatherDescription(code) {
    const descriptions = {
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
    return descriptions[code] || "Tempo desconhecido";
}

/**
 * Aplica tema visual dinâmico (dia ou noite) com base no horário local.
 * AGORA TAMBÉM GERENCIA AS CLASSES CSS CORRETAMENTE.
 *
 * @function definirTemaDiaNoite
 * @returns {void}
 *
 * @example
 * definirTemaDiaNoite();
 */
function definirTemaDiaNoite() {
    const hora = new Date().getHours();
    const body = document.body;

    const isNight = hora >= 18 || hora < 6;

    if (isNight) {
        // Adiciona a classe 'night' e remove a 'day'
        body.classList.add("night");
        body.classList.remove("day");
        body.style.background = "linear-gradient(to bottom, #0f172a, #1e293b)";
    } else {
        // Adiciona a classe 'day' e remove a 'night'
        body.classList.add("day");
        body.classList.remove("night");
        body.style.background = "linear-gradient(to bottom, #9ddaf7, #d9f0ff)";
    }
}

/**
 * Exibe mensagens informativas ou de erro para o usuário.
 *
 * @function showMessage
 * @param {string} text - Texto exibido.
 * @param {boolean} [isError=false] - Define se é mensagem de erro.
 * @returns {void}
 *
 * @example
 * showMessage("Buscando...");
 */
function showMessage(text, isError = false) {
    message.textContent = text;

    if (!text) {
        message.classList.add("hidden");
        return;
    }

    message.classList.remove("hidden");
    message.classList.toggle("error", isError);
}

/**
 * Sanitiza texto para evitar ataques XSS removendo caracteres perigosos.
 *
 * @function sanitizarTexto
 * @param {string} texto - Texto fornecido pelo usuário.
 * @returns {string} Texto sanitizado e seguro.
 *
 * @throws {TypeError} Se o texto não for string.
 *
 * @example
 * sanitizarTexto("<script>alert(1)</script>");
 * // "alert1"
 */
function sanitizarTexto(texto) {
    if (!texto || typeof texto !== "string") return "";

    return texto
        .replace(/[<>"'`]/g, "")
        .replace(/[{}()[\]\\;]/g, "")
        .trim();
}


// ============================================================================
//  PREVISÃO DOS PRÓXIMOS 5 DIAS
// ============================================================================

/**
 * Renderiza dinamicamente a previsão dos próximos 5 dias após a data atual.
 *
 * @function renderForecast
 * @param {Object} forecast - Objeto "daily" retornado pela API Open-Meteo.
 * @param {string} currentWeatherDate - Data atual em formato ISO.
 * @returns {void}
 *
 * @example
 * renderForecast(api.daily, api.current_weather.time);
 */
function renderForecast(forecast, currentWeatherDate) {
    forecastContainer.innerHTML = "";

    if (!forecast?.time) return;

    const titulo = document.createElement("h3");
    titulo.textContent = "Próximos Dias";
    titulo.classList.add("forecast-title");
    forecastContainer.appendChild(titulo);

    const currentDate = currentWeatherDate.split("T")[0];
    let todayIndex = forecast.time.indexOf(currentDate);
    if (todayIndex === -1) todayIndex = 0;

    const startIndex = todayIndex + 1;
    const total = 5;

    for (let i = startIndex; i < startIndex + total; i++) {
        if (!forecast.time[i]) break;

        const dataISO = forecast.time[i];
        const tempMax = Math.round(forecast.temperature_2m_max[i]);
        const tempMin = Math.round(forecast.temperature_2m_min[i]);
        const code = forecast.weathercode[i];
        const desc = getWeatherDescription(code);

        const data = new Date(dataISO);
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
                <span class="max">
                    <i class="wi wi-direction-up"></i> ${tempMax}°
                </span>
                <span class="min">
                    <i class="wi wi-direction-down"></i> ${tempMin}°
                </span>
            </div>
        `;

        forecastContainer.appendChild(card);
    }
}


// ============================================================================
//  BUSCA PRINCIPAL — EVENTO DO FORMULÁRIO
// ============================================================================

/**
 * Evento principal de busca do clima.
 * Sanitiza entrada, consulta a API de geolocalização, consulta dados
 * meteorológicos, aplica o tema visual e renderiza os resultados.
 *
 * @event form#submit
 * @async
 * @param {SubmitEvent} e - Evento de envio.
 *
 * @throws {Error} Se APIs retornarem erro ou estiverem indisponíveis.
 *
 * @example
 * form.dispatchEvent(new Event("submit"));
 */
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const city = sanitizarTexto(input.value.trim());
    if (!city) return showMessage("Por favor, digite o nome de uma cidade.", true);

    showMessage("Buscando...");
    result.classList.add("hidden");
    forecastContainer.innerHTML = "";

    try {
        // ---------------- GEOLOCALIZAÇÃO ----------------
        const geoResp = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
                city
            )}&count=1&language=pt&format=json`
        );

        if (!geoResp.ok) throw new Error("Erro ao buscar localização.");

        const geoData = await geoResp.json();
        if (!geoData.results?.length)
            return showMessage("Cidade não encontrada. Tente novamente.", true);

        const { latitude, longitude, name, country } = geoData.results[0];

        // ---------------- CLIMA + PREVISÃO ----------------
        const weatherResp = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`
        );

        if (!weatherResp.ok) throw new Error("Erro ao obter dados meteorológicos.");

        const weatherData = await weatherResp.json();
        const weather = weatherData.current_weather;
        const forecast = weatherData.daily;

        if (!weather) return showMessage("Dados indisponíveis.", true);

        // ---------------- EXIBIÇÃO ----------------
        const tempAtual = Math.round(weather.temperature);
        tempEl.innerHTML = `<i class="wi ${getWeatherIcon(weather.weathercode)}"></i> ${tempAtual}°`;

        cityNameEl.textContent = `${name}, ${country}`;
        weatherDescEl.textContent = getWeatherDescription(weather.weathercode);
        dateEl.textContent = formatarDataHora();

        // ---------------- TEMA DINÂMICO ----------------
        document.body.classList.remove("sunny", "cloudy", "rainy", "night");

        const hora = new Date().getHours();
        const isNight = hora >= 18 || hora < 6;
        const code = weather.weathercode;

        if (isNight) {
            document.body.classList.add("night");
        } else if ([61, 63, 65, 80].includes(code)) {
            document.body.classList.add("rainy");
        } else if ([2, 3].includes(code)) {
            document.body.classList.add("cloudy");
        } else if ([0, 1].includes(code)) {
            document.body.classList.add("sunny");
        }

        // ---------------- PREVISÃO ----------------
        renderForecast(forecast, weather.time);

        definirTemaDiaNoite();

        // ---------------- INTERFACE ----------------
        title.classList.remove("hidden-elements");
        form.classList.add("hidden-elements");
        message.textContent = "";
        result.classList.remove("hidden");

    } catch (error) {
        console.error(error);
        showMessage("Erro ao buscar dados. Verifique sua conexão.", true);
    }
});


// ============================================================================
//  BOTÃO "VOLTAR"
// ============================================================================

/**
 * Evento responsável por restaurar a tela inicial,
 * limpar dados e reativar o tema adequado.
 *
 * @event homeBtn#click
 * @returns {void}
 *
 * @example
 * homeBtn.click();
 */
homeBtn.addEventListener("click", () => {
    result.classList.add("hidden");
    title.classList.remove("hidden-elements");
    form.classList.remove("hidden-elements");

    document.body.classList.remove("sunny", "cloudy", "rainy", "night");

    input.value = "";
    forecastContainer.innerHTML = "";
    showMessage("");
    definirTemaDiaNoite();
});


// ============================================================================
//  INICIALIZAÇÃO AUTOMÁTICA
// ============================================================================

/**
 * Inicializa o tema visual assim que o script é carregado.
 *
 * @example
 * definirTemaDiaNoite();
 */
definirTemaDiaNoite();




// ============================================================================
//  EXPORTS PARA TESTES (NÃO afeta o navegador)
// ============================================================================

if (typeof module !== "undefined") {
    module.exports = {
        getWeatherDescription,
        getWeatherIcon,
        sanitizarTexto,
        formatarDataHora,
    };
}