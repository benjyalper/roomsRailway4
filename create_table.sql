CREATE TABLE selected_dates (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    selected_date DATE,
    names VARCHAR(255),
    color VARCHAR(255),
    startTime TIME,
    endTime TIME,
    roomNumber VARCHAR(255),
    recurringEvent TINYINT(1)
);
