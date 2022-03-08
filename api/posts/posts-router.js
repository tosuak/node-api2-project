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
module.exports = router;