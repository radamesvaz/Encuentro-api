const handleModificarUsuario = (req, res, db, bcrypt) => {
    const { id } = req.params;
    const { usuario, password } = req.body;
    const hash = bcrypt.hashSync(password);
    
  /*  if( !usuario || !password){
        return res.status(400).json('por favor llena todos los campos');
    }*/
        db('registro').where({ id: id }).update({  
            usuario,
            hash
        })
        .then(res.status(200).json('usuario actualizado exitosamente'))
    
    .catch(err => res.status(400).json('no se pudo actualizar'));
}


module.exports = {
    handleModificarUsuario: handleModificarUsuario
}
