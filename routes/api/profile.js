const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Post = require('../../models/Posts');
const auth = require('../../middleware/auth');
const { check , validationResult } = require('express-validator');
const request = require('request');
const config = require('config');
const { json } = require('express');

//@route   GET api/profile/me
//@desc    getting our own profile
//@access  private


router.get('/me',auth, async (req, res) => {
    try{

      const profile = await Profile.findOne({user:req.user.id}).populate('user',['name','avatar'])

      if(!profile){
        return res.status(401).json({msg:'there is no profile for this user'})
      }

      res.json(profile)

    }catch(err){
      console.log(err.message)
      res.status(501).send('Server error')
    }
});


//@route   POST api/profile
//@desc     posting a new profile or updating
//@access  private

router.post('/',[auth,[
  check('status','status is required').not().isEmpty(),
  check('skills','Skilset is required').not().isEmpty()
]], async (req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      res.status(400).json({errors:errors.array()});
    }
  
    const {
      company,
      bio,
      website,
      location,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram , 
      linkedin
    } = req.body;

    //build profile object
     const profileFields = {};

     profileFields.user = req.user.id;

    if (company) { profileFields.company = company} ;
    if(bio){ profileFields.bio=bio}
    if(status){ profileFields.status=status}
     if(githubusername) {profileFields.githubusername=githubusername};
    if(website) {profileFields.website=website};
    if(location) {profileFields.location=location};
    if(skills){
    
      profileFields.skills = skills.split(',').map(skill=>skill.trim())
    }

    //social object
    profileFields.social={}
    if(facebook) {
            profileFields.social.facebook=facebook}
    if(twitter) profileFields.social.twitter=twitter
    if(instagram) profileFields.social.instagram=instagram
    if(youtube) profileFields.social.youtube=youtube
    if(linkedin) profileFields.social.linkedin=linkedin

        try{

          //update
          let profile =await  Profile.findOne({user:req.user.id});
          if(profile){
            profile = await Profile.findOneAndUpdate({user:req.user.id},
                {$set:profileFields},
                {new:true}
              )
              console.log(profile.social)
              return res.json(profile)
          }

          //create

          profile = new Profile(profileFields);

          await profile.save()  
          res.json(profile)



    }catch(err){
      console.log(err.message);
      res.status(400).send(err)
    }

})

//@route   GET api/profile
//@desc    getting all the profiles
//@access  public

router.get('/',async(req,res)=>{
  
  try{


    let profiles = await Profile.find().populate('user', ['name', 'avatar'])

    res.json(profiles)
  }
  catch(err){
    console.log(err.message)
    res.status(500).json({msg:'Server error'})
  }
})

//@route   GET api/profile/user/:user_id
//@desc    getting the selected profile
//@access  public

router.get('/user/:user_id', async (req, res) => {

  try {


    let profile = await Profile.find({user:req.params.user_id}).populate('user', ['name', 'avatar'])
    if(!profile) res.status(400).json({msg:'There is no profile for this user'});


    res.json(profile)
  }
  catch (err) {
    //if we increase the digits in the user id so catch runs 
    //but it isnt the server error so we have to stop this

    if(err.kind == "ObjectId"){
      res.status(400).json({ msg: 'There is no profile for this user' });

    }
    
    console.log(err.message)

    res.status(500).json({msg:'Server error'})
  }
})


//@route   DELETE api/profile
//@desc    deleting profile and user
//@access  private

router.delete('/',auth , async (req, res) => {

  try {
    //deleting users posts
    await Post.deleteMany({user:req.user.id});
    //deleting profile
    await Profile.findOneAndRemove({user:req.user.id})

    //deleting user
    await User.findByIdAndRemove({_id:req.user.id})

    res.json({msg:"User Removed"})

  
  }
  catch (err) {
    console.log(err.message)
    res.status(500).send('Server error')
  }
})

//@route   PUT api/profile/experience
//@desc    Add profile experience
//@access  private

router.put('/experience',[auth,
  check('title','Title is required').not().isEmpty(),
  check('company','Company is required').not().isEmpty(),
  check('from','is requried').not().isEmpty()
],async (req,res)=>{
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    res.status(401).json({errors:errors.array()})
  }

  const {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  } = req.body

  const newExp={
    title,
    company,
    location,
    from,
    to,
    current,
    description
  }

  try {
    let profile=await Profile.findOne({user:req.user.id});
    //unshift is same as push it just inserts the elements to the start 
    //push inserts it in the end
    profile.experience.unshift(newExp);

    await profile.save();

    res.json(profile);
  } catch (error) {
    console.log(error.message)
    res.status(500).send('Server error');
  }
})

//@route   DELETE api/profile/experience/:experience_id
//@desc    delete an experience
//@access  private

router.delete('/experience/:experience_id',auth,async (req,res)=>{
  const profile =await  Profile.findOne({user:req.user.id});

  //it gives the index of the experience to be removed
  const removeIndex = profile.experience.map(item=>item.id).indexOf(req.params.experience_id);
  
  profile.experience.splice(removeIndex,1);

  await profile.save();

  res.json(profile);

})

//@route   PUT api/profile/education
//@desc    Add profile education
//@access  private

router.put('/education', [auth,
  check('school', 'School is required').not().isEmpty(),
  check('degree', 'Degree is required').not().isEmpty(),
  check('fieldofstudy', 'Field of Study is required').not().isEmpty(),
  check('from', 'is requried').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(401).json({ errors: errors.array() })
  }

  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  } = req.body

  const newEdu = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  }

  try {
    let profile = await Profile.findOne({ user: req.user.id });
    //unshift is same as push it just inserts the elements to the start 
    //push inserts it in the end
    profile.education.unshift(newEdu);

    await profile.save();

    res.json(profile);
  } catch (error) {
    console.log(error.message)
    res.status(500).send('Server error');
  }
})

//@route   DELETE api/profile/education/:education_id
//@desc    delete an education
//@access  private

router.delete('/education/:edu_id', auth, async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.id });

  //it gives the index of the experience to be removed
  const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

  profile.education.splice(removeIndex, 1);

  await profile.save();

  res.json(profile);

})

//@route   GET api/profile/github/:username
//@desc    get user repos from github
//@access  public

router.get('/github/:username',async (req, res) => {
  try {
    
    const options={
      uri:`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc
      &client_id=${config.get('githubClientid')}&client_secret=${config.get('githubSecretkey')}`,
      method:'GET',
      headers:{'user-agent':'node.js'}
    };

    request(options,(error,response,body)=>{
      if(error){
        console.log(error)
      }

      if(response.statusCode !== 200){
          res.status(404).json({msg:'No GitHub profile found'})
      }

      res.json(JSON.parse(body));
    })

  } catch (error) {
    console.log(error.message);
    res.status(500).send('server error')
  }

})


module.exports = router;