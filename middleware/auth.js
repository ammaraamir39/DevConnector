const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req,res,next){
  //Get token from the header
  const token = req.header('x-auth-token');

  //check if no token
  if(!token){
    res.status(401).json({msg:'no token, Unauthorized'})
  }
  //verigfy the token 
  try{
    //jwt.verufy return the payload
    const decoded=jwt.verify(token, config.get('jwtToken'));
    req.user= decoded.user;
    next()
  }catch(err){
    res.status(401).json({msg:'token is not valid'})
  }
 


}