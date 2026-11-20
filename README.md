# 🚀 Projeto Integrador (PI) — Monitoramento de Produção Industrial

## 📚 Sobre o Projeto
O **Projeto Integrador (PI)** reúne desenvolvimento web, back-end, Ciência de Dados, banco de dados relacional e infraestrutura em nuvem em uma plataforma para monitoramento e análise de indicadores industriais de produção e vulcanização de pneus.

🌐 **Acesse a aplicação online (AWS S3):** [http://pifront.s3-website-us-east-1.amazonaws.com](http://pifront.s3-website-us-east-1.amazonaws.com)

> ⚠️ **Observação sobre disponibilidade:** Este projeto utiliza uma conta de estudante (**AWS Academy**). Por isso, os serviços **Amazon EC2** (back-end) e **Amazon RDS** (banco de dados) não permanecem ligados 24 horas por dia, ficando ativos apenas durante os períodos de testes e apresentações do laboratório.

---

## 🎯 Objetivos
* Aplicar conceitos de engenharia de software e arquitetura em nuvem em uma solução prática.
* Tratar e processar datasets industriais para geração de indicadores e dashboards.
* Desenvolver uma API REST segura conectada a um banco de dados relacional.
* Automatizar validações de build (CI) e orquestrar toda a aplicação em contêineres (**Docker & Docker Compose**).

---

## 🏗 Arquitetura da Aplicação
A solução utiliza uma arquitetura desacoplada hospedada na **Amazon Web Services (AWS)** e totalmente conteinerizada para desenvolvimento e deploy:

* **Front-end (Amazon S3 / Docker + Nginx):** Interface web desenvolvida em **React (Vite)**, servida estaticamente no S3 ou via Nginx em contêiner.
* **Back-end (Amazon EC2 / Docker):** API REST desenvolvida em **Java 17 com Spring Boot** (`apiusuarios`), containerizada via Docker.
* **Banco de Dados (Amazon RDS / MySQL 8.0):** Instância **MySQL** (`projetopi`) contendo as tabelas relacionais (`usuario`, `pneus`, `arquivos`, `ciclos` e `medicoes`).

```text
[ Usuário ] ──► [ Front-end (S3 / Nginx) ] ──HTTP/REST──► [ Back-end Spring Boot (EC2 / Docker) ] ──JDBC──► [ MySQL (RDS / Docker) ]
```

---

## 💻 Tecnologias Utilizadas

| Tecnologia / Serviço | Aplicação no Projeto |
| :--- | :--- |
| **Java 17 & Spring Boot** | Desenvolvimento da API REST, regras de negócio e integração JPA/Hibernate |
| **React (Vite) & JavaScript** | Interface web, visualização de dados e consumo da API |
| **MySQL 8.0 & Amazon RDS** | Armazenamento relacional estruturado em nuvem e em contêiner |
| **Amazon S3 & Amazon EC2** | Hospedagem do front-end e servidor de aplicação do back-end |
| **Docker & Docker Compose** | Orquestração completa dos serviços (*multi-stage build* para Java e React) |
| **Git & GitHub Actions** | Controle de versão e pipeline de Integração Contínua (CI) |

---

## 📂 Estrutura do Repositório

```text
Projeto-PI/
├── .github/workflows/          # Pipeline de automação de build (CI)
├── Frontend/                   # Código-fonte da interface web (React + Vite)
│   ├── .dockerignore           # Arquivos ignorados no build da imagem do front-end
│   ├── Dockerfile              # Build multi-stage (Node + Nginx)
│   └── package.json            # Dependências do front-end
├── backend/                    # Código-fonte da API Java / Spring Boot
│   ├── src/                    # Controllers, Models, Repositories e Configurações
│   ├── .dockerignore           # Arquivos ignorados no build da imagem da API
│   ├── .env.example            # Modelo de variáveis de ambiente (sem credenciais)
│   ├── Dockerfile              # Build multi-stage (Maven + Eclipse Temurin JRE)
│   └── pom.xml                 # Dependências Maven
├── docs/                       # Documentação técnica e modelagem de dados
│   ├── der-banco.png           # Diagrama Entidade-Relacionamento (DER)
│   ├── dicionario-de-dados.md  # Detalhamento das tabelas, colunas e tipos
│   └── schema.sql              # Script SQL de criação das tabelas
├── .gitignore                  # Proteção de credenciais (.env) e arquivos temporários
├── docker-compose.yml          # Orquestração dos contêineres (Front-end, Back-end e Banco)
└── README.md                   # Documentação geral do projeto
```

* 📐 **[Acesse aqui o Dicionário de Dados e o Diagrama (DER)](./docs/dicionario-de-dados.md)**
* 🗄️ **[Acesse aqui o Script SQL do Banco (`schema.sql`)](./docs/schema.sql)**

---

## 🐳 Como Executar o Projeto com Docker (Recomendado)

Com o **Docker Desktop** instalado e em execução, você pode subir toda a aplicação (Front-end, Back-end e Banco MySQL com o `schema.sql` já carregado) com um único comando:

### 1. Configurar as Variáveis de Ambiente
Crie um arquivo chamado `.env` na **raiz do projeto** (ao lado do `docker-compose.yml`) com o seguinte conteúdo:

```env
DB_NAME=projetopi
DB_USER=root
DB_PASS=sua_senha_aqui
DB_URL=jdbc:mysql://db:3306/projetopi?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
SERVER_PORT=8080
```

### 2. Construir e Iniciar os Contêineres
Na raiz do projeto (`Projeto-PI/`), execute:

```bash
docker compose up -d --build
```

### 3. Acessar a Aplicação
* **Front-end (Interface Web):** [http://localhost](http://localhost)
* **Back-end (API REST):** [http://localhost:8080](http://localhost:8080)

### Comandos Úteis
* **Acompanhar logs da API:** `docker logs -f projeto-pi-backend`
* **Parar e remover os contêineres:** `docker compose down`

---

## ⚙️ Como Executar Manualmente (Sem Docker)

1. **Banco de Dados:** Execute o script `./docs/schema.sql` em uma instância **MySQL** local ou na **AWS RDS**.
2. **Back-end:** Dentro de `backend/`, crie o arquivo `.env` baseado no `.env.example` (apontando para `localhost` ou para o endpoint do RDS) e execute:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```
3. **Front-end:** Dentro de `Frontend/`, instale as dependências e inicie o servidor de desenvolvimento:
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

---

## 👥 Equipe e Responsabilidades

* **Guilherme Oliveira:** Desenvolvimento Full Stack, Integração, Infraestrutura AWS (S3, EC2, RDS), Docker e CI/CD.
* **Breno Silva:** Desenvolvimento Front-end, construção de dashboards e apoio na experiência do usuário.
* **Pedro Vasconcelos:** Ciência de Dados, limpeza, tratamento e análise dos indicadores industriais.
* **Fabiano Silva:** Levantamento de requisitos, regras de negócio e definição de escopo.
* **Guilherme Fonseca:** Modelagem de Banco de Dados (DER), estruturação relacional e organização no RDS.

---

*Desenvolvido como parte das atividades acadêmicas do **Projeto Integrador (PI)**.*
