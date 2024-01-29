var express = require('express')
var pool = require('./pool')
var upload = require('./multer') 
var router = express.Router()
var LocalStorage =require('node-localstorage').LocalStorage
localStorage = new LocalStorage('./scratch')

router.get('/logout',function(req,res){
    localStorage.clear()
    res.render('loginpage',{message:''})
})

router.get("/loginpage",function(req,res){
    try{
        var admin=localStorage.getItem('ADMIN')
        if(admin)
        res.render('loginpage',{message:""})
            else
            res.render('dashboard',{admin:JSON.parse(admin)})
        }
        catch(e){
            res.render('loginpage',{message:""})
        }
   
   })
   router.get('/dashboard',function(req,res){
    res.render('dashboard')
   })

router.post('/chk_admin_login',function(req,res){
    pool.query("select * from admin where (emailid=? or mobilenumber=?) and password=?",[req.body.emailid,req.body.mobilenumber,req.body.password],function(error,result){
        if(error)
        {

            console.log(error)

            res.render('loginpage',{message:'server error'})
        }

        else
        {
            if(result.length==0)
            {
                console.log(result.length)
                res.render('loginpage',{message:'Inavalid Emailid/Invalid Number/Invalid Password'})
            }
            else
            {
                localStorage.setItem('ADMIN',JSON.stringify(result[0]))
                res.render('dashboard',{admin:result[0]})
            }
        }
    })
  
})
module.exports = router;