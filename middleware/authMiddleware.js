const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({path:'../config.env'})


const checkToken = (req,res,next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']
    if(!token) {
       return res.json({
         success:false,
         message: 'This route requires authentitation'
       })
    }

    if(token.startsWith('Bearer ')) {
      //Remove Bearer from string
      token = token.slice(7,token.length)
    }

    if(token) {
       jwt.verify(token,process.env.SECRECT_KEY,(err,decoded) => {
          if(err) {
            return res.json({
              success:false,
              message: 'Token is Invalid'
            })
          }else {
            req.decoded = decoded
            next();
          }
       })
    }
}

module.exports = {
  checkToken : checkToken
}
