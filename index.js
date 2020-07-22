const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const fs = require('fs');
require('dotenv').config();
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');


// LLamando a los controladores
const home = require('./controllers/Home');
const registro = require('./controllers/Registro');
const inicioSesion = require('./controllers/IniciarSesion');
const borrarUsuario = require('./controllers/BorrarUsuario');

const db = knex({
    client: 'mysql',
    connection: {
      host : process.env.DB_HOST,
      user : process.env.DB_USER,
      password : process.env.DB_PASSWORD,
      port: 3306,
      database: process.env.DATABASE
    }
  });


  
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

  
//Inicio de endpoints

app.get('/', (req, res) => {res.json('estoy vivo!')});

//Obtener todos los productos
app.get('/home', (req, res) => { home.handleHome(req, res, db) });

//Registro
app.post('/registro', (req, res) =>  { registro.handleRegistro(req, res, db, bcrypt) });

//Iniciar Sesion
app.post('/iniciar-sesion', (req, res) =>  { inicioSesion.handleInicioSesion(req, res, db, bcrypt) });

//Borrar Usuario
app.delete('/borrar-producto/:id', (req, res) => {borrarUsuario.handleBorrarUsuario(req, res, db)});

//Modificar Usuario



const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`I'm alive here ${port}`))