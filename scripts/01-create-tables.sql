-- Criar tabela de usuários (administradores)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    funcao VARCHAR(50) DEFAULT 'admin',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Criar tabela de motos
CREATE TABLE IF NOT EXISTS motos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    ano INT NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    cor VARCHAR(50),
    cilindrada INT,
    tipo_combustivel VARCHAR(50),
    quilometragem INT DEFAULT 0,
    descricao TEXT,
    url_imagem VARCHAR(500),
    status VARCHAR(50) DEFAULT 'disponivel',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Criar tabela de vendas
CREATE TABLE IF NOT EXISTS vendas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    moto_id INT,
    nome_cliente VARCHAR(255) NOT NULL,
    email_cliente VARCHAR(255) NOT NULL,
    telefone_cliente VARCHAR(20),
    cpf_cliente VARCHAR(14),
    preco_venda DECIMAL(10,2) NOT NULL,
    metodo_pagamento VARCHAR(50),
    parcelas INT DEFAULT 1,
    data_venda TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'concluida',
    observacoes TEXT,
    criado_por INT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (moto_id) REFERENCES motos(id) ON DELETE SET NULL,
    FOREIGN KEY (criado_por) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Consultar usuários
SELECT * FROM usuarios;

-- Consultar motos
SELECT * FROM motos;
