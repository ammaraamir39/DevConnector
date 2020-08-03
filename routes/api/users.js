const express = require('express');
const router = express.Router();
const { check , validationResult } = require('express-validator');
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const config= require('config');

//@route   POST api/users
//@desc    for registering users
//@access  public no authentication required


router.post('/',[
    check('name','Name is required').not().isEmpty(),
    check('email','Please include a valid email').isEmail(),
    check('password','Please enter a password with 6 or more characters').isLength({
      min:6
    })

],
async (req,res)=>{
  //validation result checks if there exists an error so it makes an array of errors
  const errors= validationResult(req);
  
  //if there exist any errors
  if(!errors.isEmpty()){
    res.status(400).json({
      error:errors.array()
    })
  }

  const {name, email, password } = req.body;

  try{


    let user = await User.findOne({email})

    //Checking if the user already exists
    if(user){
      res.status(400).json({errors:[{msg:"User allready present"}]})
    }

    //User avatar
    const avatar = gravatar.url(email,{
      s:'200',
      r:'pg',
      d:'mm'
    })
  
    //creating a user instance
    user = new User({
      name, email,password,avatar
    })


    //Encrypt password
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

    //jasonwebtokem as soon as the user registers w eneed to issue the token
    const payload={
      user:{
        id:user.id
      }
    };

    jwt.sign(payload, config.get('jwtToken'),
     {
      expiresIn:360000
    },
    (err,token)=>{
      if(err) throw err;
      res.json({token})
    });

  }catch(err){
    console.log(err.message)
    res.status(500).send('Server error')
  }
});

module.exports = router;