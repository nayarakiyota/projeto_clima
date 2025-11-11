/**
 * @fileoverview Testes unitários da função buscarClimaPorCidade,
 * responsável por consultar a API Open-Meteo e retornar os dados meteorológicos.
 *
 * Este arquivo utiliza Jest para simular (mockar) as chamadas de rede e validar
 * o comportamento da função em diferentes cenários, incluindo erros e casos extremos.
 */

const { buscarClimaPorCidade } = require("../assets/js/apiFunction.js");

// Simula a função fetch global do navegador
global.fetch = jest.fn();

/**
 * Bloco principal de testes para a função buscarClimaPorCidade.
 */
describe("Função buscarClimaPorCidade", () => {
    // Limpa mocks antes de cada teste para evitar interferência entre casos
    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * @test
     * Verifica se uma cidade válida retorna dados meteorológicos no formato correto.
     */
    test("Cidade válida retorna dados meteorológicos", async () => {
        const mockGeo = { results: [{ latitude: -23.55, longitude: -46.63 }] };
        const mockWeather = { current_weather: { temperature: 25, weathercode: 2 } };

        fetch
            .mockResolvedValueOnce({ ok: true, json: async () => mockGeo })
            .mockResolvedValueOnce({ ok: true, json: async () => mockWeather });

        const resultado = await buscarClimaPorCidade("São Paulo");

        // Verifica se o retorno contém os campos esperados
        expect(resultado).toMatchObject({ temperatura: 25, codigoClima: 2 });
    });

    /**
     * @test
     * Verifica se o erro é tratado corretamente quando a cidade não é encontrada.
     */
    test("Cidade inexistente lança erro tratado", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ results: [] }),
        });

        await expect(buscarClimaPorCidade("Xpto123")).rejects.toThrow(
            "Cidade não encontrada."
        );
    });

    /**
     * @test
     * Verifica se o erro de entrada vazia é tratado corretamente.
     */
    test("Entrada vazia retorna erro de validação", async () => {
        await expect(buscarClimaPorCidade("")).rejects.toThrow(
            "Cidade não informada."
        );
    });

    /**
     * @test
     * Verifica se o erro é tratado corretamente em caso de falha da API de geolocalização.
     */
    test("Falha da API gera resposta adequada", async () => {
        fetch.mockResolvedValueOnce({ ok: false });
        await expect(buscarClimaPorCidade("Paris")).rejects.toThrow(
            "Erro na API de geolocalização"
        );
    });

    /**
     * @test
     * Verifica se o limite de requisições excedido (HTTP 429) é tratado corretamente.
     */
    test("Limite de requisições da API excedido", async () => {
        fetch.mockResolvedValueOnce({ ok: false, status: 429 });
        await expect(buscarClimaPorCidade("Roma")).rejects.toThrow(
            "Erro na API de geolocalização"
        );
    });

    /**
     * @test
     * Verifica o comportamento em caso de formato inesperado no JSON retornado pela API.
     */
    test("Mudança inesperada no formato JSON", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ wrongField: [] }),
        });

        await expect(buscarClimaPorCidade("Tóquio")).rejects.toThrow(
            "Cidade não encontrada."
        );
    });
});

test("Retorna previsão de 5 dias com dados válidos", async () => {
    const mockGeo = { results: [{ latitude: -23.55, longitude: -46.63 }] };
    const mockWeather = {
        current_weather: { temperature: 25, weathercode: 2 },
        daily: {
            time: ["2025-11-02", "2025-11-03", "2025-11-04", "2025-11-05", "2025-11-06", "2025-11-07"],
            temperature_2m_max: [26, 27, 28, 29, 30, 31],
            temperature_2m_min: [18, 17, 19, 20, 18, 17],
            weathercode: [2, 3, 45, 61, 95, 1],
        },
    };

    fetch
        .mockResolvedValueOnce({ ok: true, json: async () => mockGeo })
        .mockResolvedValueOnce({ ok: true, json: async () => mockWeather });

    const resultado = await buscarClimaPorCidade("São Paulo");
    expect(resultado).toHaveProperty("daily");
    expect(resultado.daily.temperature_2m_max).toHaveLength(6);
});


