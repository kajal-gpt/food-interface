var express = require('express')
var pool = require('./pool')
var upload=require('./multer')
var LocalStorage = require('node-localstorage').LocalStorage
var router = express.Router()



router.get('/frontpage', function(req, res, next){
    res.render('frontpage')
})

router.get('/foodinterface',function(req, res, next ){
    try{
    var admin=localStorage.getItem('ADMIN')
    if(admin)
    res.render('foodinterface',{status:-1,message:""})
        else
        res.render('loginpage',{message:""})
    }
    catch(e){
        res.render('loginpage',{message:""})
    }
})

router.get('/displayposter',function(req,res,next){
    res.render('displayposter',{data:req.query})
}) 

router.post('/edit_poster',upload.single('poster'),function(req,res){
    pool.query('update fooddetails set poster=? where foodid=?',[req.file.originalname,req.body.foodid ],function(error,result){
            if(error){
                console.log(error)
                res.redirect('/interface/fetch_food_show')
            }
            else{
                res.redirect('/interface/fetch_food_show')
            }
    })
})

router.get('/fetch_foodtype', function(req, res, next){
pool.query("select * from foodtype",function(error,result){
    if (error){
    res.status(500).json([])
    }
    else{
        res.status(200).json(result)
    }
    console.log(result) 
})
})

router.get('/fetch_hotel', function(req, res, next){
    pool.query("select * from hotels where foodtypeid=?",[req.query.foodtypeid],function(error,result){
        if (error){
        res.status(500).json([])
        }
        else{
            res.status(200).json(result)
        }
        console.log(result)
    })
    })

    router.get('/fetch_dish', function(req, res, next){
        pool.query("select * from dish where hotelsid=?",[req.query.hotelsid],function(error,result){
            if (error){
            res.status(500).json([])
            }
            else{
                res.status(200).json(result)
            }
            console.log(result)
        })
        })

        router.post('/submit_food',upload.single('poster'), function(req, res,next){
            console.log("BODY:",req.body)
        console.log("FILE:",req.file)
            pool.query("insert into fooddetails(foodtypeid,hotelsid,dishid,qty,prize,offer,date,time,status,poster)values(?,?,?,?,?,?,?,?,?,?)",[req.body.foodtypeid,req.body.hotelsid,req.body.dishid,req.body.qty,req.body.prize,req.body.offer,req.body.date,req.body.time,req.body.status,req.file.originalname],function(error,result){
                if(error){
                    console.log(error)
                    res.render('foodinterface',{status:0, message:'Server error'})
                }
                else{
                    console.log(result)
                    res.render('foodinterface',{status:1, message:'Data submitted successfully'})
                }

            })
        })
        
        router.get('/fetch_food_show',function(req,res){
            pool.query("SELECT FD.*,(SELECT FT.foodtypes FROM foodtype FT WHERE FT.foodtypeid = FD.foodtypeid) AS foodtype, (SELECT H.hotelname FROM hotels H WHERE H.hotelsid = FD.hotelsid) AS hotels,(SELECT D.dishname FROM dish D WHERE D.dishid = FD.dishid) AS dishes FROM fooddetails FD;",function(error,result){
            
                if(error){
                    console.log(result)
                    res.render('DisplayFood',{data:[]})
                }
                else{
                    console.log(result)
                    res.render('DisplayFood',{data:result})
                }
            })
        })
         
        router.get('/edit_food_data',function(req,res){
            pool.query("SELECT FD.*,(SELECT FT.foodtypes FROM foodtype FT WHERE FT.foodtypeid = FD.foodtypeid) AS foodtype, (SELECT H.hotelname FROM hotels H WHERE H.hotelsid = FD.hotelsid) AS hotels,(SELECT D.dishname FROM dish D WHERE D.dishid = FD.dishid) AS dishes FROM fooddetails FD WHERE FD.foodid=?;",[req.query.foodid],function(error,result){
            
                if(error){
                    console.log(result)
                    res.render('displayid',{data:[]})
                }
                else{
                    console.log(result)
                    res.render('displayid',{data:result[0]})
                }
            })
        })
        router.post('/edit_food_details', function(req, res,next){
            if(req.body.btn=='Edit'){
      
            pool.query("update fooddetails set foodtypeid=?,hotelsid=?,dishid=?,qty=?,prize=?,offer=?,date=?,time=?,status=? where foodid=?",[req.body.foodtypeid,req.body.hotelsid,req.body.dishid,req.body.qty,req.body.prize,req.body.offer,req.body.date,req.body.time,req.body.status,req.body.foodid],function(error,result){
                if(error){
                    console.log(error)
                    res.redirect('fetch_food_show')
                }
                else{
                    res.redirect('fetch_food_show')
                }

            })
        }
        else{
        pool.query("delete from fooddetails where foodid=?",[req.body.foodid],function(error,result){
            if(error){
                console.log(error)
                res.redirect('fetch_food_show')
            }
            else{
                res.redirect('fetch_food_show')
            }

        })
    }
        })

module.exports = router