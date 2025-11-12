-- Script creacion base de datos
--CREATE DATABASE ListaNota;
-- elmina base de datos
--DROP DATABASE ListaNota;
-- Creacion tabla usuario

-- =========================================================
-- CREACIÓN DE SCHEMAS
-- =========================================================
CREATE SCHEMA IF NOT EXISTS usuario;
CREATE SCHEMA IF NOT EXISTS agenda;

CREATE TABLE IF NOT EXISTS usuario.Usuario(
Id SERIAL PRIMARY KEY, -- SERIAL es para que se autoincremente
Nombre VARCHAR(100) NOT NULL, -- NOT NULL es para que no sea nulo
Apellido VARCHAR(100) NOT NULL,
Email VARCHAR(100) UNIQUE NOT NULL, -- UNIQUE es para que no se repita
Contrasena VARCHAR(10) NOT NULL, 
Fecha_Creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- fecha de creacion por defecto la fecha actual
Fecha_Modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
); 
-- Creacion tabla Nota
CREATE TABLE IF NOT EXISTS agenda.Nota(
    Id SERIAL PRIMARY KEY,
    Id_usuario SERIAL NOT NULL,
    Titulo VARCHAR(100) NOT NULL,
    Descripcion VARCHAR(100) NOT NULL,
    Fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario.usuario(Id) -- FOREIGN KEY es para que la tabla Nota tenga una relacion con la tabla usuario del schema usuario
    ON DELETE CASCADE -- ON DELETE CASCADE es para que si se elimina un usuario se eliminen todas las Nota que tenga ese usuario
);
-- Agregar columna Fecha_Alert a la tabla Nota
--ALTER TABLE agenda.Nota ADD COLUMN Fecha_Alert TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
--ALTER TABLE Nota ADD COLUMN Fecha_Alert2 TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
---- Eliminar columna Fecha_Alert2 de la tabla Nota
--ALTER TABLE Nota DROP COLUMN Fecha_Alert2;
-- Modificar columna Contrasena de la tabla Usuario para que sea VARCHAR(50)
--ALTER TABLE agenda.Nota RENAME COLUMN Fecha_Alert TO Fecha_Alerta;


DO $$
BEGIN
IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'agenda'
          AND table_name = 'nota'
          AND column_name = 'fecha_alerta'
    ) THEN
    ALTER TABLE agenda.Nota ADD COLUMN fecha_alerta TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
    END IF;
END
$$;
-- =========================================================
-- MOVIMIENTO DE TABLAS A SCHEMAS CORRESPONDIENTES
--ALTER TABLE usuario.Usuario SET SCHEMA usuario;
--ALTER TABLE agenda.Nota SET SCHEMA agenda;

-- =========================================================
-- RELACION UNO A MUCHOS ENTRE USUARIO Y Nota
-- La relacion ya esta establecida con la clave foranea en la tabla Nota, con usuario.Id como clave primaria y Nota.Id_usuario como clave foranea.
-- =========================================================
-- =========================================================
-- relacion muchos a muchos entre Etiqueta y Nota
-- =========================================================
CREATE TABLE IF NOT EXISTS agenda.Etiqueta(
    Id SERIAL PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL UNIQUE,
    Fecha_Creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Fecha_Modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- ========================================================
-- Tabla de rompimiento
-- Se crea tabla intermedia para la relacion muchos a muchos entre Nota y Etiqueta
-- para que una nota pueda tener muchas Etiqueta y una etiqueta pueda pertenecer a muchas Nota
-- sin duplicar datos
-- ========================================================
CREATE TABLE IF NOT EXISTS agenda.Nota_Etiqueta(
    Id_nota SERIAL NOT NULL,
    Id_etiqueta SERIAL NOT NULL,
    PRIMARY KEY (Id_nota, Id_etiqueta), -- clave primaria compuesta por las dos claves foraneas para evitar duplicados
    FOREIGN KEY (Id_nota) REFERENCES agenda.Nota(Id) ON DELETE CASCADE,
    FOREIGN KEY (Id_etiqueta) REFERENCES agenda.Etiqueta(Id) ON DELETE CASCADE
);
-- =========================================================
-- Relacion uno a uno entre usuario y perfil
-- =========================================================
CREATE TABLE IF NOT EXISTS usuario.Perfil(
    Id SERIAL PRIMARY KEY,
    Id_usuario SERIAL UNIQUE NOT NULL, -- UNIQUE para que un usuario solo tenga un perfil
    Nombre VARCHAR(255),
    Foto_Perfil VARCHAR(255),
    Fecha_Nacimiento DATE,
    Telefono VARCHAR(20),
    Direccion VARCHAR(255),
    Fecha_Creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Fecha_Modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Id_usuario) REFERENCES usuario.Usuario(Id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS agenda.Estado(
    Id SERIAL PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL UNIQUE,
    Fecha_Creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Fecha_Modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- =========================================================
-- Relacion uno a uno entre Nota y estado
-- =========================================================

DO $$
BEGIN
IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'agenda'
          AND table_name = 'nota'
          AND column_name = 'id_estado'
    ) THEN
        ALTER TABLE agenda.Nota ADD COLUMN Id_estado SERIAL NOT NULL;
        ALTER TABLE agenda.Nota ADD FOREIGN KEY (Id_estado) REFERENCES agenda.Estado(Id) ON DELETE CASCADE;
    END IF;
END
$$;