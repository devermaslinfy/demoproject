var express = require('express');
var app = express();
var apiRoutes = express.Router();
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../api/config'); // get our config file
var User = require('../api/app/models/user'); // get our mongoose model
var Admin = require('../api/app/models/admin'); // get our mongoose model
var client = require('../api/app/models/client');
var likes = require('../api/app/models/likes');
var favorites = require('../api/app/models/favorites');
var categories = require('../api/app/models/categories');
var questions = require('../api/app/models/questions');
var businessTypes = require('../api/app/models/businessType');
var advertisements = require('../api/app/models/advertisements');
var mongoose = require('mongoose').set('debug', true);
var url = require('url');
var multer  = require('multer');
var formidable = require('formidable');
var util = require("util"); 
var async = require('async');
var fs = require("fs");
var path = require('path');
var nodemailer = require('nodemailer');
//var smtpTransport = require('nodemailer-smtp-transport');
var os = require("os");
app.set('superSecret', config.secret);
// Load the bcrypt module
var bcrypt = require('bcrypt');
// Generate a salt
//var salt = bcrypt.genSaltSync(10);
var SALT_WORK_FACTOR = 10;
// API ROUTES -------------------
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'public/images/user');
  },
  rename: function (req, file, callback) {
    callback(null, file.fieldname + '-'  + Date.now()+'.'+file.originalname.split('.')[1]);
  }
})
var upload = multer({ storage: storage });
var uploadnew = function (name) {
    try {
        // Configuring appropriate storage 
        var storage = multer.diskStorage({
            // Absolute path
            destination: function (req, file, callback) {
                callback(null, 'public/images/'+name);
            },
            // Match the field name in the request body
/*            filename: function (req, file, callback) {
                 callback(null, file.fieldname + '-'  + Date.now()+'.'+file.mimetype.split('/')[1]);
            }*/
            rename: function (req, file, callback) {
                callback(null, file.fieldname + '-'  + Date.now()+'.'+file.originalname.split('.')[1]);
              }
        });
        return storage;
    } catch (ex) {
        console.log("Error :\n"+ex);
    }
}
apiRoutes.post('/forgotpass',function(req, res){

    Admin.findOne({email:req.body.email}, function(err, admin) {
        if (err) {
            res.json({ status: err, message: 'Unknown' })
        } 

        if (admin) {
            //var transporter = nodemailer.createTransport('smtps://deverma.slinfy@gmail.com:mind@123@smtp.gmail.com');
            var smtpConfig = {
                host: 'smtp.gmail.com',
                port: 465,
                secure: true, // use SSL
                auth: {
                    user: 'deverma.slinfy@gmail.com',
                    pass: 'mind@123'
                }
            };
            var transporter = nodemailer.createTransport(smtpConfig);
            var hostname = req.get('host');
            console.log('hostname'+hostname);
            var text = 'Hello world from \n\n' + 'deverma';
            var mailOptions = {
                from: 'deverma.slinfy@gmail.com', // sender address
                to: req.body.email, // list of receivers
                subject: 'Forgot Password Link', // Subject line
                text: text, //, // plaintext body
                html: 'Hello '+admin.name+'<br><br> <b>Please click on this link to reset password <a href="'+req.protocol+'://'+hostname+'/\#/resetpass/'+admin._id+'">Click Here</a><br><br> Thanks & Regards,<br><br> Tan App' // You can choose to send an HTML body instead
            };
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    console.log(error);
                    res.json({ status: 102, message: error })
                }else{
                    console.log('Message sent: ' + info.response);
                    res.json({ status: 100, message: 'Ok' })
                };
            });
        } 
        else {
            res.json({ status: 102, message: 'Unknown' })
        }
    });

})
apiRoutes.post('/resetpass',function(req, res){
    var password = req.body.password;
    var id = req.body.id;
    Admin.findOne({_id : id}, function(err, admin) {
            bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
                bcrypt.hash(password, salt, function(err, hash) {
                    if(err){
                        console.log(err);
                        res.json({ status: 102, message: 'Unknown' })
                    }
                    admin['password'] = hash;
                    //res.json({ status: 100, message: 'Ok' })
                    admin.update(admin,function(err,usr) {
                        if (err) {
                            res.json({ status: 102, message: 'Unknown' })
                            //res.json({ status: 102, message: 'Unknown' })
                        } else {
                            res.json({ status: 100, message: 'Ok' })
                        }

                    })
                });
            });
    });
});
apiRoutes.get('/checkEmail', function(req, res) {
	 //var queryObject = url.parse(req.url,true).query;
  //console.log(queryObject)
	var email = req.query.email;
    Admin.findOne({email:email}, function(err, admin) {
	    if (err) {
	        res.json({ status: 102, message: 'Unknown' })
	    } 

        if (!admin) {
            res.json({ status: 102, message: 'Unknown' });
        } 
	    else {
	        res.json({ status: 100, message: 'Ok' })
	    }
    });
});
apiRoutes.get('/checkEmailForgot', function(req, res) {
     //var queryObject = url.parse(req.url,true).query;
  //console.log(queryObject)
    var email = req.query.email;
    Admin.findOne({email:email}, function(err, admin) {
        if (err) {
            res.json({ status: 102, message: 'Unknown' })
        } 

        if (!admin) {
            res.json({ status: 102, message: 'Unknown' });
        } 
        else {
            res.json({ status: 100, message: 'Ok' })
        }
    });
});
apiRoutes.get('/checkEmailEdit', function(req, res) {
     //var queryObject = url.parse(req.url,true).query;
  //console.log(queryObject)
    var email = req.query.email;
    var value = req.query.value;
    if(email != value && value != ''){
        Admin.findOne({$and:[{email:email},{email:{$ne:value}}]}, function(err, user) {
            if (err) {
                res.json({ status: 102, message: 'Unknown' })
            } 

            if (!user) {
                res.json({ status: 100, message: 'ok' });
            } 
            else {
                res.json({ status: 101, message: 'Duplicate' })
            }
        });
    } else {
        res.json({ status: 100, message: 'ok' });
    }
});
apiRoutes.get('/adminCheckEmail', function(req, res) {
     //var queryObject = url.parse(req.url,true).query;
  //console.log(queryObject)
    var email = req.query.email;
    Admin.findOne({email:email}, function(err, admin) {
        if (err) {
            res.json({ status: 102, message: 'Unknown' })
        } 

        if (!admin) {
            res.json({ status: 100, message: 'Ok' });
        } 
        else {
            res.json({ status: 102, message: 'Unknown' })
        }
    });
});
apiRoutes.get('/userCheckEmail', function(req, res) {
	 //var queryObject = url.parse(req.url,true).query;
  //console.log(queryObject)
	var email = req.query.email;
    User.findOne({email:email}, function(err, user) {
	    if (err) {
	        res.json({ status: 102, message: 'Unknown' })
	    } 

        if (!user) {
            res.json({ status: 100, message: 'ok' });
        } 
	    else {
	        res.json({ status: 101, message: 'Duplicate' })
	    }
    });
});
apiRoutes.get('/userCheckEmailUpdate', function(req, res) {
     //var queryObject = url.parse(req.url,true).query;
  //console.log(queryObject)
    var email = req.query.email;
    var value = req.query.value;
    if(email != value){
        User.findOne({$and:[{email:email},{email:{$ne:value}}]}, function(err, user) {
            if (err) {
                res.json({ status: 102, message: 'Unknown' })
            } 

            if (!user) {
                res.json({ status: 100, message: 'ok' });
            } 
            else {
                res.json({ status: 101, message: 'Duplicate' })
            }
        });
    } else {
        res.json({ status: 100, message: 'ok' });
    }

});
apiRoutes.get('/ckeckOldPassword', function(req, res) {
     //var queryObject = url.parse(req.url,true).query;
  //console.log(queryObject)
    var password = req.query.password;
    var id = req.query.id;
    Admin.findOne({_id : id}, function(err, admin) {
            bcrypt.compare(password, admin.password, function(err, resp) {
                // res === true
                if(err){
                    res.json({ status: 102, message: 'Unknown' })
                }
                // if user is found and password is right
                // create a token
                if(resp == true) {
                    res.json({ status: 100, message: 'Ok' })
                } else {
                    res.json({ status: 102, message: 'Unknown' })
                }

            });
    });

});
apiRoutes.post('/updateAdminPassword',function(req, res){
    var password = req.body.password;
    var id = req.body.id;
    Admin.findOne({_id : id}, function(err, admin) {
            bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
                bcrypt.hash(password, salt, function(err, hash) {
                    if(err){
                        console.log(err);
                        res.json({ status: 102, message: 'Unknown' })
                    }
                    admin['password'] = hash;
                    //res.json({ status: 100, message: 'Ok' })
                    admin.update(admin,function(err,usr) {
                        if (err) {
                            res.json({ status: 102, message: 'Unknown' })
                            //res.json({ status: 102, message: 'Unknown' })
                        } else {
                            res.json({ status: 100, message: 'Ok' })
                        }

                    })
                });
            });
    });
});
apiRoutes.post('/addAdmin',function(req, res) {
    //res.json({res:req.file})
    newAdmin = req.body.data;
    Admin.findOne({
        email: newAdmin.email
    }, function(err, admin) {
        if (err) {
            res.json({ message: err, status: 403 })
        }
        if (admin) {
            console.log(admin);
            res.json({ message: 'Duplicate', status: 101 })
        } else if (!admin) {
            var password = newAdmin.password;
            bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
                bcrypt.hash(password, salt, function(err, hash) {
                    if(err){
                        console.log(err);
                        res.json(err);
                    }
                    var adm = new Admin({
                        email: newAdmin.email,
                        name: newAdmin.name,
                        password: hash,
                        //questions: req.body.user.questions,
                        //add_date: req.body.add_date,
                        //last_edit: req.body.last_edit,
                        login_type:1,
                        admin_type: (newAdmin.admin_type) ? newAdmin.admin_type : 2,
                        status: (newAdmin.status) ? newAdmin.status : 2
                    })
                    //res.json({ status: 100, message: 'Ok' })
                    adm.save(function(err) {
                        if (err) {
                            //res.json(err)
                            res.json({ status: 102, message: 'Unknown' })
                        } else {
                            res.json({ status: 100, message: 'Ok' })
                        }

                    })
                });
            });
        }
    })
});
apiRoutes.post('/updateAdmin', function (req, res, next) {
    //var newCategory = JSON.parse(req.body.category);
    if (req.body.data.email == null || undefined  ) {
           //res.json({ status: 200, message: 'Please send peremeters Validation Error ' });
           res.json({ status: 102, message: 'Unknown' })
    } else {
        newAdmin = req.body.data;
        Admin.findOne({
            _id: newAdmin._id,
        }, function(err, admin) {
            if (err) throw err;
            if (admin) {
                if(newAdmin.password){
                    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
                        bcrypt.hash(newAdmin.password, salt, function(err, hash) {
                            if(err){
                                console.log(err);
                                res.json(err);
                            }
                            newAdmin['password'] = hash;
                            newAdmin['admin_type'] =  (newAdmin.admin_type) ? newAdmin.admin_type : 2,
                            newAdmin['status'] = (newAdmin.status) ? newAdmin.status : 2
                            admin.update(newAdmin,function(err) {
                                if (err) {
                                    res.json({ status: err, message: 'Unknown' })
                                } else {
                                    res.json({ status: 100, message: 'Ok' })
                                }
                            })
                        });
                    });
                } else {
                    newAdmin['admin_type'] =  (newAdmin.admin_type) ? newAdmin.admin_type : 2,
                    newAdmin['status'] = (newAdmin.status) ? newAdmin.status : 2
                    admin.update(newAdmin,function(err) {
                        if (err) {
                            res.json({ status: err, message: 'Unknown' })
                        } else {
                            res.json({ status: 100, message: 'Ok' })
                        }
                    })
                }
            }
        });
    }
})
apiRoutes.get('/admins', function(req, res) {
/*    Admin.find({"admin_type":"2"}).exec(function(error, admins) {
                res.json(admins);
            });*/
        Admin.find({}, function(err, admins) {
        res.json(admins);
    });
});
apiRoutes.get('/admin/:id', function(req, res) {
        var idString = req.params.id;
        id = new mongoose.Types.ObjectId(idString)
        console.log(id);
        Admin.findOne({"_id":id },{password:0},function(err, admin) {
        if (err) {
            //res.json(err)
            res.json({ status: 102, message: 'Unknown' })
        } else {
            res.json({ status: 100, message: 'Ok','admin':admin })
        }
        });
});
apiRoutes.get('/deleteAdmin/:id', function(req, res) {
        console.log(req.params.id);
        var idString = req.params.id;
        id = new mongoose.Types.ObjectId(idString)
        Admin.find({"_id" : id }).remove().exec(
                function(err, user) {
                    //console.log(user);
                    if (err) {
                        res.json({ status: 102, message: 'Unknown' })
                    } else {
                        res.json({ status: 100, message: 'Ok' })
                    }
                })
})
apiRoutes.post('/register',upload.single('avtar'),function(req, res) {
    //res.json({res:req.file})
    console.log(req.body.user)
    newUser = req.body.user;
    var image = '';
/*    upload(req,res,function(err) {
        //console.log(req.body);
        image: req.file.filename;
    });   */
    //console.log(req.body);
    User.findOne({
        email: newUser.email
    }, function(err, user) {
        if (err) {
            res.json({ message: err, status: 403 })
        }
        if (user) {
            console.log(user);
            res.json({ message: 'Duplicate', status: 101 })
        } else if (!user) {
            bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
                bcrypt.hash(newUser.password, salt, function(err, hash) {
                    if(err){
                        console.log(err);
                        res.json(err);
                    }
                    // upload image
                    //var newImage = "images/user/"+app.settings.id;
/*                    var newPath = __dirname + "/images/user"+"_"+app.settings.id;
                    fs.writeFile(newPath, req.files.avtar, function (err) {
                        if (err) throw err;
                        console.log("It's saved");
                    });*/
                     // Store hash in your password DB.
                    var usr = new User({
                        email: newUser.email,
                        name: newUser.name,
                        password: hash,
                        avtar: (typeof req.file !== "undefined") ? req.file.filename: undefined,
                        age: (newUser.age) ? newUser.age:undefined,
                        //questions: req.body.user.questions,
                        //add_date: req.body.add_date,
                        //last_edit: req.body.last_edit,
                        login_type: 1,
                        status: (newUser.status) ? newUser.status : 3
                    })
                    //res.json({ status: 100, message: 'Ok' })
                    usr.save(function(err) {
                        if (err) {
                            //res.json(err)
                            res.json({ status: 102, message: 'Unknown' })
                        } else {
                            res.json({ status: 100, message: 'Ok' })
                        }

                    })
                });
            });
        }
    })
});
apiRoutes.post('/updateUser',upload.single('avtar'),function(req, res) {
    //res.json({res:req.file})
   
    var newUser = req.body.user;
    var image = '';
    if(newUser['questions']){
        delete newUser['questions'];
        delete newUser['answer'];
    }
    newUser['last_login'] = new Date(newUser.last_login)
/*    upload(req,res,function(err) {
        //console.log(req.body);
        image: req.file.filename;
    });   */
   // console.log(req.file.filename);
   // User.update({"email" : newUser.email },{$set:{"last_login":new Date(newUser.last_login)}});
    User.findOne({
        _id: newUser._id
    }, function(err, user) {
        if (err) {
            res.json({ message: err, status: 403 })
        } else {

/*                user['name'] = newUser.name;
                user['email'] = newUser.email;
                user['age'] = newUser.age;
                user['status'] = newUser.status;*/
                if (typeof req.file !== "undefined") {
                    //user['avtar']  = req.file.filename;
                    newUser['avtar']  = req.file.filename;
                } else {
                    //user['avtar']  = user.avtar; 
                    newUser['avtar']  = user.avtar;
                }
                if (typeof newUser.password !== "undefined"){
                    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
                        bcrypt.hash(newUser.password, salt, function(err, hash) {
                            if(err){
                                console.log(err);
                                res.json(err);
                            }
                            //user['password'] = hash;
                            newUser['password']=hash;
                        //console.log('inner'); 
                        // update the user
                        user.update(newUser,function(err) {
                            if (err) {
                                res.json({ status: 102, message: 'Unknown' })
                            } else {
                                res.json({ status: 100, message: 'Ok' })
                            }

                        });
                            console.log(hash);
                        });
                    });
                } else {
                    //console.log('outer');  
                    // update the user
                    user.update(newUser,function(err) {
                        if (err) {
                            res.json({ status: 102, message: 'Unknown' })
                        } else {
                            res.json({ status: 100, message: 'Ok' })
                        }

                    });
                }

        }

    })
});
apiRoutes.get('/deleteUser/:id', function(req, res) {
        console.log(req.params.id);
        var idString = req.params.id;
        id = new mongoose.Types.ObjectId(idString)
        User.find({"_id" : id }).remove().exec(
                function(err, user) {
                    //console.log(user);
                    if (err) {
                        res.json({ status: 102, message: 'Unknown' })
                    } else {
                        res.json({ status: 100, message: 'Ok' })
                    }
                })
            /*  User.findOne({
                email: req.body.email
              },function(err, user){*/
})
apiRoutes.get('/statusUser/:id', function(req, res) {
    console.log(req.params.id);
    var idString = req.params.id;
    id = new mongoose.Types.ObjectId(idString)
    User.findOne({"_id" : id },function(err,user) {
        if (err) {
            res.json({ status: 102, message: 'Unknown' })
        } else {
            if(user.status == 1){
                user.status = 2;
            }else if(user.status == 2){
                user.status = 1;
            }else{
                //user.status = user.status;
                user.status = 1;
            }
            user.update(user,function(err) {
                if (err) {
                    res.json({ status: 102, message: 'Unknown' })
                } else {
                    res.json({ status: 100, message: 'Ok' })
                }
            })
        }
    })
})
apiRoutes.post('/addCategory', multer({ storage: uploadnew('category') }).single('avtar'), function (req, res, next) {
    var newCategory = req.body.category;
    console.log(newCategory)
    if (newCategory.name == null || undefined ) {
           //res.json({ status: 200, message: 'Please send peremeters Validation Error ' });
           res.json({ status: 102, message: 'Unknown' })
        }
        else{
        categories.findOne({
            name: newCategory.name,
        }, function(err, category) {
            if (err) throw err;
            if (category) {
                res.json({ message: 'Duplicate', status: 101 })
            } else if (!category) {
                console.log(req.file);
                var cat = new categories({
                    name: newCategory.name,
                    image_url: (typeof req.file !== "undefined") ? req.file.filename: undefined,
                    //add_date: req.body.add_date,
                    status: (newCategory.status) ? newCategory.status: 2

                })
                cat.save(function(err) {
                    if (err) {
                        res.json({ status: 102, message: 'Unknown' })
                    } else{
                        res.json({ status: 100, message: 'Ok' })
                    }
                })
            }
        });
    }
})
apiRoutes.post('/updateCategory', multer({ storage: uploadnew('category') }).single('avtar'), function (req, res, next) {
    //var newCategory = JSON.parse(req.body.category);
    var newCategory = req.body.category;
    console.log(newCategory)
    if (newCategory.name == null || undefined  ) {
           //res.json({ status: 200, message: 'Please send peremeters Validation Error ' });
           res.json({ status: 102, message: 'Unknown' })
    } else {
        categories.findOne({
            _id: newCategory._id,
        }, function(err, category) {
            if (err) throw err;
            if (category) {
                if (typeof req.file !== "undefined") {
                    //user['avtar']  = req.file.filename;
                    newCategory['image_url']  = req.file.filename;
                } else {
                    //user['avtar']  = user.avtar; 
                    newCategory['image_url']  = category.image_url;
                }
                category.update(newCategory,function(err) {
                    if (err) {
                        res.json({ status: 102, message: 'Unknown' })
                    } else {
                        res.json({ status: 100, message: 'Ok' })
                    }
                })
            }
        });
    }
})
/*apiRoutes.get('/deleteCategory/:id', function(req, res) {
        console.log(req.params.id);
        var idString = req.params.id;
        id = new mongoose.Types.ObjectId(idString)
        categories.find({"_id" : id }).remove().exec(
                function(err, user) {
                    //console.log(user);
                    if (err) {
                        res.json({ status: 102, message: 'Unknown' })
                    } else {
                        res.json({ status: 100, message: 'Ok' })
                    }
                })
})*/
apiRoutes.get('/deleteCategory/:id', function(req, res) {
        console.log(req.params.id);
        var idString = req.params.id;
        id = new mongoose.Types.ObjectId(idString)
        categories.findOne({"_id" : id },function(err, category) {
                    //console.log(user);
                    category.is_deleted = 1;
                    category.update(category,function(err) {
                        if (err) {
                            res.json({ status: 102, message: 'Unknown' })
                        } else {
                            res.json({ status: 100, message: 'Ok' })
                        }
                    })
                })
})
apiRoutes.get('/statusCategory/:id', function(req, res) {
    console.log(req.params.id);
    var cat ={};
    var idString = req.params.id;
    id = new mongoose.Types.ObjectId(idString)
    categories.findOne({"_id" : id },function(err,category) {
        if (err) {
            res.json({ status: 102, message: 'Unknown' })
        } else {
            console.log(category.show)
            category.show = category.show ? 0 : 1;
            category.update(category,function(err) {
                if (err) {
                    res.json({ status: 102, message: 'Unknown' })
                } else {
                    res.json({ status: 100, message: 'Ok' })
                }
            })
        }
    })
})
apiRoutes.get('/category/:id', function(req, res) {
    console.log(req.params.id);
    var idString = req.params.id;
    id = new mongoose.Types.ObjectId(idString)
    categories.find({"_id" : id }, function(err, category) {
        if(err){
            res.json({status: 102, message: 'Unknown'});
        }else{
            res.json({status: 100, message: 'Ok', category:category});
        }

    });
});
apiRoutes.get('/checkcategory', function(req, res) {
    var name = req.query.name;
    categories.findOne({"name" : name }, function(err, category) {
        console.log(category);
        if(err) {
            res.json({status: 102, message: 'Unknown'});

        } else if (!category) {
            res.json({ status: 100, message: 'ok' });
        } 
        else {
            res.json({ status: 101, message: 'Duplicate' })
        }
    });
});
apiRoutes.get('/editcheckcategory', function(req, res) {
     //var queryObject = url.parse(req.url,true).query;
  //console.log(queryObject)
    var name = req.query.name;
    var value = req.query.value;
    if(name != value){
        categories.findOne({$and:[{name:name},{name:{$ne:value}}]}, function(err, category) {
            if (err) {
                res.json({ status: 102, message: 'Unknown' })
            } 

            if (!category) {
                res.json({ status: 100, message: 'ok' });
            } 
            else {
                res.json({ status: 101, message: 'Duplicate' })
            }
        });
    } else {
        res.json({ status: 100, message: 'ok' });
    }

});
apiRoutes.get('/checkbuisness', function(req, res) {
    var name = req.query.name;
    businessTypes.findOne({"name" : name }, function(err, business) {
        console.log(business);
        if(err) {
            res.json({status: 102, message: 'Unknown'});

        } else if (!business) {
            res.json({ status: 100, message: 'ok' });
        } 
        else {
            res.json({ status: 101, message: 'Duplicate' })
        }
    });
});
apiRoutes.post('/addBusiness', function (req, res, next) {
    console.log(req.body.data)
    if (req.body.data.name == null || undefined ) {
           //res.json({ status: 200, message: 'Please send peremeters Validation Error ' });
           res.json({ status: 102, message: 'Unknown' })
        }
        else{
        businessTypes.findOne({
            name: req.body.data.name,
        }, function(err, business) {
            if (err) throw err;
            if (business) {
                res.json({ message: 'Duplicate', status: 101 })
            } else if (!business) {
                var busi = new businessTypes({
                    name: req.body.data.name

                })
                busi.save(function(err) {
                    if (err) {
                        res.json({ status: 102, message: 'Unknown' })
                    } else{
                        res.json({ status: 100, message: 'Ok' })
                    }
                })
            }
        });
    }
})
apiRoutes.get('/business/:id', function(req, res) {
    console.log(req.params.id);
    var idString = req.params.id;
    id = new mongoose.Types.ObjectId(idString)
    businessTypes.find({"_id" : id }, function(err, business) {
        if(err){
            res.json({status: 102, message: 'Unknown'});
        }else{
            res.json({status: 100, message: 'Ok', business:business});
        }

    });
});
apiRoutes.get('/checkUnique', function(req, res) {
    var name = req.query.name;
    var model = req.query.model;
    var field = req.query.field;
    //var model = [];
    var modell = function (model){ return model;}
    if(field === 'question') {
        eval(modell(model)).findOne({question: name }, function(err, model) {
            console.log('question'+model)
            if(err) {
                res.json({status: 102, message: 'Unknown'});

            } else if (!model) {
                res.json({ status: 100, message: 'ok' });
            } 
            else {
                res.json({ status: 101, message: 'Duplicate' })
            }
        });
    } else {
        console.log('another'+model)
        eval(modell(model)).findOne({name: name }, function(err, model) {
            console.log(model);
            if(err) {
                res.json({status: 102, message: 'Unknown'});

            } else if (!model) {
                res.json({ status: 100, message: 'ok' });
            } 
            else {
                res.json({ status: 101, message: 'Duplicate' })
            }
        });
    }

});
apiRoutes.get('/editCheckUnique', function(req, res) {
     //var queryObject = url.parse(req.url,true).query;
  //console.log(queryObject)
    var model = req.query.model;
    //var model = [];
    var modell = function (model){ return model;}
    var field = req.query.field;
    var name = req.query.name;
    var value = req.query.value;
    console.log('editCheckUnique');
    if(name != value && value != ''){
        if(field == 'question') {
            console.log('question'+model)
            eval(modell(model)).findOne({$and:[{question:name},{field:{$ne:value}}]}, function(err, business) {
                if (err) {
                    res.json({ status: 102, message: 'Unknown' })
                } 

                if (!business) {
                    res.json({ status: 100, message: 'ok' });
                } 
                else {
                    res.json({ status: 101, message: 'Duplicate' })
                }
            });
        } else {
            console.log('another'+model)
            eval(modell(model)).findOne({$and:[{name:name},{field:{$ne:value}}]}, function(err, business) {
                if (err) {
                    res.json({ status: 102, message: 'Unknown' })
                } 

                if (!business) {
                    res.json({ status: 100, message: 'ok' });
                } 
                else {
                     res.json({ status: 101, message: 'Duplicate' })
                }
            });
        }

    } else {
        res.json({ status: 100, message: 'ok' });
    }

});
apiRoutes.post('/updateBusiness', function (req, res, next) {
    //var newCategory = JSON.parse(req.body.category);
    if (req.body.data.name == null || undefined  ) {
           //res.json({ status: 200, message: 'Please send peremeters Validation Error ' });
           res.json({ status: 102, message: 'Unknown' })
    } else {
        businessTypes.findOne({
            _id: req.body.data._id,
        }, function(err, business) {
            if (err) throw err;
            if (business) {
                business.name = req.body.data.name;
                business.update(business,function(err) {
                    if (err) {
                        res.json({ status: 102, message: 'Unknown' })
                    } else {
                        res.json({ status: 100, message: 'Ok' })
                    }
                })
            }
        });
    }
})
apiRoutes.get('/deleteBusiness/:id', function(req, res) {
        console.log(req.params.id);
        var idString = req.params.id;
        id = new mongoose.Types.ObjectId(idString)
        businessTypes.find({"_id" : id }).remove().exec(
                function(err, user) {
                    //console.log(user);
                    if (err) {
                        res.json({ status: 102, message: 'Unknown' })
                    } else {
                        res.json({ status: 100, message: 'Ok' })
                    }
                })
})
apiRoutes.post('/addQuestion', function (req, res, next) {
    console.log(req.body.data.question)
    if (req.body.data.question == null || undefined ) {
           //res.json({ status: 200, message: 'Please send peremeters Validation Error ' });
           res.json({ status: 102, message: 'Unknown' })
        }
        else{
        questions.findOne({
            name: req.body.data.question,
        }, function(err, question) {
            if (err) throw err;
            if (question) {
                res.json({ message: 'Duplicate', status: 101 })
            } else if (!question) {
                var quest = new questions({
                    question: req.body.data.question,
                    answer:req.body.data.answer

                })
                quest.save(function(err) {
                    if (err) {

                        res.json({ status: err, message: 'Unknown' })
                    } else{
                        res.json({ status: 100, message: 'Ok' })
                    }
                })
            }
        });
    }
})
apiRoutes.get('/question/:id', function(req, res) {
    console.log(req.params.id);
    var idString = req.params.id;
    id = new mongoose.Types.ObjectId(idString)
    questions.find({"_id" : id }, function(err, question) {
        if(err){
            res.json({status: 102, message: 'Unknown'});
        }else{
            res.json({status: 100, message: 'Ok', question:question});
        }

    });
});
apiRoutes.post('/updateQuestion', function (req, res, next) {
    console.log('answer');
    console.log(req.body.data.answer);
    //var newCategory = JSON.parse(req.body.category);
    if (req.body.data.question == null || undefined  ) {
           //res.json({ status: 200, message: 'Please send peremeters Validation Error ' });
           res.json({ status: 102, message: 'Unknown' })
    } else {
        questions.findOne({
            _id: req.body.data._id,
        }, function(err, question) {
            if (err) throw err;
            if (question) {
                question.question = req.body.data.question;
                question.answer = req.body.data.answer;
                question.update(question,function(err) {
                    if (err) {
                        res.json({ status: 102, message: 'Unknown' })
                    } else {
                        res.json({ status: 100, message: 'Ok' })
                    }
                })
            }
        });
    }
})
apiRoutes.get('/deleteQuestion/:id', function(req, res) {
        console.log(req.params.id);
        var idString = req.params.id;
        id = new mongoose.Types.ObjectId(idString)
        questions.find({"_id" : id }).remove().exec(
                function(err, user) {
                    //console.log(user);
                    if (err) {
                        res.json({ status: 102, message: 'Unknown' })
                    } else {
                        res.json({ status: 100, message: 'Ok' })
                    }
                })
})
apiRoutes.get('/questions', function(req, res) {
    var locals = [];
    var all_questions = [];
    var obj = {};
    var name = req.params.name;
    var userId; //Define `userId` out here, so both tasks can access the variable
    async.series([
        //Load user to get `userId` first
        function(callback) {
            questions.find({}, function(err, question) {
                if (err) return callback(err);
                //Check that a user was found
                if (question.length == 0) {
                    return callback(new Error('No question found.'));
                }
                    
                    all_questions = question;
                    locals.push({'question':question});
                callback();
            });
        },
                //Load posts and photos in parallel (won't be called before task 1's "task callback" has been called)
        function(callback) {
                User.find({ questions: { '$in': all_questions } },function(err, user) {
                //User.find().where('questions').in([ques.id]).exec(function(err, user) {
                  //ques.users = user;
                  locals.push({'users':user});
                  callback();
                });
        }

    ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
        if (err) return next(err);
        //Here locals will be populated with `user` and `posts`
        //Just like in the previous example
        console.log(locals);
        res.json(locals);
    });

});
apiRoutes.post('/addClient', multer({ storage: uploadnew('client') }).single('avtar'), function (req, res, next) {
    var newClient = req.body.client;
    console.log(newClient)
    if (newClient.name == null || undefined ) {
           //res.json({ status: 200, message: 'Please send peremeters Validation Error ' });
           res.json({ status: 102, message: 'Unknown' })
        }
        else{
        client.findOne({
            name: newClient.name,
        }, function(err, clients) {
            if (err) throw err;
            if (clients) {
                res.json({ message: 'Duplicate', status: 101 })
            } else if (!clients) {
                console.log(req.file);

                var clint = new client({
                    name: newClient.name,
                    image_url: (typeof req.file !== "undefined") ? req.file.filename: undefined,
                    category: (newClient.category) ? new mongoose.Types.ObjectId(newClient.category) : undefined,
                    business_type: new mongoose.Types.ObjectId(newClient.business_type),
                    description: newClient.description,
                    phone: (newClient.phone) ? newClient.phone : undefined,
                    latitude : (newClient.latitude) ? newClient.latitude : undefined,
                    longitute : (newClient.longitute) ? newClient.longitute : undefined,
                    address: newClient.address

                })
                clint.save(function(err) {
                    if (err) {
                        res.json({ status: 102, message: err })
                    } else{
                        res.json({ status: 100, message: 'Ok' })
                    }
                })
            }
        });
    }
})
apiRoutes.get('/client/:id', function(req, res) {
    console.log(req.params.id);
    var idString = req.params.id;
    id = new mongoose.Types.ObjectId(idString);
    client.find({"_id" : id }, function(err, clients) {
        if(err){
            res.json({status: 102, message: 'Unknown'});
        }else{
            res.json({status: 100, message: 'Ok', clients:clients});
        }

    });
});
apiRoutes.post('/updateClient', multer({ storage: uploadnew('client') }).single('avtar'), function (req, res, next) {
    //var newCategory = JSON.parse(req.body.category);
    var newClient = req.body.client;

    if (newClient.name == null || undefined  ) {
           //res.json({ status: 200, message: 'Please send peremeters Validation Error ' });
           res.json({ status: 102, message: 'Unknown' })
    } else {
        client.findOne({
            _id: newClient._id,
        }, function(err, clientt) {
            if (err) throw err;
            if (clientt) {
/*            client.update(
               { '_id' : newClient._id }, 
               { $set: { 'name': newClient.name,'image_url':(typeof req.file !== "undefined") ? req.file.filename: '',
                        'category':(newClient.category) ? new mongoose.Types.ObjectId(newClient.category) : undefined,
                        'business_type':new mongoose.Types.ObjectId(newClient.business_type),
                        'description': newClient.description,'phone': (newClient.phone) ? newClient.phone : undefined,
                        'latitude' : (newClient.latitude) ? newClient.latitude : undefined,
                        'longitute' : (newClient.longitute) ? newClient.longitute : undefined,
                        'address': newClient.address
                    } },
               function (err, result) {
                  if (err) throw err;
                  res.json(result);
               })*/
                if (typeof req.file !== "undefined") {
                    //user['avtar']  = req.file.filename;
                    newClient['image_url']  = req.file.filename;
                } else {
                    //user['avtar']  = user.avtar; 
                    newClient['image_url']  = clientt.image_url;
                }
                if (newClient.category) {
                    //user['avtar']  = req.file.filename;
                    newClient['category']  = mongoose.Types.ObjectId(newClient.category);
                } 
                newClient['business_type'] = mongoose.Types.ObjectId(newClient.business_type);
                clientt.update(newClient,{upsert: true},function(err) {
                    if (err) {
                        res.json({ status: err, message: 'Unknown' })
                    } else {
                        res.json({ status: 100, message: 'Ok' })
                    }
                })
            }
        });
    }
})
apiRoutes.get('/deleteDocument/:id/:model', function(req, res) {
    console.log(req.params.model);
    var model = req.params.model;
    var modell = function (model){ return model;}
    var idString = req.params.id;
    id = new mongoose.Types.ObjectId(idString)
    eval(modell(model)).find({"_id" : id }).remove().exec(
        function(err, results) {
            //console.log(user);
            if (err) {
                res.json({ status: 102, message: 'Unknown' })
            } else {
                res.json({ status: 100, message: 'Ok' })
            }
        })

});
apiRoutes.get('/clientStatus/:id', function(req, res) {
    console.log(req.params.id);
    var idString = req.params.id;
    id = new mongoose.Types.ObjectId(idString)
    client.findOne({"_id" : id },function(err,client) {
        if (err) {
            res.json({ status: 102, message: 'Unknown' })
        } else {

            client.status = client.status ? 0 : 1;
            client.update(client,function(err) {
                if (err) {
                    res.json({ status: 102, message: 'Unknown' })
                } else {
                    res.json({ status: 100, message: 'Ok' })
                }
            });
        }
    })
})
apiRoutes.get('/count', function(req, res){
/*        User.count({},function(err,count) {
        if (err) {
            res.json({ status: 102, message: 'Unknown' })
        } else {
            res.json({ status: 100, message: 'Ok', count: count })
        }
    })
*/  var allCount = {};
    async.parallel([
        //Load user to get `userId` first
        function(callback) {
            User.count({}, function(err, count) {
                if (err) return callback(err);

                allCount.user = count;
                callback();
            });
        },
        function(callback) {
            client.count({}, function(err, count) {
                if (err) return callback(err);

                allCount.client = count;
                callback();
            });
        },
        function(callback) {
            client.find({}, function(err, clients) {
                if (err) return callback(err);

                allCount.clients = clients;
                callback();
            });
        },
        function(callback) {
            User.find({}, function(err, users) {
                if (err) return callback(err);

                allCount.users = users;
                callback();
            });
        }

    ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
        if (err) return next(err);
        //Here locals will be populated with `user` and `posts`
        //Just like in the previous example
        console.log(allCount);
        res.json({ status: 100, message: 'Ok', count: allCount });
    });
})

apiRoutes.post('/addAdvertisement', multer({ storage: uploadnew('advertisement') }).single('avtar'), function (req, res, next) {
    var newAdvertisement = req.body.advertisement;
    console.log(newAdvertisement.category)
    if (newAdvertisement.name == null || undefined ) {
           //res.json({ status: 200, message: 'Please send peremeters Validation Error ' });
           res.json({ status: 102, message: 'Unknown' })
        }
        else{
        advertisements.findOne({
            name: newAdvertisement.name,
        }, function(err, advertisement) {
            if (err) throw err;
            if (advertisement) {
                res.json({ message: 'Duplicate', status: 101 })
            } else if (!advertisement) {
                console.log(req.file);
                if(newAdvertisement.category){
                    newAdvertisement.category.forEach(function(key){
                        return new mongoose.Types.ObjectId(newAdvertisement.category[key])
                    })
                }
                var adv = new advertisements({
                    name: newAdvertisement.name,
                    photo: (typeof req.file !== "undefined") ? req.file.filename: '',
                    //add_date: req.body.add_date,
                    category: (newAdvertisement.category) ? newAdvertisement.category: undefined,
                    hit: (newAdvertisement.hit) ? newAdvertisement.hit: undefined
                })
                adv.save(function(err) {
                    if (err) {
                        res.json({ status: err, message: 'Unknown' })
                    } else{
                        res.json({ status: 100, message: 'Ok' })
                    }
                })
            }
        });
    }
});
apiRoutes.post('/updateAdvertisement', multer({ storage: uploadnew('advertisement') }).single('avtar'), function (req, res, next) {
    var newAdvertisement = req.body.advertisement;
    console.log(newAdvertisement)
    if (newAdvertisement.name == null || undefined ) {
           //res.json({ status: 200, message: 'Please send peremeters Validation Error ' });
           res.json({ status: 102, message: 'Unknown' })
        }
        else{
        advertisements.findOne({
            _id: newAdvertisement._id,
        }, function(err, advertisement) {
            if (err){
                res.json({ status: err, message: 'Unknown' })
            } else if (advertisement) {
                if (typeof req.file !== "undefined") {
                    //user['avtar']  = req.file.filename;
                    newAdvertisement['photo']  = req.file.filename;
                } else {
                    //user['avtar']  = user.avtar; 
                    newAdvertisement['photo']  = advertisement.photo;
                }
                if(newAdvertisement.category){
                    newAdvertisement.category.forEach(function(key){
                        return new mongoose.Types.ObjectId(newAdvertisement.category[key])
                    })
                }
                advertisement.update(newAdvertisement,function(err) {
                    if (err) {
                        res.json({ status: err, message: 'Unknown' })
                    } else{
                        res.json({ status: 100, message: 'Ok' })
                    }
                })
            }

        });
    }
});
apiRoutes.get('/advertisement/:id', function(req, res) {
    console.log(req.params.id);
    var idString = req.params.id;
    id = new mongoose.Types.ObjectId(idString)
    advertisements.find({"_id" : id }, function(err, advertisement) {
        if(err){
            res.json({status: 102, message: 'Unknown'});
        }else{
            res.json({status: 100, message: 'Ok', advertisement:advertisement});
        }

    });
});
apiRoutes.get('/deleteAdvertisement/:id', function(req, res) {
        console.log(req.params.id);
        var idString = req.params.id;
        id = new mongoose.Types.ObjectId(idString)
        advertisements.find({"_id" : id }).remove().exec(
                function(err, user) {
                    //console.log(user);
                    if (err) {
                        res.json({ status: 102, message: 'Unknown' })
                    } else {
                        res.json({ status: 100, message: 'Ok' })
                    }
                })
})
apiRoutes.get('/chartUsersToday/', function(req, res) {
 var date = new Date();
 var day = date.getDate();
 var month = date.getMonth();
 var year = date.getFullYear();
 var next = day+1;
    User.find({"add_date": {"$gte": new Date(year, month, day), "$lt": new Date(year, month,next)}}, function(err, data) {
        res.json(data);
    });
});

apiRoutes.get('/chartClientsToday/', function(req, res) {
 var date = new Date();
 var day = date.getDate();
 var month = date.getMonth();
 var year = date.getFullYear();
 var next = day+1;
    client.find({"add_date": {"$gte": new Date(year, month, day), "$lt": new Date(year, month,next)}}, function(err, data) {
        res.json(data);
    });
});
apiRoutes.post("/upload", function(req, res, next){ 
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
	    // `file` is the name of the <input> field of type `file`
	    console.log(files);
	    console.log(fields);
	    res.writeHead(200, {'content-type': 'text/plain'});
	    res.write('received upload:\n\n');
	    res.end(util.inspect({fields: fields, files: files}));
	});
	form.on('error', function(err) {
	    console.error(err);
	});
	form.on('progress', function(bytesReceived, bytesExpected) {
	    var percent_complete = (bytesReceived / bytesExpected) * 100;
	    console.log(percent_complete.toFixed(2));
	});
	form.on('end', function(fields, files) {
	    /* Temporary location of our uploaded file */
	    var temp_path = this.openedFiles[0].path;
	    /* The file name of the uploaded file */
	    var file_name = this.openedFiles[0].name;
	    /* Location where we want to copy the uploaded file */
	    var new_location = 'public/images/';

	    fs.readFile(temp_path, function(err, data) {
	        fs.writeFile(new_location + file_name, data, function(err) {
	            fs.unlink(temp_path, function(err) {
	                if (err) {
	                    console.error(err);
	                    } else {
	                    console.log("success!");
	                }
	            });
	        });
	    });
	});
});
module.exports = apiRoutes;