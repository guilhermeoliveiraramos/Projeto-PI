# 🚀 Projeto Integrador (PI) — Monitoramento de Produção Industrial

[![CI - Build e Validação](https://github.com)](https://github.com)

## 📚 Sobre o Projeto
O **Projeto Integrador (PI)** reúne desenvolvimento web, back-end, Ciência de Dados, banco de dados relacional e infraestrutura em nuvem em uma plataforma para monitoramento e análise de indicadores industriais de produção e vulcanização de pneus.

🌐 **Acesse a aplicação online (AWS S3):** [http://amazonaws.com](http://amazonaws.com)

> ⚠️ **Observação sobre disponibilidade:** Este projeto utiliza uma conta de estudante (**AWS Academy**). Por isso, os serviços **Amazon EC2** (back-end) e **Amazon RDS** (banco de dados) não permanecem ligados 24 horas por dia, ficando ativos apenas durante os períodos de testes e apresentações do laboratório.

---

## 🎯 Objetivos
* Aplicar conceitos de engenharia de software e arquitetura em nuvem em uma solução prática.
* Tratar e processar datasets industriais para geração de indicadores e dashboards.
* Desenvolver uma API REST segura conectada a um banco de dados relacional.
* Automatizar validações de build (CI) e preparar a aplicação para execução via contêineres (**Docker**).

---

## 🏗 Arquitetura da Aplicação
A solução utiliza uma arquitetura desacoplada hospedada na **Amazon Web Services (AWS)**:

* **Front-end (Amazon S3):** Hospedagem estática da interface web, gráficos e filtros interativos.
* **Back-end (Amazon EC2 / Docker):** API REST desenvolvida em **Java 17 com Spring Boot** (`apiusuarios`), containerizada via Docker.
* **Banco de Dados (Amazon RDS):** Instância **MySQL** (`projetopi`) contendo as tabelas relacionais (`usuario`, `pneus`, `arquivos`, `ciclos` e `medicoes`).

```text
[ Usuário ] ──► [ Front-end (Amazon S3) ] ──HTTP/REST──► [ Back-end Spring Boot (EC2 / Docker) ] ──JDBC──► [ MySQL (Amazon RDS) ]
```

---

## 💻 Tecnologias Utilizadas

| Tecnologia / Serviço | Aplicação no Projeto |
| :--- | :--- |
| **Java 17 & Spring Boot** | Desenvolvimento da API REST, regras de negócio e integração JPA/Hibernate |
| **HTML, CSS & JavaScript** | Interface web, visualização de dados e consumo da API |
| **MySQL & Amazon RDS** | Armazenamento relacional estruturado em nuvem |
| **Amazon S3 & Amazon EC2** | Hospedagem do front-end e servidor de aplicação do back-end |
| **Docker** | Containerização do back-end com *multi-stage build* e isolamento de ambiente |
| **Git & GitHub Actions** | Controle de versão e pipeline de Integração Contínua (CI) |

---

## 📂 Estrutura do Repositório

```text
Projeto-PI/
├── .github/workflows/       # Pipeline de automação de build (CI)
├── Frontend/                # Código-fonte da interface web
├── backend/                 # Código-fonte da API Java / Spring Boot
│   ├── src/                 # Controllers, Models, Repositories e Configurações
│   ├── .dockerignore        # Arquivos ignorados no build da imagem Docker
│   ├── .env.example         # Modelo de variáveis de ambiente (sem credenciais)
│   ├── Dockerfile           # Receita multi-stage para containerização da API
│   └── pom.xml              # Dependências Maven
├── docs/                    # Documentação técnica e modelagem de dados
│   ├── der-banco.png        # Diagrama Entidade-Relacionamento (DER)
│   ├── dicionario-de-dados.md # Detalhamento das tabelas, colunas e tipos
│   └── schema.sql           # Script SQL de criação das tabelas
└── README.md                # Documentação geral do projeto
```

* 📐 **[Acesse aqui o Dicionário de Dados e o Diagrama (DER)](./docs/dicionario-de-dados.md)**
* 🗄️ **[Acesse aqui o Script SQL do Banco (`schema.sql`)](./docs/schema.sql)**

---

## ⚙️ Como Executar o Projeto Localmente

### 1. Configurar o Banco de Dados
Execute o script `./docs/schema.sql` em uma instância **MySQL** local ou em nuvem para criar a base `projetopi` e suas tabelas.

### 2. Configurar as Variáveis de Ambiente
Dentro da pasta `backend/`, copie o arquivo `.env.example` para um novo arquivo chamado `.env` e preencha com as credenciais do seu banco:

```env
DB_URL=jdbc:mysql://localhost:3306/projetopi?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USER=root
DB_PASS=sua_senha_aqui
SERVER_PORT=8080
```

### 3. Rodar o Back-end (via Maven ou Docker)

**Opção A — Via Maven:**
```bash
cd backend
./mvnw spring-boot:run
```

**Opção B — Via Docker:**
```bash
cd backend
docker build -t projetopi-backend .
docker run -d --name api-projetopi --env-file .env -p 8080:8080 projetopi-backend
```
A API estará disponível em `http://localhost:8080`.

### 4. Rodar o Front-end
Abra a pasta `Frontend/` e inicie o arquivo `index.html` no navegador (ou utilize a extensão *Live Server* no VS Code).

---

## 👥 Equipe e Responsabilidades

* **Guilherme Oliveira:** Desenvolvimento Full Stack, Integração, Infraestrutura AWS (S3, EC2, RDS), Docker e CI/CD.
* **Breno Silva:** Desenvolvimento Front-end, construção de dashboards e apoio na experiência do usuário.
* **Pedro Vasconcelos:** Ciência de Dados, limpeza, tratamento e análise dos indicadores industriais.
* **Fabiano Silva:** Levantamento de requisitos, regras de negócio e definição de escopo.
* **Guilherme Fonseca:** Modelagem de Banco de Dados (DER), estruturação relacional e organização no RDS.

---

*Desenvolvido como parte das atividades acadêmicas do **Projeto Integrador (PI)**.*
