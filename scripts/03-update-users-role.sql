-- Atualizar a tabela de usuários para incluir 'user' como valor padrão para a função
ALTER TABLE usuarios ALTER COLUMN funcao SET DEFAULT 'user';

-- Inserir alguns usuários comuns de exemplo
INSERT INTO usuarios (nome, email, senha, funcao)
VALUES 
  ('João Silva', 'joao@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
  ('Maria Santos', 'maria@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
  ('Pedro Costa', 'pedro@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user')
ON DUPLICATE KEY UPDATE
  nome = VALUES(nome),
  senha = VALUES(senha),
  funcao = VALUES(funcao);
