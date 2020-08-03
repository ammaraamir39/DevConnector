const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

//@route   GET api/auth
//@desc    for user profiles
//@access  public no authentication required


router.get('/',auth, async (req, res) => {
  //it gets the user by id without showig us ethe password
  //we saved the payload in req.user
  try{
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  }
  catch(err){
    console.log(err.message)
    res.status(500).send('Server error');
  }
  

});


//@route   POST api/auth
//@desc    for logging in users
//@access  public no authentication required


router.post('/', [
 
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter password').exists()

],
  async (req, res) => {
    //validation result checks if there exists an error so it makes an array of errors
    const errors = validationResult(req);

    //if there exist any errors
    if (!errors.isEmpty()) {
      res.status(400).json({
        error: errors.array()
      })
    }

    const { email, password } = req.body;

    try {


      let user = await User.findOne({ email })

      if(!user){
        res.status(401).json({
          errors:[{msg:'Invalid Credentials'}]
        })
      }

      //commparing the password

      const isMatched = await bcrypt.compare(password,user.password)

      if(!isMatched){
        res.status(401).json({
          errors:[
            {msg:'invalid Credentials'}
          ]
        })
      }

      //jasonwebtokem as soon as the user registers w eneed to issue the token
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(payload, config.get('jwtToken'),
        {
          expiresIn: 360000
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token })
        });

    } catch (err) {
      console.log(err.message)
      res.status(500).send('Server error')
    }
  });


module.exports = router;