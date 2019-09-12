const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const morgan =  require('morgan')
const songs = require('./models/Song');
const middleware = require('./middleware/authMiddleware');

//load env
dotenv.config({path:'./config.env'});

const app = express();

class HandleGenerator {
   login (req,res) {
      let username = req.body.username;
      let password = req.body.password;
      console.log(req.body);
      let mockedUsername = 'admin';
      let mockedPassword = 'password';
      if(username && password){
        if(username == mockedUsername && password == mockedPassword){
            let token = jwt.sign({username:username},process.env.SECRECT_KEY,{
              expiresIn: '24h' //expires in 24 hours
            })

            //return the JWT token for future Api calls
            res.json({
              success:true,
              message:'Authenticated successful',
              token:token,
              user: {
                firstName: 'Admin',
                lastName: 'User'
              }
            })
        }else{
          res.status(401).json({
            success: false,
            message: 'Incorrect username or password'
          })
        }
      }else{
         res.status(400).json({
           success: false,
           message: 'Authenticated filed! please checked'
         })
      }
   }

   index (req,res) {
     res.json({
       success: true,
       message: 'Index Page'
     })
   }

   getSongs (req,res) {
      res.json(songs)
   }
}

//middleware

if(process.env.NODE_ENV === 'development') {
   app.use(morgan('dev'))
}

app.use(cors())

app.use(bodyParser.urlencoded({
   extended: true
}))
app.use(bodyParser.json())

let handlers = new HandleGenerator();

//routes & handles
app.post('/api/login',handlers.login)
app.get('/api/songs',middleware.checkToken,handlers.getSongs)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
