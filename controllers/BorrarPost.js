const handleBorrarPost = (req, res, db) => {
    const { id } = req.params;
    db('posts').where({ id: id})
    .del()
    .then(res.json('borrado exitoso!'))
}


module.exports = {
    handleBorrarPost: handleBorrarPost
}