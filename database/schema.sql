-- Theater Seat Booking System Schema

CREATE DATABASE IF NOT EXISTS theater_booking;
USE theater_booking;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Theaters table
CREATE TABLE IF NOT EXISTS theatres (
    theatre_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT
);

-- Shows table
CREATE TABLE IF NOT EXISTS shows (
    show_id INT AUTO_INCREMENT PRIMARY KEY,
    theatre_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INT, -- in minutes
    age_rating VARCHAR(10),
    FOREIGN KEY (theatre_id) REFERENCES theatres(theatre_id) ON DELETE CASCADE
);

-- Showtimes table
CREATE TABLE IF NOT EXISTS showtimes (
    show_time_id INT AUTO_INCREMENT PRIMARY KEY,
    show_id INT NOT NULL,
    show_date DATE NOT NULL,
    show_time TIME NOT NULL,
    hall_name VARCHAR(100),
    price DECIMAL(10, 2),
    FOREIGN KEY (show_id) REFERENCES shows(show_id) ON DELETE CASCADE
);

-- Reservations table
CREATE TABLE IF NOT EXISTS reservations (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    show_id INT NOT NULL,
    show_time_id INT NOT NULL,
    seats JSON, -- e.g., ["A1", "A2"]
    status ENUM('active', 'cancelled', 'completed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (show_id) REFERENCES shows(show_id) ON DELETE CASCADE,
    FOREIGN KEY (show_time_id) REFERENCES showtimes(show_time_id) ON DELETE CASCADE
);

-- Seed Data
INSERT INTO theatres (name, location, description) VALUES
('Grand Theater', 'Athens Center', 'Historic theater with modern amenities.'),
('Cineplex Odeon', 'Thessaloniki', 'State-of-the-art multiplex.'),
('Outdoor Cinema Apollo', 'Patras', 'Beautiful open-air cinema under the stars.');

INSERT INTO shows (theatre_id, title, description, duration, age_rating) VALUES
(1, 'Hamlet', 'Classic Shakespearean tragedy.', 180, '12+'),
(1, 'The Phantom of the Opera', 'Long-running musical masterpiece.', 150, 'All'),
(2, 'Interstellar', 'Sci-fi epic by Christopher Nolan.', 169, '12+'),
(3, 'Mamma Mia!', 'Feel-good musical comedy.', 108, 'All');

INSERT INTO showtimes (show_id, show_date, show_time, hall_name, price) VALUES
(1, '2026-06-01', '20:00:00', 'Main Hall', 25.00),
(1, '2026-06-02', '20:00:00', 'Main Hall', 25.00),
(2, '2026-06-01', '19:30:00', 'Stage A', 30.00),
(3, '2026-06-01', '21:00:00', 'IMAX Screen', 15.00),
(4, '2026-06-05', '21:30:00', 'Garden Screen', 12.00);
