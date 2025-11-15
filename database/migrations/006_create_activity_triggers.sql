-- Migration: Create all activity triggers
-- Date: 2025-10-23
-- Author: Jasmeet

DELIMITER //

-- BEFORE UPDATE: stamp completed_at when appointment first becomes Completed
CREATE TRIGGER trg_appt_stamp_completed_at
BEFORE UPDATE ON appointments
FOR EACH ROW
BEGIN
  IF NEW.status = 'Completed'
     AND (OLD.status IS NULL OR OLD.status <> 'Completed')
     AND NEW.completed_at IS NULL THEN
    SET NEW.completed_at = NOW();
  END IF;
END//

-- AFTER UPDATE: log appointment completion in activity_log
CREATE TRIGGER trg_appt_completed_log
AFTER UPDATE ON appointments
FOR EACH ROW
BEGIN
  IF NEW.status = 'Completed'
     AND (OLD.status IS NULL OR OLD.status <> 'Completed') THEN
    INSERT INTO activity_log (action_type, entity_type, entity_name, message)
    VALUES (
      'Completed',
      'Appointment',
      NEW.service_type,
      CONCAT('Appointment completed: ', COALESCE(NEW.customer_name,'Unknown'),
             ' (', COALESCE(NEW.service_type,'N/A'), ')')
    );
  END IF;
END//

-- AFTER INSERT: log new customer
CREATE TRIGGER trg_customer_added_log
AFTER INSERT ON customers
FOR EACH ROW
BEGIN
  INSERT INTO activity_log (action_type, entity_type, entity_name, message)
  VALUES ('Add','Customer',NEW.name,CONCAT('Added customer: ',NEW.name));
END//

-- AFTER UPDATE: log edited customer
CREATE TRIGGER trg_customer_edited_log
AFTER UPDATE ON customers
FOR EACH ROW
BEGIN
  INSERT INTO activity_log (action_type, entity_type, entity_name, message)
  VALUES ('Edit','Customer',NEW.name,CONCAT('Edited customer: ',NEW.name));
END//

-- AFTER DELETE: log deleted customer
CREATE TRIGGER trg_customer_deleted_log
AFTER DELETE ON customers
FOR EACH ROW
BEGIN
  INSERT INTO activity_log (action_type, entity_type, entity_name, message)
  VALUES ('Delete','Customer',OLD.name,CONCAT('Deleted customer: ',OLD.name));
END//

DELIMITER ;
