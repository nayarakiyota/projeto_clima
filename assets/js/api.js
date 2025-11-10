// Seletores do DOM
const form = document.getElementById("search-form");
const input = document.getElementById("city-input");
const result = document.getElementById("result");
const message = document.getElementById("message");
const tempEl = document.getElementById("temperature");
const cityNameEl = document.getElementById("city-name");
const homeBtn = document.getElementById("home-btn");
const title = document.getElementById("title");

// Descrição, ícone e data
let weatherDescEl = document.createElement("p");
weatherDescEl.id = "weather-description";
weatherDescEl.style.margin = "6px 0";
weatherDescEl.style.fontSize = "0.95rem";
weatherDescEl.style.color = "#475569";

let dateEl = document.createElement("p");
dateEl.id = "weather-date";
dateEl.style.fontSize = "0.85rem";
dateEl.style.color = "#64748b";

cityNameEl.insertAdjacentElement("afterend", weatherDescEl);
weatherDescEl.insertAdjacentElement("afterend", dateEl);

// === FUNÇÕES AUXILIARES ===

// Formatar data e hora em formato longo (ex: segunda-feira, 13 de outubro de 2025)
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

// Determinar ícone de acordo com código de clima do Open-Meteo
function getWeatherIcon(code) {
    const map = {
        0: "wi-day-sunny", // claro
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

// Determinar descrição textual do clima
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

// Alternar modo dia/noite
function definirTemaDiaNoite() {
    const hora = new Date().getHours();
    const body = document.body;
    if (hora >= 18 || hora < 6) {
        // noite
        body.style.background = "linear-gradient(to bottom, #0f172a, #1e293b)";
    } else {
        // dia
        body.style.background = "linear-gradient(to bottom, #9ddaf7, #d9f0ff)";
    }
}

// === REQUISIÇÃO PRINCIPAL ===
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const city = input.value.trim();
    if (!city) return showMessage("Por favor, digite o nome de uma cidade.", true);

    showMessage("Buscando...");
    result.classList.add("hidden");

    try {
        // Obter latitude e longitude
        const geoResp = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`
        );
        if (!geoResp.ok) throw new Error("Erro na requisição de localização");

        const geoData = await geoResp.json();
        if (!geoData.results || geoData.results.length === 0) {
            showMessage("Cidade não encontrada. Tente novamente.", true);
            return;
        }

        const place = geoData.results[0];
        const lat = place.latitude;
        const lon = place.longitude;

        // Buscar clima atual
        const weatherResp = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        if (!weatherResp.ok) throw new Error("Erro ao obter clima");

        const weatherData = await weatherResp.json();
        const weather = weatherData.current_weather;

        if (!weather) {
            showMessage("Dados meteorológicos indisponíveis.", true);
            return;
        }

        // Exibir dados
        tempEl.innerHTML = `<i class="wi ${getWeatherIcon(weather.weathercode)}"></i> ${Math.round(weather.temperature)}°`;
        cityNameEl.textContent = `${place.name}, ${place.country}`;
        weatherDescEl.textContent = getWeatherDescription(weather.weathercode);
        dateEl.textContent = formatarDataHora();

        // Trocar tema conforme horário
        definirTemaDiaNoite();

        // Alternar telas
        title.classList.add("hidden-elements");
        form.classList.add("hidden-elements");
        message.textContent = "";
        result.classList.remove("hidden");
    } catch (error) {
        console.error(error);
        showMessage("Erro ao buscar dados. Verifique sua conexão.", true);
    }
});

// Botão para voltar à tela inicial
homeBtn.addEventListener("click", () => {
    result.classList.add("hidden");
    title.classList.remove("hidden-elements");
    form.classList.remove("hidden-elements");
    input.value = "";
    showMessage("");
    definirTemaDiaNoite();
});

// === FUNÇÃO DE MENSAGENS ===
function showMessage(text, isError = false) {
    message.textContent = text;
    if (text === "") {
        message.classList.add("hidden");
    } else {
        message.classList.remove("hidden");
        message.classList.toggle("error", isError);
    }
}

// Aplicar tema ao carregar
definirTemaDiaNoite();
