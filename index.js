const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const fs = require('fs');
require('dotenv').config();
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');


// LLamando a los controladores
const homePosts = require('./controllers/HomePosts');
const registro = require('./controllers/Registro');
const inicioSesion = require('./controllers/IniciarSesion');
const modificarUsuario = require('./controllers/ModificarUsuario');
const borrarUsuario = require('./controllers/BorrarUsuario');

const buscarPostId = require('./controllers/BuscarPostId')
const modificarPost = require('./controllers/ModificarPost');
const borrarPost = require('./controllers/BorrarPost');

// Llamando a Uploads y Cloudinary
const upload = require('./controllers/ImageUploader/multer');
const cloudinary = require('./controllers/ImageUploader/Cloudinary');

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
app.get('/home-posts', (req, res) => { homePosts.handleHomePosts(req, res, db) });

//Registro
app.post('/registro', (req, res) =>  { registro.handleRegistro(req, res, db, bcrypt) });

//Iniciar Sesion
app.post('/iniciar-sesion', (req, res) =>  { inicioSesion.handleInicioSesion(req, res, db, bcrypt) });

//Borrar Usuario
app.delete('/borrar-usuario/:id', (req, res) => {borrarUsuario.handleBorrarUsuario(req, res, db)});

//Modificar Usuario
app.patch('/modificar-usuario/:id', (req, res) => {modificarUsuario.handleModificarUsuario(req, res, db, bcrypt)});


//-------- Endpoints de los posts
 
//Buscar Post por ID
app.get('/buscar-post/:id', (req, res) => {buscarPostId.handleBuscarPostId(req, res, db)});

//Agregar Post
app.use('/agregar-post', upload.array('image'), async(req, res) => {
  const uploader = async (path) => await cloudinary.uploads(path, 'Encuentro');
  let safeUrl = '';
  const insert = (str, index, value) => {
    safeUrl = str.substr(0, index) + value + str.substr(index);
}

  const { 
    titulo, 
    descripcion,
    tiempo,
    fecha 
      } = req.body;


  if (req.method === 'POST') {
      const urls = [];
      const files = req.files;

      for(const file of files) {
          const { path } = file;

          const newPath = await uploader(path);

          urls.push(newPath);

          fs.unlinkSync(path);
      
          };

          const unsafeUrl = urls[0].url;
          insert(unsafeUrl, 4, 's');

             db('posts').insert({
              titulo,
              descripcion,
              tiempo,
              fecha,   
              imagen: safeUrl   
           }).then(res.status(200).json('post agregado'))
             // id: urls[0].id
        } else {
      res.status(405).json({
          err: "No se pudo subir la imagen"
      })
  }
})

//Modificar Post
app.patch('/modificar-post/:id', (req, res) => {modificarPost.handleModificarPost(req, res, db)});

//Modificar Imagen del Post
app.use('/modificar-imagen-post/:id', upload.array('image'), async(req, res) => {
  const uploader = async (path) => await cloudinary.uploads(path, 'Encuentro');
  let safeUrl = '';
  const insert = (str, index, value) => {
    safeUrl = str.substr(0, index) + value + str.substr(index);
}
  const { id } = req.params;
  if (req.method === 'PATCH') {
      const urls = [];
      const files = req.files;

      for(const file of files) {
          const { path } = file;

          const newPath = await uploader(path);

          urls.push(newPath);

          fs.unlinkSync(path);
      
          };
          const unsafeUrl = urls[0].url;
          insert(unsafeUrl, 4, 's');

            db('posts').where({id: id}).update({             
              imagen: safeUrl
             // id: urls[0].id

          })
             .then(console.log)           
          
      res.status(200).json('exito');
  } else {
      res.status(405).json({
          err: "No se pudo subir la imagen"
      })
  }
  
})

// Borrar Post
app.delete('/borrar-post/:id', (req, res) => {borrarPost.handleBorrarPost(req, res, db)});


// -- Galeria

//Buscar todas las imagenes
app.get('/imagenes-galeria', (req, res) => {
  db.select().table('galeria')
  .then(response => {
      res.json(response);
  })
.catch(err => res.status(500).json('problema con la base de datos + ' + err))
})

//Buscar imagen por ID
app.get('/buscar-imagen/:id', (req, res) => {
  const { id } = req.params;
  db.select('*').from('galeria').where({
    id: id
}).then(post => {
    if(post.length){
        res.json(post[0])
    }else{
        res.status(400).json('imagen no encontrada')
    }
})
.catch(err => res.status(400).json('error buscando imagen'))
})

//Agregar imagen a Galeria
app.use('/agregar-imagen-galeria', upload.array('image'), async(req, res) => {
  const uploader = async (path) => await cloudinary.uploads(path, 'Encuentro');
  let safeUrl = '';
  const insert = (str, index, value) => {
    safeUrl = str.substr(0, index) + value + str.substr(index);
}
  if (req.method === 'POST') {
      const urls = [];
      const files = req.files;

      for(const file of files) {
          const { path } = file;

          const newPath = await uploader(path);

          urls.push(newPath);

          fs.unlinkSync(path);
      
          };

          const unsafeUrl = urls[0].url;
          insert(unsafeUrl, 4, 's');

             db('galeria').insert({
              imagen: safeUrl   
           }).then(res.status(200).json('imagen agregada'))
             // id: urls[0].id
        } else {
      res.status(405).json({
          err: "No se pudo subir la imagen"
      })
  }
})

//Modificar imagen Galeria
app.use('/modificar-imagen-galeria/:id', upload.array('image'), async(req, res) => {
  const uploader = async (path) => await cloudinary.uploads(path, 'Encuentro');
  let safeUrl = '';
  const insert = (str, index, value) => {
    safeUrl = str.substr(0, index) + value + str.substr(index);
}
  const { id } = req.params;
  if (req.method === 'PATCH') {
      const urls = [];
      const files = req.files;

      for(const file of files) {
          const { path } = file;

          const newPath = await uploader(path);

          urls.push(newPath);

          fs.unlinkSync(path);
      
          };
          const unsafeUrl = urls[0].url;
          insert(unsafeUrl, 4, 's');

            db('galeria').where({id: id}).update({             
              imagen: safeUrl
             // id: urls[0].id

          })
             .then(console.log)           
          
      res.status(200).json('exito');
  } else {
      res.status(405).json({
          err: "No se pudo subir la imagen"
      })
  }
  
})

//Eliminar imagen Galeria
app.delete('/eliminar-imagen-galeria/:id', (req, res) => {
  const { id } = req.params;
  db('galeria').where({ id: id})
  .del()
  .then(res.json('borrado exitoso!'))
})



//Buscar todos los videos
app.get('/videos-galeria', (req, res) => {
  db.select().table('galeriaVideos')
  .then(response => {
      res.json(response);
  })
.catch(err => res.status(500).json('problema con la base de datos + ' + err))
})

//Buscar video por ID
app.get('/buscar-video/:id', (req, res) => {
  const { id } = req.params;
  db.select('*').from('galeriaVideos').where({
    id: id
}).then(post => {
    if(post.length){
        res.json(post[0])
    }else{
        res.status(400).json('video no encontrado')
    }
})
.catch(err => res.status(400).json('error buscando imagen'))
})

//Agregar video a Galeria
app.use('/agregar-video-galeria', upload.array('video'), async(req, res) => {
  const uploader = async (path) => await cloudinary.uploads(path, 'Encuentro');
  let safeUrl = '';
  const insert = (str, index, value) => {
    safeUrl = str.substr(0, index) + value + str.substr(index);
}
  if (req.method === 'POST') {
      const urls = [];
      const files = req.files;

      for(const file of files) {
          const { path } = file;

          const newPath = await uploader(path);

          urls.push(newPath);

          fs.unlinkSync(path);
      
          };

          const unsafeUrl = urls[0].url;
          insert(unsafeUrl, 4, 's');

             db('galeriaVideos').insert({
              video: safeUrl   
           }).then(res.status(200).json('video agregado'))
             // id: urls[0].id
        } else {
      res.status(405).json({
          err: "No se pudo subir la imagen"
      })
  }
})

//Modificar video Galeria
app.use('/modificar-video-galeria/:id', upload.array('video'), async(req, res) => {
  const uploader = async (path) => await cloudinary.uploads(path, 'Encuentro');
  let safeUrl = '';
  const insert = (str, index, value) => {
    safeUrl = str.substr(0, index) + value + str.substr(index);
}
  const { id } = req.params;
  if (req.method === 'PATCH') {
      const urls = [];
      const files = req.files;

      for(const file of files) {
          const { path } = file;

          const newPath = await uploader(path);

          urls.push(newPath);

          fs.unlinkSync(path);
      
          };
          const unsafeUrl = urls[0].url;
          insert(unsafeUrl, 4, 's');

            db('galeriaVideos').where({id: id}).update({             
              video: safeUrl
             // id: urls[0].id

          })
             .then(console.log)           
          
      res.status(200).json('exito');
  } else {
      res.status(405).json({
          err: "No se pudo subir la imagen"
      })
  }
  
})

//Eliminar video Galeria
app.delete('/eliminar-video-galeria/:id', (req, res) => {
  const { id } = req.params;
  db('galeriaVideos').where({ id: id})
  .del()
  .then(res.json('borrado exitoso!'))
})





const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`I'm alive here ${port}`))