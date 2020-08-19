const handleAgregarVideo = (req, res, db) => {
    const { video } = req.body;
    db('galeriaVideos').insert({
        video   
     }).then(res.status(200).json('video agregado'))
       // id: urls[0].id
  

}

module.exports = {
    handleAgregarVideo: handleAgregarVideo
}