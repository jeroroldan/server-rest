const express = require('express');

const cors = require('cors');
const { dbConnection } = require('../database/config');



class Server {

  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usuariosPath = '/api/usuarios';

    //Middlewares;
    this.middlewares();

    //conectar a base de datps
    this.conectarDB();


    //rutas de mi app
    this.routes();

  }

  
  async conectarDB() {
    await dbConnection();
  }

  middlewares() {

    //cors 
    this.app.use( cors() );

    //lectura y parseo del body

    this.app.use( express.json() );

    this.app.use( express.static('public') )
  }

  routes() {

    this.app.use( this.usuariosPath, require('../routes/usuarios'));


  }

  listen(){
    this.app.listen(this.port, () => console.log(`servidor corriendo`, this.port));
  }

}

module.exports = {
  Server
}

