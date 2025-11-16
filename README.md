<p align="center">
  <img src="https://ik.imagekit.io/qiazjnea4/Gemini_Generated_Image_ej1fsgej1fsgej1f.png" 
       alt="Logo Previsão do Tempo" 
       width="500" 
       style="border-radius: 12px;">
</p>


# Projeto Web Completo de Previsão do Tempo

## 📘 Descrição
Aplicação que exibe o clima atual e previsão dos próximos dias de qualquer cidade do mundo, utilizando a **API Open-Meteo**.  
O projeto foi desenvolvido em **JavaScript puro**, **HTML** e **CSS**, com foco em **clareza, boas práticas e integração com IA** para otimização do desenvolvimento.

---

## ✨ Funcionalidades

  🔍 Busca de cidades via **Geocoding API**

  🌡️ Exibe temperatura atual

  📝 Descrição detalhada do clima

  📅 Previsão de **5 dias**

  🌦️ Ícones personalizados (Weather Icons)

  🌓 Tema **dinâmico** (dia/noite)

  ⚠️ Tratamento de erros da API e entradas inválidas

  🧪 Testes automatizados com **Jest**

  📘 Documentação gerada com **JSDoc**

---

## 🧩 Tecnologias Utilizadas
- **HTML5**  
- **CSS3**  
- **JavaScript**  
- **Jest** para testes unitários  
- **JSDoc** para documentação  
- **Open-Meteo API** para dados meteorológicos  

---

## ⚙️ Instalação
```bash
git clone https://github.com/seuusuario/projeto_clima.git
cd projeto_clima
npm install
npm test
```

------

## 🧪 Testes Automatizados

Os testes foram criados utilizando o **Jest**, com cobertura dos seguintes cenários:

1. Cidade válida retorna dados meteorológicos.
2. Cidade inexistente lança exceção tratada.
3. Entrada vazia retorna erro de validação.
4. Falha da API gera resposta adequada.
5. Casos extremos (limite de requisições, JSON inválido).

Execute os testes com:

```
npm test
```

------

## 🧭 Estrutura do Projeto

```
📦 projeto-clima
 ┣ 📂 assets
 ┃ ┣ 📂 css
 ┃ ┃ ┗ 📜 styles.css
 ┃ ┣ 📂 js
 ┃ ┃ ┣ 📜 api.js
 ┃ ┃ ┗ 📜 weatherService.js  (para testes)
 ┃ ┗ 📂 images
 ┣ 📂 tests
 ┃ ┗ 📜 api.test.js
 ┣ 📜 index.html
 ┣ 📜 LICENSE
 ┣ 📜 NOTICE.md
 ┣ 📜 README.md
 ┗ 📜 package.json
```



------

## 🪄 IA no Desenvolvimento

Durante o desenvolvimento, foram utilizados recursos de Inteligência Artificial para:

✨ Revisão e melhoria de código

🔍 Depuração assistida

🧪 Geração de testes automatizados

📘 Documentação via JSDoc

🛡️ Auditoria de segurança e privacidade

⚖️ Análise de licenciamento

------

## 🗝️Ética, Segurança & Privacidade

- O projeto segue boas práticas de segurança:

  ### **Tratamento de dados**

  - Nenhum dado pessoal é coletado ou armazenado
  - Apenas dados **públicos**, fornecidos pela API Open-Meteo
  - Nenhum dado é enviado para serviços externos além da API de clima

  ### **Comunicação**

  - Requisições realizadas via HTTPS
  - Tratamento de erros, timeouts e respostas inesperadas

  ### **Licenciamento**

  - Dependências verificadas e documentadas
  - Arquivos `LICENSE` e `NOTICE.md` incluídos conforme boas práticas

------

## 🧑‍💻 Autora

**Nayara Kiyota** 

Bootcamp Generation Brasil 2025

💻 Aplicação desenvolvida com apoio de IA para fins educacionais.

<p align="center">   Feito com ☀️🌧️ e muito café 💙 </p> 
