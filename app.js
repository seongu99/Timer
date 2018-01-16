var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
var User = require('./models/user');

mongoose.connect('mongodb://localhost:27017/testDB3');
var db = mongoose.connection;

db.on('error', function(){
    console.log('Connection Failed!');
});
db.once('open', function() {
    console.log('mongodb Connected!');
});

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res){
  res.render('index.ejs');
});

app.get('/signup' , function(req, res){
  res.render('signup.ejs');
});

app.post('/memberCheck', function(req, res) {
  User.findOne({name:req.body.name,pwd:req.body.pwd},function(err, user){
    if(err){
      return res.status(500).json({error:err});
    }else if(user){

      res.render('main.ejs',{name:req.body.name});
    } else{
      res.render('index.ejs');
    }
  });
});

app.post('/signup', function(req, res) {
  User.findOne({name:req.body.name}, function(err, user){
    if(err){
      return res.status(500).json({error:err}) ;
    } else if(!user) {
      var newUser = new User({name:req.body.name, pwd:req.body.pwd, email:req.body.email});

      newUser.save(function(error, data){
          if(error){
              console.log(error);
          }else{
              console.log('Saved!');
          }
      });
      res.render('main.ejs',{name:req.body.name});

    } else{

      res.render('signup.ejs');
    }
  });

});


app.listen(3000, function(){
  console.log('connected 3000port!');
});
