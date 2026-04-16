CREATE DATABASE vozsegura;

USE vozsegura;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50),
    correo VARCHAR(100),
    password VARCHAR(255)
);