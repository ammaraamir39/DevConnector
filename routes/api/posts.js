const express = require('express');
const router = express.Router();
const Post = require('../../models/Posts');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const {check , validationResult} = require('express-validator');
const auth = require('../../middleware/auth');


//@route   POST api/post
//@desc   creating a post 
//@access  private


router.post('/',[auth,
  [check('text','Text field is required').not().isEmpty()]
  ] ,async(req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    res.status(400).json({errors:errors.array()});
  }

  try {
    const user = await User.findById(req.user.id);

    const newPost = new Post({
      text:req.body.text,
      name:user.name,
      avatar:user.avatar,
      user:req.user.id
    })

    const post = await newPost.save();

    res.json(post);


  } catch (error) {
    console.log(error.message),
    res.status(500).send('Server error');
  }
});

//@route   GET api/post
//@desc    getting all the posts of a single user 
//@access  private

router.get('/',auth, async (req, res)=>{
  try {
      const posts = await Post.find().sort({date:-1})
      res.json(posts);
  } catch (error) {
    console.log(error.message)
    res.status(500).send('Server')
  }
})

//@route   GET api/post/:id
//@desc    getting post of the user by the id 
//@access  private

router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if(!post){
      return res.status(400).json({msg:'No post found'})
    }

    res.json(post)
  } catch (error) {
    if(err.kind === 'ObjectId'){
      return res.status(400).json({ msg: 'No post found' });
    }
    console.log(error.message)
    res.status(500).send('Server')
  }
})


//@route   DELETE api/post/:id
//@desc    Deletig the post  
//@access  private

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({ msg: 'No post found' })
    }

    //check user
    if(post.user.toString() !== req.user.id){
      res.status(400).json({msg:'UnAuthorized user'})

    }

  await post.remove();    
    res.json({ msg:'Post Removed'});
  } catch (error) {
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'No post found' });
    }
    console.log(error.message)
    res.status(500).send('Server')
  }
})


//@route   likes api/post/likes/:id
//@desc    gathering likes 
//@access  private

router.put('/likes/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //check if already liked
    if(post.likes.filter(like=>like.user.toString() === req.user.id).length > 0){
        res.status(400).json({msg:'Post Already liked'})
    }
    
    post.likes.unshift({user:req.user.id})

    await post.save();

    res.json(post.likes)

  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'No post found' });
    }
    console.log(error.message)
    res.status(500).send('Server')
  }
})


//@route   likes api/post/unlike/:id
//@desc    gathering likes 
//@access  private

router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //check if already liked
    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
      res.status(400).json({ msg: 'Post not liked' })
    }

    const index = post.likes.map(like=>like.user.toString()).indexOf(req.user.id);

    post.likes.splice(index,1);

    

    await post.save();

    res.json(post.likes)

  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'No post found' });
    }
    console.log(error.message)
    res.status(500).send('Server')
  }
})



//@route   POST api/post/comment/:id
//@desc   commenting on a post
//@access  private


router.post('/comment/:id', [auth,
  [check('text', 'Text field is required').not().isEmpty()]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('inside')
    res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user.id);
    const post = await Post.findById(req.params.id);
   
    const newComment = {
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    }

    post.comments.unshift(newComment);

    await post.save();
    res.json(post.comments);


  } catch (error) {
    console.log(error.message),
      res.status(500).send('Server error');
  }
});

//@route   DELETE api/post/comment/:id/:comment_id
//@desc   deleting a comment
//@access  private

router.delete('/comment/:id/:comment_id',auth,async (req, res)=>{

    const post = await Post.findById(req.params.id);
    
    //pull out comment
    const comment = await post.comments.find(comment=>comment.id === req.params.comment_id);

    //check if commment exists
    if(!comment){
      res.status(400).json({msg:'No Comment'})
    }

    //check if user is deleting its own comment
    if(comment.user.toString() !== req.user.id){
      res.status(400).json({msg:'UnAuthorized , you cannot delete this comment'})
    }

    //deleting the comment

  const index = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);

  post.comments.splice(index,1);

    await post.save();

    res.json(post.comments)

})


module.exports = router;