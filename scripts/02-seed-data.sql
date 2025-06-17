-- Inserir usuário admin padrão (senha: admin123)
INSERT INTO usuarios (nome, email, senha, funcao)
VALUES ('Admin MotoShop', 'admin@motoshop.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON DUPLICATE KEY UPDATE
  nome = VALUES(nome),
  senha = VALUES(senha),
  funcao = VALUES(funcao);

-- Inserir algumas motos de exemplo
INSERT INTO motos (marca, modelo, ano, preco, cor, cilindrada, tipo_combustivel, quilometragem, descricao, status)
VALUES 
  ('Honda', 'CB 600F Hornet', 2023, 35000.00, 'Vermelha', 600, 'Gasolina', 0, 'Moto esportiva com excelente desempenho', 'disponivel'),
  ('Yamaha', 'MT-07', 2023, 42000.00, 'Azul', 689, 'Gasolina', 0, 'Naked bike com motor bicilíndrico', 'disponivel'),
  ('Kawasaki', 'Ninja 400', 2022, 28000.00, 'Verde', 399, 'Gasolina', 5000, 'Esportiva ideal para iniciantes', 'disponivel'),
  ('BMW', 'G 310 R', 2023, 25000.00, 'Branca', 313, 'Gasolina', 0, 'Naked premium com tecnologia alemã', 'disponivel'),
  ('Suzuki', 'GSX-S750', 2022, 38000.00, 'Preta', 749, 'Gasolina', 8000, 'Esportiva com DNA de pista', 'disponivel')
ON DUPLICATE KEY UPDATE
  marca = VALUES(marca),
  modelo = VALUES(modelo),
  ano = VALUES(ano),
  preco = VALUES(preco),
  cor = VALUES(cor),
  cilindrada = VALUES(cilindrada),
  tipo_combustivel = VALUES(tipo_combustivel),
  quilometragem = VALUES(quilometragem),
  descricao = VALUES(descricao),
  status = VALUES(status);
