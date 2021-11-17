const express = require('express');
const db = require('../db/db');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const router = express.Router();


const ok = async (req, res, next) => {
  console.log(req.body);
  var cnt1 = 1;
  const {
    fname,
    email,
    pass,
    cpass
  } = req.body;
  console.log(email, fname, pass, cpass)

  db.query(
    "select email from user where email=?",
    [email],
    async (error, results) => {
      if (error) {
        console.log(error);
      }
      if (results.length > 0) {
        req.session.msg = "Email Already used"
        res.redirect('/signup')
      } else if (pass !== cpass) {
        req.session.msg = "Password do not match"
        res.redirect('/signup')
      } else {
        //console.log('Asche')
        req.session.msg = "";
        cnt1 = 1;
      }
    }
  );

  if (cnt1 == 1) {
    let hashedPassword = await bcrypt.hash(pass, 8);
    //let hashedPassword = pass
    console.log(hashedPassword);

    var digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: 'ecommerce.sdp@gmail.com',
        pass: '@#1234567890',
      },
    });

    let mailOptions = {
      from: "ecommerce.sdp@gmail.com",
      to: email,
      subject: "Verification code for Shoping.io profile.",
      text: "Your verification code is : " + OTP,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
        const user = {
          name: fname,
          email: email,
          OTP: OTP,
          pass: hashedPassword,
        };
        req.session.user = user
        console.log(req.session)

        next()
      }
    });
  }
}
router.post('/signup', ok, (req, res) => {
  res.redirect('/authentication')
})

const check = (req, res, next) => {

  console.log(req.body);
  const {
    OTP
  } = req.body;
 
  if (req.session.user.OTP === OTP) {
        db.query(
          "insert into user set ?", {
            fname: req.session.user.name,
            email: req.session.user.email,
            password: req.session.user.pass,
          },
          (error, results) => {
            if (error) {
              console.log(error);
            } else {
                req.session.msg = ""
                delete req.session.user;
                next();
            }
          }
        );
      } else {
        req.session.msg = "OTP do not match"
        res.redirect('/authentication')
      }
}
router.post('/verify', check, (req, res) => {
  res.redirect('/')
})

const logCheck = (req,res,next) =>{
  const {email,pass} = req.body;
  db.query("SELECT * from user WHERE email=?",[email],(error,result)=>{
    if(error){
      console.log(error)
    }else{
      if(result.length < 0){
        req.session.msg = "Email do not exist";
        res.redirect('/')
      }else{
        //const password = result[0].password;
        bcrypt.compare(pass, result[0].password).then((doMatch) => {
          if (doMatch) {
            console.log("login Successful");
            next()
          } else {
            req.session.msg = "Invalid Password!";
            res.redirect('/')
          }
        });
      }
    }
  })
}
router.post('/login',logCheck,(req,res)=>{
  res.redirect('http://localhost/Ecommerce-master');
})

module.exports = router;