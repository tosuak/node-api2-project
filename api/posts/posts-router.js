const router = require('express').Router();

const Post = require('./posts-model');

router.get('/', (req, res) => {
  Post.find()
    .then(posts => {
      res.json(posts);
    })
    .catch(err => {
      res.status(500).json({ message: 'The posts information could not be retrieved' });
    })
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  Post.findById(id)
  .then(post => {
    if (!post) {
      res.status(404).json({ message: 'The post with the specified ID does not exist' })
    } else {
      res.json(post);
    }
  })
  .catch(err => {
    res.status(500).json({ message: 'The post information could not be retrieved' });
  })
});

router.post('/', (req, res) => {
  const postContent = req.body;

  Post.insert(postContent)
    .then(post => {
      if(!postContent.title || !postContent.contents) {
        res.status(400).json({ message: 'Please provide title and contents for the post' });
      } else {
        Post.findById(post.id)
          .then(newPost => {
            res.status(201).json(newPost)
          })
          .catch(err => {
            console.log(err);
          }) 
      }
    })
    .catch(err => {
      console.log(!postContent)
      res.status(500).json({ message: 'There was an error while saving the post to the database' });
    })
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const postContent = req.body;

  Post.update(id, postContent)
    .then(updatedPost => {
      if (!updatedPost) {
        res.status(404).json({ message: 'The post with the specified ID does not exist'});
      } else {
      Post.findById(id)
        .then(post => {
          if(!postContent || !postContent.title || !postContent.contents) {
            res.status(400).json({ message: "Please provide title and contents for the post" });
          } else {
            res.json(post);
          }
        })
        .catch(err => {
          console.log(err);
        })
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'The post information could not be modified' });
    })
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  Post.findById(id)
    .then(post => {
      if(!post) {
        res.status(404).json({ message: 'The post with the specified ID does not exist' });
      } else {
        Post.remove(id)
        .then(delPost => {
          res.json(post);
        })
        .catch(err => {
          console.log(err);
        })
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'The post could not be removed'});
    })
});

router.get('/:id/comments', (req, res) => {
  const { id } = req.params;

  Post.findById(id)
    .then(post => {
      if (!post) {
        res.status(404).json({ message: 'The post with the specified ID does not exist' });
      } else {
        Post.findPostComments(post.id)
          .then(comment => {
            res.json(comment)
          })
          .catch(err => console.log(err))
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'The comments information could not be retrieved' });
    })
});

module.exports = router;