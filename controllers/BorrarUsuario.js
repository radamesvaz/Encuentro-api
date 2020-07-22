const handleBorrarUsuario = (req, res, db) => {
    const { id } = req.params;
    db('registro').where({ id: id})
    .del()
    .then(res.json('borrado exitoso!'))
}


module.exports = {
    handleBorrarUsuario: handleBorrarUsuario
}