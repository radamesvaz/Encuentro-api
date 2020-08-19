const handleModificarVideo = (req, res, db) =>{
    const { id } = req.params;
     const { 
        video
        } = req.body;

               db('galeriaVideos').where({ id }).update({     
                video
             }).then(res.status(200).json('video actualizado'))
          
         
         }
 module.exports = {
     handleModificarVideo: handleModificarVideo
 }