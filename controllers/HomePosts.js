const handleHomePosts = (req, res, db) => {
    db.select().table('posts')
    .then(response => {
        res.json(response);
    })
.catch(err => res.status(500).json('problema con la base de datos + ' + err))
}

module.exports = {
    handleHomePosts: handleHomePosts
}