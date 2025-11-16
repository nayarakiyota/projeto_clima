const {
    getWeatherIcon,
    getWeatherDescription,
    buscarClimaMock
} = require("../assets/js/weatherService");

// MOCK GLOBAL DO FETCH
const mockFetch = jest.fn();

describe("Testes básicos do aplicativo de clima", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    // CIDADE VÁLIDA
    test("Nome de cidade válido retorna dados meteorológicos", async () => {
        mockFetch
            .mockResolvedValueOnce({
                json: async () => ({
                    results: [{ latitude: -23, longitude: -46 }]
                })
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    current_weather: { temperature: 25, weathercode: 0 }
                })
            });

        const dados = await buscarClimaMock(mockFetch, "São Paulo");

        expect(dados).toMatchObject({
            temperature: 25,
            weathercode: 0,
        });
        expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    // CIDADE INEXISTENTE
    test("Cidade inexistente lança exceção", async () => {
        mockFetch.mockResolvedValueOnce({
            json: async () => ({ results: [] })
        });

        await expect(buscarClimaMock(mockFetch, "Xyz123"))
            .rejects.toThrow("CIDADE_NAO_ENCONTRADA");
    });

    // ENTRADA VAZIA
    test("Entrada vazia retorna erro de validação", async () => {
        await expect(buscarClimaMock(mockFetch, ""))
            .rejects.toThrow("CIDADE_VAZIA");
    });

    // API COM ERRO
    test("Falha da API gera resposta adequada", async () => {
        mockFetch
            .mockResolvedValueOnce({
                json: async () => ({
                    results: [{ latitude: 1, longitude: 1 }]
                })
            })
            .mockResolvedValueOnce({
                ok: false
            });

        await expect(buscarClimaMock(mockFetch, "São Paulo"))
            .rejects.toThrow("API_ERROR");
    });
});

describe("Casos extremos da API", () => {

    // LIMITE DE REQUISIÇÕES EXCEDIDO
    test("API retorna erro de limite excedido", async () => {
        mockFetch
            .mockResolvedValueOnce({
                json: async () => ({
                    results: [{ latitude: 0, longitude: 0 }]
                })
            })
            .mockResolvedValueOnce({
                ok: false,
                status: 429
            });

        await expect(buscarClimaMock(mockFetch, "São Paulo"))
            .rejects.toThrow("API_ERROR");
    });

    // REDE LENTA / TIMEOUT
    test("Conexão lenta causa timeout simulado", async () => {
        mockFetch.mockImplementation(() => new Promise((_, reject) =>
            setTimeout(() => reject(new Error("timeout")), 200)
        ));

        await expect(buscarClimaMock(mockFetch, "São Paulo"))
            .rejects.toThrow();
    });

    // RESPOSTA JSON ALTERADA
    test("Formato inesperado do JSON gera erro", async () => {
        mockFetch
            .mockResolvedValueOnce({
                json: async () => ({}) // ❌ sem results
            });

        await expect(buscarClimaMock(mockFetch, "São Paulo"))
            .rejects.toThrow("CIDADE_NAO_ENCONTRADA");
    });
});
