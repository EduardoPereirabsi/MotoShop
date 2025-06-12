-- Inserir usuário admin padrão (senha: admin123)
INSERT INTO users (name, email, password, role)
VALUES ('Admin MotoShop', 'admin@motoshop.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin') AS new
ON DUPLICATE KEY UPDATE
  name = new.name,
  password = new.password,
  role = new.role;


-- Inserir algumas motos de exemplo
INSERT INTO motorcycles (brand, model, year, price, color, engine_size, fuel_type, mileage, description, status)
VALUES 
  ('Honda', 'CB 600F Hornet', 2023, 35000.00, 'Vermelha', 600, 'Gasolina', 0, 'Moto esportiva com excelente desempenho', 'available'),
  ('Yamaha', 'MT-07', 2023, 42000.00, 'Azul', 689, 'Gasolina', 0, 'Naked bike com motor bicilíndrico', 'available'),
  ('Kawasaki', 'Ninja 400', 2022, 28000.00, 'Verde', 399, 'Gasolina', 5000, 'Esportiva ideal para iniciantes', 'available'),
  ('BMW', 'G 310 R', 2023, 25000.00, 'Branca', 313, 'Gasolina', 0, 'Naked premium com tecnologia alemã', 'available'),
  ('Suzuki', 'GSX-S750', 2022, 38000.00, 'Preta', 749, 'Gasolina', 8000, 'Esportiva com DNA de pista', 'available') AS new
ON DUPLICATE KEY UPDATE
  brand = new.brand,
  model = new.model,
  year = new.year,
  price = new.price,
  color = new.color,
  engine_size = new.engine_size,
  fuel_type = new.fuel_type,
  mileage = new.mileage,
  description = new.description,
  status = new.status;

