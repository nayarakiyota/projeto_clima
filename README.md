# 🌤️ Projeto Clima — Aplicativo de Previsão do Tempo

## 📘 Descrição
Aplicação simples e responsiva que exibe a previsão do tempo atual de qualquer cidade do mundo, utilizando a **API Open-Meteo**.  
O projeto foi desenvolvido em **JavaScript puro**, **HTML** e **CSS**, com foco em **clareza, boas práticas e integração com IA** para otimização do desenvolvimento.

---

## 🧠 Funcionalidades
- Consulta de cidade com retorno de temperatura e descrição do clima
- Exibição de ícones meteorológicos (via Weather Icons)
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

projeto_clima/
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── api.js
│   │   └── apiFunction.js
├── tests/
│   └── api.test.js
├── index.html
└── README.md

------

## 🪄 IA no Desenvolvimento

Durante o desenvolvimento, foram utilizados recursos de Inteligência Artificial para:

- Geração inicial de código base
- Revisão de sintaxe e otimização de funções
- Sugestões de docstrings e documentação
- Criação automatizada de testes unitários

------

## 🧑‍💻 Autora

**Nayara Kiyota**
 Bootcamp Generation Brasil — PwC 2025
 💻 Aplicação desenvolvida com apoio de IA para fins educacionais.