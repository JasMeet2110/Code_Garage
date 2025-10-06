-- Seed data for testing
-- Created: 2025-10-05
-- Description: Sample data for development and testing

-- Employees seed data
INSERT INTO employees (name, position, phone, email, salary, start_date) VALUES
('John Smith', 'Senior Mechanic', '(555) 123-4567', 'john.smith@codegarage.com', 55000.00, '2022-03-15'),
('Sarah Johnson', 'Shop Manager', '(555) 234-5678', 'sarah.johnson@codegarage.com', 65000.00, '2021-08-10'),
('Mike Davis', 'Junior Mechanic', '(555) 345-6789', 'mike.davis@codegarage.com', 42000.00, '2023-01-20')
ON DUPLICATE KEY UPDATE name=name;

-- Customers seed data
INSERT INTO customers (name, phone, email, car_name, car_plate, start_date) VALUES
('David Miller', '(555) 678-1234', 'david.miller@email.com', 'Toyota Camry', 'ABC-123', '2023-05-20'),
('Emma Wilson', '(555) 987-6543', 'emma.wilson@email.com', 'Honda Civic', 'XYZ-789', '2022-11-02')
ON DUPLICATE KEY UPDATE name=name;

-- Inventory seed data
INSERT INTO inventory (name, part_number, quantity, price) VALUES
('Oil Filter', 'OF-1024', 100, 15.99),
('Brake Pads', 'BP-1025', 50, 50.00),
('Air Filter', 'AF-1026', 75, 10.00),
('Spark Plugs', 'SP-1027', 200, 8.00),
('Rotors', 'R-1028', 30, 45.00)
ON DUPLICATE KEY UPDATE name=name;