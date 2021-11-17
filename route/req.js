const express = require('express')

const router = express.Router();


router.get('/',(req,res)=>{
  delete req.session.user;
  console.log(req.session)
  if(req.session.msg !=""){
    res.render('login',{
      msg: req.session.msg
    });
  } else{
    req.session.msg = "";
    res.render('login');
  }
})

router.get('/signup',(req,res)=>{
  if(req.session.msg !=""){
    res.render('signup',{
      msg: req.session.msg
    });
  } else{
    req.session.msg = "";
    res.render('signup');
  }
})

router.get('/authentication',(req,res)=>{
  if(req.session.msg !=""){
    res.render('authentication',{
      msg: req.session.msg
    });
  } else{
    req.session.msg = "";
    res.render('authentication');
  }
})

router.get('/policy',(req,res)=>{
  res.render('policies');
})
module.exports = router;