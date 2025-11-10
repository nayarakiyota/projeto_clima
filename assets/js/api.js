const form = document.getElementById("search-form");
const input = document.getElementById("city-input");
const result = document.getElementById("result");
const message = document.getElementById("message");
const tempEl = document.getElementById("temperature");
const cityNameEl = document.getElementById("city-name");
const homeBtn = document.getElementById("home-btn");
const title = document.getElementById("title");

// Buscar dados
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const city = input.value.trim();
    if (!city) return showMessage("Por favor, digite o nome de uma cidade.", true);

    showMessage("Buscando...");
    result.classList.add("hidden");

    try {
        const geoResp = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`
        );
        const geoData = await geoResp.json();

        if (!geoData.results || geoData.results.length === 0) {
            showMessage("Cidade não encontrada. Tente novamente.", true);
            return;
        }

        const place = geoData.results[0];
        const lat = place.latitude;
        const lon = place.longitude;

        const weatherResp = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`
        );
        const weatherData = await weatherResp.json();

        const temp = weatherData.current_weather?.temperature ?? null;
        if (temp === null) {
            showMessage("Dados do clima indisponíveis.", true);
            return;
        }

        tempEl.textContent = `${Math.round(temp)}°`;
        cityNameEl.textContent = `${place.name}, ${place.country}`;

        // Esconder menu inicial
        title.classList.add("hidden-elements");
        form.classList.add("hidden-elements");
        message.textContent = "";

        // Mostrar resultado
        result.classList.remove("hidden");
    } catch {
        showMessage("Erro ao buscar os dados. Tente novamente.", true);
    }
});

// Voltar ao menu inicial
homeBtn.addEventListener("click", () => {
    result.classList.add("hidden");
    title.classList.remove("hidden-elements");
    form.classList.remove("hidden-elements");
    input.value = "";
});

function showMessage(text, isError = false) {
    message.textContent = text;
    if (text === "") {
        message.classList.add("hidden");
    } else {
        message.classList.remove("hidden");
        message.classList.toggle("error", isError);
    }
}

