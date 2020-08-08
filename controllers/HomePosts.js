const handleHomePosts = (req, res, db) => {
    db.select().table('posts')
    .then(response => {
        return [].slice.call(arguments).sort(function(a,b){ 
            return b - a; 
          }); 

        //const ordenadoFecha = response.fecha.sort()
        /*
        for(let i = 0; i < response.length; i++){
            console.log(response[i].fecha.sort())
        }*/
        res.json(response)
    })
.catch(err => res.status(500).json('problema con la base de datos + ' + err))
}

module.exports = {
    handleHomePosts: handleHomePosts
}