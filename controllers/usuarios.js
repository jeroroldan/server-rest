const { request, response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');


const getUsuarios = async(req = request , res = response) => {

  // const { q, nombre , apikey } = req.query;

  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [ total , usuarios ] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query)
      .skip(Number(desde))
      .limit(+limite)
  ]);  

  res.status(403).json({ total , usuarios })

}

const usuariosPosts = async(req = request, res = response) => {

  const { nombre, correo, password, rol } = req.body;

  const usuario = new Usuario( { nombre , correo, password, rol } );

  //encriptar la contra
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync( password, salt );


  await usuario.save();

  res.status(403).json({
    ok: true,
    msg: 'post API - controlador',
    usuario
  })

}

const usuariosPut = async(req = request, res = response) => {

  const { id } = req.params; //nombre que le pusimos en la ruta :id<--

  const { password , google,correo, ...resto } = req.body;

  //Todo validar contra base de datso

  if( password ) {
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate( id, resto )

  res.status(403).json({usuario})

}

const usuariosPatch = (req = request, res = response) => {

  res.status(403).json({
    ok: true,
    msg: 'patch API - controlador'
  })

}

const usuariosDelete = async(req = request, res = response) => {

  const { id } = req.params;

  //Fisicamente lo borramos

  // const usuario = await Usuario.findByIdAndDelete( id );

  //cambiar estado del usuario

  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

  res.status(403).json({ usuario })

}

module.exports = {
  getUsuarios,
  usuariosPosts,
  usuariosPut,
  usuariosPatch,
  usuariosDelete
}