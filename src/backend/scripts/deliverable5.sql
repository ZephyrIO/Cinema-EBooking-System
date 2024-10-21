CREATE DATABASE cinema_booking_system;
USE cinema_booking_system;

CREATE TABLE User (
    userId INT PRIMARY KEY,
    firstName VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    lastName VARCHAR(255)
);

CREATE TABLE Admin (
    adminId INT PRIMARY KEY,
    userId INT,
    FOREIGN KEY (userId) REFERENCES User(userId)
);

CREATE TABLE Status (
    value ENUM('Active', 'Inactive', 'Suspended') PRIMARY KEY
);

CREATE TABLE Customer (
    customerId INT PRIMARY KEY,
    userId INT,
    status ENUM('Active', 'Inactive', 'Suspended'),
    FOREIGN KEY (userId) REFERENCES User(userId),
    FOREIGN KEY (status) REFERENCES Status(value)
);

CREATE TABLE PaymentCard (
    cardNumber VARCHAR(16) PRIMARY KEY,
    billingAddress VARCHAR(255),
    expirationDate DATE
);

CREATE TABLE CustomerPaymentCard (
    customerId INT,
    cardNumber VARCHAR(16),
    PRIMARY KEY (customerId, cardNumber),
    FOREIGN KEY (customerId) REFERENCES Customer(customerId),
    FOREIGN KEY (cardNumber) REFERENCES PaymentCard(cardNumber)
);

CREATE TABLE Movie (
    movieId INT PRIMARY KEY,
    title VARCHAR(255),
    duration TIME,
    ratingScore DECIMAL(3, 1)
);

CREATE TABLE Showroom (
    theatreId INT PRIMARY KEY,
    numSeats INT
);

CREATE TABLE ShowM (
    showId INT PRIMARY KEY,
    movieId INT,
    showroomId INT,
    date DATE,
    time TIME,
    duration TIME,
    FOREIGN KEY (movieId) REFERENCES Movie(movieId),
    FOREIGN KEY (showroomId) REFERENCES Showroom(theatreId)
);

CREATE TABLE Booking (
    bookingId INT PRIMARY KEY,
    customerId INT,
    showId INT,
    dateCreated DATE,
    FOREIGN KEY (customerId) REFERENCES Customer(customerId),
    FOREIGN KEY (showId) REFERENCES ShowM(showId)
);

CREATE TABLE PersonAge (
    value ENUM('Child', 'Adult', 'Senior') PRIMARY KEY
);

CREATE TABLE Ticket (
    ticketId INT PRIMARY KEY,
    bookingId INT,
    ticketType ENUM('Child', 'Adult', 'Senior'),
    FOREIGN KEY (bookingId) REFERENCES Booking(bookingId),
    FOREIGN KEY (ticketType) REFERENCES PersonAge(value)
);

CREATE TABLE Promotion (
    promotionId INT PRIMARY KEY,
    descriptionhost_summary VARCHAR(255),
    discountAmount DECIMAL(5, 2)
);
