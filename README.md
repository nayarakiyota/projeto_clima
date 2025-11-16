<p align="center">
  <img src="https://ik.imagekit.io/qiazjnea4/faviconclima.png?updatedAt=1762879649358" 
       alt="Logo Previsão do Tempo" 
       width="250" 
       style="border-radius: 12px;">
</p>

# Projeto Clima —Projeto Web Completo de Previsão do Tempo

## 📘 Descrição
Aplicação que exibe o clima atual e previsão dos próximos dias de qualquer cidade do mundo, utilizando a **API Open-Meteo**.  
O projeto foi desenvolvido em **JavaScript puro**, **HTML** e **CSS**, com foco em **clareza, boas práticas e integração com IA** para otimização do desenvolvimento.

---

## 🧠 Funcionalidades
-  Buscar cidades usando Geocoding
-  Exibir temperatura atual
-  Mostrar condições climáticas
-  Previsão dos próximos 5 dias

- Exibição de ícones meteorológicos (via Weather Icons)
- Interface dinâmica (dia, noite, sol, chuva, nublado)
- Tratamento de erros e mensagens amigáveis ao usuário
- Alternância automática de tema dia/noite
- Testes automatizados com **Jest**
- Documentação via **JSDoc**

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

------

## 🪄 IA no Desenvolvimento

Durante o desenvolvimento, foram utilizados recursos de Inteligência Artificial para:

- Geração inicial de código base
- Revisão de sintaxe e otimização de funções
- Sugestões de docstrings e documentação
- Criação automatizada de testes unitários

  ------

## 🗝️Ética, Segurança & Privacidade

Esta seção documenta práticas adotadas para garantir que o projeto **Projeto Clima** respeite princípios de privacidade, segurança e conformidade de licenças.

### Objetivos
- Garantir que o código e a documentação estejam claros, auditáveis e compatíveis com boas práticas.
- Evitar armazenamento indevido de dados pessoais e minimizar o risco de exposição.
- Garantir que dependências estejam devidamente licenciadas.

###  Privacidade e tratamento de dados
- **Não coletamos dados pessoais sensíveis.** O app consome dados públicos da API Open-Meteo e não armazena nomes, emails ou coordenadas persistentes do usuário.
- **Sem terceiros desconhecidos:** não são enviadas informações para domínios de terceiros além dos serviços explicitamente usados (ex.: `api.open-meteo.com`).

### Segurança na comunicação
- Todas as chamadas à API devem ser feitas via `https`.
- Tratar erros com mensagens genéricas para usuários (logs detalhados somente em ambiente de desenvolvimento).
- Não inserir chaves secretas no front-end. (Open-Meteo não exige key; se usar outro serviço com key, mova a key para backend.)

###  Auditoria de dependências e licenças
- Lista as dependências e verifique compatibilidade de licenças antes de publicar.
- Inclua um arquivo `LICENSE` no repositório e um `NOTICE.md` com atribuições.

### Boas práticas de implementação
- Evite salvar no `localStorage` dados sensíveis; prefira apenas flags de consentimento.
- Não faça `console.log` de respostas de APIs em produção.
- Valide e sanitize entradas do usuário (campo de busca) antes de enviar requisições.

------

## 🧑‍💻 Autora

**Nayara Kiyota**
 Bootcamp Generation Brasil 2025
 💻 Aplicação desenvolvida com apoio de IA para fins educacionais.