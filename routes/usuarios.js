const { Router } = require('express');

const router = Router();
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { 
  getUsuarios, 
  usuariosPosts, 
  usuariosPut, 
  usuariosDelete, 
  usuariosPatch 
} = require('../controllers/usuarios');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');



router.get('/', getUsuarios);

router.put('/:id',[
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom( existeUsuarioPorId ),
  check('rol').custom(esRoleValido),
  validarCampos
], usuariosPut);

router.post('/',[
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('password', 'El password debe ser de mas de seis letras').isLength({ min: 6 }),
  check('correo').custom( emailExiste ),
  check('rol').custom( esRoleValido ),
  // check('rol', 'No es un rol permitido').isIn([ 'ADMIN_ROLE', 'USER_ROLE' ]),
  validarCampos
],usuariosPosts);

router.patch('/',usuariosPatch);

router.delete('/:id',[
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existeUsuarioPorId),
  validarCampos
], usuariosDelete);

module.exports = router;