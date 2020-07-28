const handleModificarPost = (req, res, db) =>{
    const { id } = req.params;
     const { 
        titulo,
        descripcion,
        fecha
        } = req.body;

               db('posts').where({ id: id }).update({     
                titulo,
                descripcion,
                fecha
             }).then(res.status(200).json('post actualizado'))
          
         
         }
 module.exports = {
     handleModificarPost: handleModificarPost
 }