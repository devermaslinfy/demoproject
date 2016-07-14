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
var mongoose = require('mongoose');
//var url = require('url');
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

apiRoutes.post('/register', function(req, res) {
    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err) throw err;
        if (user) {
            console.log(user);
            res.json({ message: 'Duplicate', status: 101 })
        } else if (!user) {
            bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
                bcrypt.hash("my password", salt, function(err, hash) {
                    if(err){
                        res.json(err);
                    }
                    // Store hash in your password DB.
                    var usr = new User({
                        email: req.body.email,
                        name: req.body.name,
                        password: hash,
                        avtar: req.body.avtar,
                        age: req.body.age,
                        questions: req.body.questions,
                        //add_date: req.body.add_date,
                        last_login: req.body.last_login,
                        //last_edit: req.body.last_edit,
                        login_type: req.body.login_type,
                        status: req.body.status
                    })
                    usr.save(function(err) {
                        if (err) {
                            res.json(err)
                            res.json({ status: 102, message: 'Unknown' })
                        }
                        res.json({ status: 100, message: 'Ok' })
                    })
                });
            });
        }
    })
});
apiRoutes.post('/signup', function(req, res) {
    Admin.findOne({
        email: req.body.email
    }, function(err, admin) {
        if(err){
            res.json(err)
        }
        if (admin) {
            console.log('admin');
            res.json({email: req.body.email})
            //res.json({ message: 'Duplicate', status: req.body.email })
        } else if (!admin) {
            bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
                bcrypt.hash(req.body.password, salt, function(err, hash) {
                    if(err){
                        res.json(err)
                    }
                    // Store hash in your password DB.
                    var usr = new Admin({
                        email: req.body.email,
                        name: req.body.name,
                        password: hash,
                        avtar: req.body.avtar,
                        age: req.body.age,
                        add_date: req.body.add_date,
                        last_login: req.body.last_login,
                        last_edit: req.body.last_edit,
                        login_type: req.body.login_type,
                        admin_type: req.body.admin_type,
                        status: req.body.status
                    })
                    usr.save(function(err) {
                        if (err) {
                            //res.json(err)
                            res.json({ status: 102, message: 'Unknown' })
                        }
                        res.json({ status: 100, message: 'Ok' })
                    })
                });
            });
        }
    })
});
apiRoutes.post('/addApi', function(req, res) {
    switch (req.body.flag) {
        case "register":

            User.findOne({
                email: req.body.email
            }, function(err, user) {

                if (err) throw err;
                if (user) {
                    res.json({ message: 'Duplicate', status: 101 })
                } else if (!user) {
                    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
                        bcrypt.hash("my password", salt, function(err, hash) {
                            if(err){
                                res.json(err);
                            }
                            // Store hash in your password DB.
                            var usr = new User({
                                email: req.body.email,
                                name: req.body.name,
                                password: hash,
                                avtar: req.body.avtar,
                                age: req.body.age,
                                questions: req.body.questions,
                                add_date: req.body.add_date,
                                last_login: req.body.last_login,
                                last_edit: req.body.last_edit,
                                login_type: req.body.login_type,
                                status: req.body.status
                            })
                            usr.save(function(err) {
                                if (err) {
                                    res.json({ status: 102, message: 'Unknown' })
                                }
                                res.json({ status: 100, message: 'Ok' })
                            })

                        });
                    });
                }
            });
            break;

        case "client":

            client.findOne({
                name: req.body.name
            }, function(err, name) {

                if (err) throw err;
                if (name) {
                    res.json({ message: 'Duplicate', status: 101 })
                } else if (!name) {
                    var usr = new client({
                        category: req.body.category,
                        name: req.body.name,
                        image_url: req.body.image_url,
                        business_type: req.body.business_type,
                        Location: req.body.Location,
                        address: req.body.address,
                        phone: req.body.phone,
                        last_login: req.body.last_login,
                        add_date: req.body.add_date,
                        status: req.body.status

                    })
                    usr.save(function(err) {
                        if (err) {
                            res.json({ status: 102, message: 'Unknown' })
                        }
                        res.json({ status: 100, message: 'Ok' })
                    })
                }
            });

            break;
        case "likes":
         if (req.body.user_id == null || undefined || req.body.client_id == null || undefined) {
               //res.json({ status: 200, message: 'Please send peremeters Validation Error ' });
               res.json({ status: 102, message: 'Unknown' })
            }
            else{
            likes.findOne({
                user_id: req.body.user_id,
                client_id: req.body.client_id
            }, function(err, like) {
                if (err) throw err;
                if (like) {
                    res.json({ message: 'Duplicate', status: 101 })
                } else if (!like) {
                    var usr = new likes({
                        user_id: req.body.user_id,
                        client_id: req.body.client_id,
                        add_date: req.body.add_date

                    })
                    usr.save(function(err) {
                        if (err) {
                            res.json({ status: 102, message: 'Unknown' })
                        }
                        res.json({ status: 100, message: 'Ok' })
                    })
                }
            });
        }

        break;

        case "favorites":
                if (req.body.user_id == null || undefined || req.body.client_id == null || undefined) {
                   //res.json({ status: 200, message: 'Please send peremeters Validation Error ' });
                   res.json({ status: 102, message: 'Unknown' })
                }
                else{
                favorites.findOne({
                    user_id: req.body.user_id,
                    client_id: req.body.client_id
                }, function(err, favorite) {

                    if (err) throw err;
                    if (favorite) {

                        res.json({ message: 'Duplicate', status: 101 })
                    } else if (!favorite) {
                        var usr = new favorites({
                            user_id: req.body.user_id,
                            client_id: req.body.client_id,
                            add_date: req.body.add_date

                        })
                        usr.save(function(err) {
                            if (err) {
                                res.json({ status: 102, message: 'Unknown' })
                            }
                            res.json({ status: 100, message: 'Ok' })
                        })
                    }
                });
            }
            break;

        case "categories":
         if (req.body.name == null || undefined || req.body.image_url == null || undefined || req.body.add_date == null || undefined || req.body.status == null || undefined) {
               //res.json({ status: 200, message: 'Please send peremeters Validation Error ' });
               res.json({ status: 102, message: 'Unknown' })
            }
            else{
            categories.findOne({
                name: req.body.name,
            }, function(err, category) {
                if (err) throw err;
                if (category) {
                    res.json({ message: 'Duplicate', status: 101 })
                } else if (!category) {
                    var cat = new categories({
                        name: req.body.name,
                        image_url: req.body.image_url,
                        add_date: req.body.add_date,
                        status:req.body.status

                    })
                    cat.save(function(err) {
                        if (err) {
                            res.json({ status: 102, message: 'Unknown' })
                        }
                        res.json({ status: 100, message: 'Ok' })
                    })
                }
            });
        }

        break;

        case "questions":
         if (req.body.question == null || undefined || req.body.answer == null || undefined || req.body.add_date == null || undefined ) {
               //res.json({ status: 200, message: 'Please send peremeters Validation Error ' });
               res.json({ status: 102, message: 'Unknown' })
            }
            else{
            questions.findOne({
                question: req.body.question,
            }, function(err, question) {
                if (err) throw err;
                if (question) {
                    res.json({ message: 'Duplicate', status: 101 })
                } else if (!question) {
                    var ques = new questions({
                        question: req.body.question,
                        answer: req.body.answer,
                        add_date: req.body.add_date

                    })
                    ques.save(function(err) {
                        if (err) {
                            res.json({ status: 102, message: 'Unknown' })
                        }
                        res.json({ status: 100, message: 'Ok' })
                    })
                }
            });
        }

        break;
        case "advertisement":set
         if (req.body.name == null || undefined || req.body.photo == null || undefined || req.body.add_date == null || undefined ) {
               //res.json({ status: 200, message: 'Please send peremeters Validation Error ' });
               res.json({ status: 102, message: 'Unknown' })
            }
            else{
            advertisements.findOne({
                name: req.body.name,
            }, function(err, advertisement) {
                if (err) throw err;
                if (advertisement) {
                    res.json({ message: 'Duplicate', status: 101 })
                } else if (!advertisement) {
                    var advert = new advertisements({
                        name: req.body.name,
                        category:req.body.category,
                        photo: req.body.photo,
                        hit: req.body.hit,
                        add_date: req.body.add_date

                    })
                    advert.save(function(err) {
                        if (err) {
                            res.json({ status: 102, message: 'Unknown' })
                        }
                        res.json({ status: 100, message: 'Ok' })
                    })
                }
            });
        }

        break;
        case "business_type":
         if (req.body.name == null || undefined || req.body.add_date == null || undefined ) {
               //res.json({ status: 200, message: 'Please send peremeters Validation Error ' });
               res.json({ status: 102, message: 'Unknown' })
            }
            else{
            businessTypes.findOne({
                name: req.body.name,
            }, function(err, businessType) {
                if (err) throw err;
                if (businessType) {
                    res.json({ message: 'Duplicate', status: 101 })
                } else if (!businessType) {
                    var business = new businessTypes({
                        name: req.body.name,
                        add_date: req.body.add_date

                    })
                    business.save(function(err) {
                        if (err) {
                            res.json({ status: 102, message: 'Unknown' })
                        }
                        res.json({ status: 100, message: 'Ok' })
                    })
                }
            });
        }

        break;

        default:
            res.json({ status: 102, message: 'Unknown' });
            break;

    }
});


// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {

    // find the user
    Admin.findOne({
        email: req.body.email
    }, function(err, admin) {

        if (err) throw err;

        if (!admin) {
            res.json({ status: 102, message: 'Authentication failed. User not found.' });
        } else if (admin) {
            // Load password hash from DB
            bcrypt.compare(req.body.password, admin.password, function(err, resp) {
                // res === true
                if(err){
                    res.json({ status: 102, message: 'Authentication failed. Wrong password.' });
                }
                // if user is found and password is right
                // create a token
                if(resp == true) {
                    var token = jwt.sign(admin, app.get('superSecret'), {
                        expiresIn: '1440m' // expires in 24 hours
                    });
                    app.set('token', 'token');
                    app.set('id', admin.id);

                    // return the information including token as JSON
                    res.json({
                        status: 100,
                        message: 'Ok',
                        token: token,
                        id: admin.id
                    });
                } else {
                    res.json({ status: 102, message: 'Authentication failed. User not found.' });
                }

            });

            // check if password matches
/*            if (admin.password != req.body.password) {
                res.json({ status: 102, message: 'Authentication failed. Wrong password.' });
            } else {

                // if user is found and password is right
                // create a token
                var token = jwt.sign(admin, app.get('superSecret'), {
                    expiresIn: '1440m' // expires in 24 hours
                });
                app.set('token', 'token');
                app.set('id', admin.id);

                // return the information including token as JSON
                res.json({
                    status: 100,
                    message: 'Ok',
                    token: token,
                    id: admin.id
                });
            }*/
        }

    });
});
// route middleware to verify a token
/*apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        return res.json({ status: 102, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});*/
// route to show a random message (GET http://localhost:8080/api/)
/*apiRoutes.get('/', function(req, res) {
    res.json({ message: 'Welcome to the coolest API on earth!' });
});*/
apiRoutes.get('/admins', function(req, res) {
/*    Admin.find({"admin_type":"2"}).exec(function(error, admins) {
                res.json(admins);
            });*/
        Admin.find({"admin_type":2}, function(err, admins) {
        res.json(admins);
    });
});
apiRoutes.get('/admin', function(req, res) {
        var idString = req.query.id;
        id = new mongoose.Types.ObjectId(idString)
        Admin.findOne({"_id":id },function(err, admin) {
            if(err){
                res.json(err);
            }
        res.json(admin);
        });
});
apiRoutes.get('/clients', function(req, res) {
    client.find({}).populate('category').exec(function(error, clients) {
                res.json(clients);
            });
});

apiRoutes.get('/questions', function(req, res) {
    questions.find({}, function(err, questions) {
        res.json(questions);
    });
});
// route to return all Categories (GET http://localhost:8080/api/categories)
apiRoutes.get('/categories', function(req, res) {
    categories.find({}, function(err, categories) {
        res.json(categories);
    });
});
// route to return all advertisements (GET http://localhost:8080/api/advertisements)
apiRoutes.get('/advertisements', function(req, res) {
/*    advertisements.find({}, function(err, advertisements) {
        res.json(advertisements);
    });*/
    advertisements.find({}).populate('category').exec(function(error, advertisements) {
        res.json(advertisements);
    });
});
// route to return all business type (GET http://localhost:8080/api/business)
apiRoutes.get('/business', function(req, res) {
    businessTypes.find({}, function(err, business) {
        res.json(business);
    });
});
// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', function(req, res) {
    User.find({}, function(err, users) {
        res.json(users);
    });
});
apiRoutes.delete('/delete', function(req, res) {
        console.log(req.body.email)
        User.remove({ email: req.body.email },
                function(err, user) {
                    console.log('req.body.email')
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
    // route to get user information 
apiRoutes.get('/user/:id', function(req, res) {
        console.log(req.params.id)
        User.findOne({ _id: req.params.id },
                function(err, user) {
                    if (err) {
                        res.json({ status: 102, message: 'Unknown' })
                    } else {
                        res.json({ status: 100, message: 'Ok', response: user })
                    }
                })
            /*  User.findOne({
                email: req.body.email
              },function(err, user){*/
    })
    // route to update user information 
apiRoutes.post('/user', function(req, res) {
    console.log(req.body)
    User.findOne({ _id: req.body._id },
            function(err, user) {
                if (err) {
                    res.json({ status: 102, message: 'Unknown' })
                }
                data = req.body
                for (var key in data) {
                    console.log(user)
                    user[key] = data[key];

                }

                // update the user
                user.save(function(err) {
                    if (err) {
                        res.json({ status: 102, message: 'Unknown' })
                    } else {
                        res.json({ status: 100, message: 'Ok' })
                    }

                });
            })
        /*  User.findOne({
            email: req.body.email
          },function(err, user){*/
})



// route to update status 
apiRoutes.post('/status', function(req, res) {
    console.log(req.body)
    User.findOne({ _id: req.body._id },
            function(err, user) {
                if (err) {
                    res.json({ status: 102, message: 'Unknown' })
                }
                user.status = req.body.status

                // update the user
                user.save(function(err) {
                    if (err) {
                        res.json({ status: 102, message: 'Unknown' })
                    } else {
                        res.json({ status: 100, message: 'Ok' })
                    }

                });
            })
        /*  User.findOne({
            email: req.body.email
          },function(err, user){*/
})
module.exports = apiRoutes;
