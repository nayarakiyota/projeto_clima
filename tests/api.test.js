const { buscarClimaPorCidade } = require("../assets/js/apiFunction.js");

// Simula (mock) a função fetch
global.fetch = jest.fn();

describe("Função buscarClimaPorCidade", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Cidade válida retorna dados meteorológicos", async () => {
        const mockGeo = {
            results: [{ latitude: -23.55, longitude: -46.63 }],
        };
        const mockWeather = {
            current_weather: { temperature: 25, weathercode: 2 },
        };

        fetch
            .mockResolvedValueOnce({ ok: true, json: async () => mockGeo })
            .mockResolvedValueOnce({ ok: true, json: async () => mockWeather });

        const resultado = await buscarClimaPorCidade("São Paulo");
        expect(resultado).toEqual({ temperatura: 25, codigoClima: 2 });
    });

    test("Cidade inexistente lança erro tratado", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ results: [] }),
        });

        await expect(buscarClimaPorCidade("Xpto123")).rejects.toThrow(
            "Cidade não encontrada."
        );
    });

    test("Entrada vazia retorna erro de validação", async () => {
        await expect(buscarClimaPorCidade("")).rejects.toThrow(
            "Cidade não informada."
        );
    });

    test("Falha da API gera resposta adequada", async () => {
        fetch.mockResolvedValueOnce({ ok: false });
        await expect(buscarClimaPorCidade("Paris")).rejects.toThrow(
            "Erro na API de geolocalização"
        );
    });
});

test("Limite de requisições da API excedido", async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 429 });
    await expect(buscarClimaPorCidade("Roma")).rejects.toThrow(
        "Erro na API de geolocalização"
    );
});

test("Mudança inesperada no formato JSON", async () => {
    fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ wrongField: [] }),
    });
    await expect(buscarClimaPorCidade("Tóquio")).rejects.toThrow(
        "Cidade não encontrada."
    );
});

