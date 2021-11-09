exports.getPosts = (req, res, next) => {
    //need to set the status so the client will know what to do with it.
    res.status(200).json(
        {posts: 
            [{title: 'First Post', 
            content: 'This is the first post'}]});


}

exports.postPosts = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;
    //create post in db
    res.status(201).json({ //201 = success; resource created
        message: 'Post created successfully',
        post: {id: new Date().toISOString().replace(':', '-'), title: title, content: content}
    })
}