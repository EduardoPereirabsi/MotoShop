-- Atualizar a tabela de usuários para incluir role 'user' como padrão
-- e criar alguns usuários de exemplo

-- Alterar o valor padrão do role para 'user'
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'user';

-- Inserir alguns usuários comuns de exemplo
INSERT INTO users (name, email, password, role)
VALUES 
  ('João Silva', 'joao@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
  ('Maria Santos', 'maria@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
  ('Pedro Costa', 'pedro@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user') AS new
ON DUPLICATE KEY UPDATE
  name = new.name,
  password = new.password,
  role = new.role;