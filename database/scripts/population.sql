USE code_garage_db;

SET FOREIGN_KEY_CHECKS = 0;

-- =========================
-- HARD RESET (SAFE)
-- =========================
DELETE FROM reviews;
DELETE FROM shifts;
DELETE FROM appointments;
DELETE FROM inventory;
DELETE FROM customers;
DELETE FROM employees;

ALTER TABLE employees AUTO_INCREMENT = 1;
ALTER TABLE customers AUTO_INCREMENT = 1;
ALTER TABLE inventory AUTO_INCREMENT = 1;
ALTER TABLE appointments AUTO_INCREMENT = 1;
ALTER TABLE shifts AUTO_INCREMENT = 1;
ALTER TABLE reviews AUTO_INCREMENT = 1;

-- =========================
-- TEMP NUMBERS (1–100)
-- =========================
DROP TEMPORARY TABLE IF EXISTS temp_numbers;
CREATE TEMPORARY TABLE temp_numbers (n INT PRIMARY KEY);

INSERT INTO temp_numbers (n)
VALUES
(1),(2),(3),(4),(5),(6),(7),(8),(9),(10),
(11),(12),(13),(14),(15),(16),(17),(18),(19),(20),
(21),(22),(23),(24),(25),(26),(27),(28),(29),(30),
(31),(32),(33),(34),(35),(36),(37),(38),(39),(40),
(41),(42),(43),(44),(45),(46),(47),(48),(49),(50),
(51),(52),(53),(54),(55),(56),(57),(58),(59),(60),
(61),(62),(63),(64),(65),(66),(67),(68),(69),(70),
(71),(72),(73),(74),(75),(76),(77),(78),(79),(80),
(81),(82),(83),(84),(85),(86),(87),(88),(89),(90),
(91),(92),(93),(94),(95),(96),(97),(98),(99),(100);

-- =========================
-- EMPLOYEES (10)
-- =========================
INSERT INTO employees (name, position, phone, email, salary, start_date) VALUES
('Alex Morgan','Technician','403-555-2001','alex.morgan@garage.com',35,'2024-01-01'),
('Ryan Cooper','Technician','403-555-2002','ryan.cooper@garage.com',34,'2024-01-01'),
('Daniel Brooks','Service Advisor','403-555-2003','daniel.brooks@garage.com',30,'2024-02-01'),
('Chris Walker','Technician','403-555-2004','chris.walker@garage.com',36,'2024-02-15'),
('Mark Thompson','Detailer','403-555-2005','mark.thompson@garage.com',25,'2024-03-01'),
('Emily Parker','Receptionist','403-555-2006','emily.parker@garage.com',22,'2024-03-01'),
('Jason Miller','Technician','403-555-2007','jason.miller@garage.com',33,'2024-04-01'),
('Kevin Anderson','Technician','403-555-2008','kevin.anderson@garage.com',32,'2024-04-01'),
('Brian Lewis','Technician','403-555-2009','brian.lewis@garage.com',34,'2024-05-01'),
('Sarah Mitchell','Service Advisor','403-555-2010','sarah.mitchell@garage.com',29,'2024-05-01');

-- =========================
-- CUSTOMERS (50)
-- =========================
INSERT INTO customers (name, phone, email, car_name, car_plate, year, color, start_date)
SELECT
  CONCAT('Customer ', n),
  CONCAT('403-777-', LPAD(n,4,'0')),
  CONCAT('customer',n,'@mail.com'),
  ELT((n % 5)+1,'Civic','Corolla','Mustang','Elantra','Camry'),
  CONCAT('AB',LPAD(n,4,'0')),
  2016 + (n % 8),
  ELT((n % 6)+1,'Black','White','Red','Blue','Grey','Silver'),
  DATE_SUB(CURDATE(), INTERVAL n DAY)
FROM temp_numbers
WHERE n <= 50;

-- =========================
-- INVENTORY (25)
-- =========================
INSERT INTO inventory (name, part_number, quantity, price) VALUES
('Synthetic Engine Oil','OIL-1001',200,100),
('Oil Filter','FLT-1002',150,70),
('Brake Pads','BRK-2001',80,180),
('Brake Rotors','BRK-2002',60,220),
('Air Filter','AIR-3001',100,45),
('Cabin Filter','AIR-3002',100,40),
('Spark Plugs','SPK-4001',120,25),
('Battery','BAT-5001',40,210),
('Alternator','ALT-6001',20,450),
('Starter Motor','STR-6002',20,380),
('Coolant','CLT-7001',100,35),
('Transmission Fluid','TRN-7002',80,90),
('Timing Belt','TIM-8001',25,320),
('Fuel Pump','FUL-9001',15,480),
('Headlight Bulb','LGT-10001',200,30),
('Tail Light','LGT-10002',100,75),
('Radiator','RAD-11001',15,520),
('Thermostat','THR-11002',40,95),
('Wheel Bearing','WHL-12001',30,260),
('Control Arm','CTR-12002',25,340),
('Serpentine Belt','BEL-13001',90,85),
('Shock Absorber','SHK-13002',35,390),
('Strut Assembly','STR-14001',30,440),
('Muffler','MUF-15001',20,360),
('Exhaust Pipe','EXH-15002',25,300);

-- =========================
-- APPOINTMENTS (100, 85% completed)
-- =========================
INSERT INTO appointments (
  customer_name,email,phone,service_type,
  car_make,car_model,car_year,plate_number,
  fuel_type,appointment_date,appointment_time,
  description,status,labor_cost,assigned_employee_id,completed_at
)
SELECT
  CONCAT('Customer ', (n % 50)+1),
  CONCAT('customer',(n % 50)+1,'@mail.com'),
  CONCAT('403-777-',LPAD((n % 50)+1,4,'0')),
  ELT((n % 6)+1,'Oil Change','Brake Service','Inspection','Battery Replacement','Diagnostics','Suspension Repair'),
  ELT((n % 5)+1,'Honda','Toyota','Ford','Hyundai','BMW'),
  ELT((n % 5)+1,'Civic','Corolla','Mustang','Elantra','3 Series'),
  2016 + (n % 8),
  CONCAT('AB',LPAD((n % 50)+1,4,'0')),
  ELT((n % 3)+1,'Gasoline','Diesel','Hybrid'),
  DATE_SUB(CURDATE(), INTERVAL n DAY),
  ELT((n % 5)+1,'09:00','10:30','12:00','14:00','15:30'),
  'Routine service.',
  IF(n <= 85,'Completed','Pending'),
  100 + (n % 5)*50,
  (n % 10)+1,
  IF(n <= 85, DATE_SUB(NOW(), INTERVAL n DAY), NULL)
FROM temp_numbers;

-- =========================
-- SHIFTS (40)
-- =========================
INSERT INTO shifts (employee_id,start_time,end_time,role_assigned,notes)
SELECT
  (n % 10)+1,
  DATE_SUB(NOW(), INTERVAL n DAY) - INTERVAL 8 HOUR,
  DATE_SUB(NOW(), INTERVAL n DAY),
  'Shop Duty',
  'Scheduled shift'
FROM temp_numbers
WHERE n <= 40;

-- =========================
-- REVIEWS (30)
-- =========================
INSERT INTO reviews (name,rating,comment,date)
SELECT
  CONCAT('Customer ',n),
  3 + (n % 3),
  ELT((n % 5)+1,
    'Excellent service!',
    'Very professional staff.',
    'Quick and reliable.',
    'Great experience overall.',
    'Will definitely come back.'
  ),
  DATE_SUB(CURDATE(), INTERVAL n DAY)
FROM temp_numbers
WHERE n <= 30;

SET FOREIGN_KEY_CHECKS = 1;
