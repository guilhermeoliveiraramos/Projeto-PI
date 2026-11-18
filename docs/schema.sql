-- ============================================================================
-- Script de Criação do Banco de Dados (Schema) - Projeto Integrador (PI)
-- Banco de Dados: projetopi (MySQL / Amazon RDS)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS projetopi
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_0900_ai_ci;

USE projetopi;

-- ----------------------------------------------------------------------------
-- 1. Tabela: usuario
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario BIGINT NOT NULL AUTO_INCREMENT,
    nome_usuario VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL,
    cargo VARCHAR(80) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    PRIMARY KEY (id_usuario),
    UNIQUE KEY uk_usuario_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- 2. Tabela: pneus
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pneus (
    id_pneu BIGINT NOT NULL AUTO_INCREMENT,
    modelo_pneu VARCHAR(100) NOT NULL,
    quantidade INT NOT NULL,
    PRIMARY KEY (id_pneu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- 3. Tabela: arquivos
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS arquivos (
    id_arquivo BIGINT NOT NULL AUTO_INCREMENT,
    nome_arquivo VARCHAR(255) NOT NULL,
    id_usuario BIGINT NOT NULL,
    PRIMARY KEY (id_arquivo),
    KEY fk_arquivos_usuario_idx (id_usuario),
    CONSTRAINT fk_arquivos_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuario (id_usuario)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- 4. Tabela: ciclos
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ciclos (
    id_ciclo BIGINT NOT NULL AUTO_INCREMENT,
    id_pneu BIGINT NOT NULL,
    id_arquivo BIGINT NULL,
    turno VARCHAR(20) NOT NULL,
    status_ciclo VARCHAR(50) NOT NULL,
    tempo_ciclo_min DECIMAL(8,2) NULL,
    data_hora DATETIME(6) NOT NULL,
    cura_pct DECIMAL(5,2) NULL,
    eficiencia_pct DECIMAL(5,2) NULL,
    PRIMARY KEY (id_ciclo),
    KEY fk_ciclos_pneus_idx (id_pneu),
    KEY fk_ciclos_arquivos_idx (id_arquivo),
    CONSTRAINT fk_ciclos_pneus FOREIGN KEY (id_pneu)
        REFERENCES pneus (id_pneu)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_ciclos_arquivos FOREIGN KEY (id_arquivo)
        REFERENCES arquivos (id_arquivo)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- 5. Tabela: medicoes
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS medicoes (
    id_medicao BIGINT NOT NULL AUTO_INCREMENT,
    id_ciclo BIGINT NOT NULL,
    temperatura_c DECIMAL(5,2) NULL,
    pressao_bar DECIMAL(6,2) NULL,
    vibracao_mm_s DECIMAL(6,2) NULL,
    consumo_kwh DECIMAL(8,2) NULL,
    tempo_valvula DECIMAL(8,2) NULL,
    PRIMARY KEY (id_medicao),
    KEY fk_medicoes_ciclos_idx (id_ciclo),
    CONSTRAINT fk_medicoes_ciclos FOREIGN KEY (id_ciclo)
        REFERENCES ciclos (id_ciclo)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
