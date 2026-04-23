CREATE DATABASE vozsegura;

USE vozsegura;

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  usuario VARCHAR(50) UNIQUE NOT NULL,
  nombre VARCHAR(100),
  correo VARCHAR(100),
  password TEXT NOT NULL
);