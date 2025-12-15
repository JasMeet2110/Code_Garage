-- database/migrations/007_create_activity_log_table.sql

CREATE TABLE IF NOT EXISTS activity_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    table_name VARCHAR(50) NULL,
    record_id INT DEFAULT NULL,
    action_type ENUM('Completed', 'Add', 'Edit', 'Delete') NOT NULL,
    
    -- ADDED MISSING COLUMNS TO MATCH TRIGGER FILE
    entity_type VARCHAR(50) NOT NULL,
    entity_name VARCHAR(255) NOT NULL,
    message TEXT,
    
    changed_by VARCHAR(255) DEFAULT 'SYSTEM',
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
