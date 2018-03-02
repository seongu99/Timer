var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
var url = require('url');
var User = require('./models/user');
var ip = require('ip');

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

app.post('/signup', function(req, res) {
  User.findOne({name:req.body.name}, function(err, user){
    if(err){
      return res.status(500).json({error:err}) ;//webserver error
    } else if(!user) {
      //console.dir ( ip.address() );
      var newUser = new User({name:req.body.name, pwd:req.body.pwd, email:req.body.email, accumTime:0});

      newUser.save(function(error, data){
          if(err){
              console.log(err);
          }else{
              console.log('New User Saved!'+data);
          }
      });

      res.redirect(url.format({
        pathname:"/"

      }));
    } else{
      res.render('signup.ejs');
    }
  });

});

app.post('/memberCheck', function(req, res) {
  User.findOne({name:req.body.name,pwd:req.body.pwd},function(err, user){
    if(err){
      return res.status(500).json({error:err});
    }else if(user){

      User.find({}).sort({accumTime:-1}).exec(function(err,users){
      if(err) return res.status(500).send({error: 'database failure'});

      var i, count;
      var userArr=[];

      for (i = 0, count = users.length; i < count; i++) {
         userArr.push(users[i]);
      }
      userArr = JSON.stringify(userArr);

        res.redirect(url.format({
          pathname:"/main",
          query:{
            "name":req.body.name,
            "accumTime":user.accumTime,
            "param":userArr
          }
        }));
      });


    } else{
      res.redirect('/');
    }
  });
});

app.get('/main', function(req,res) {

  res.render('main.ejs',{userName:req.query.name,accumTime:req.query.accumTime,otherUsers:req.query.param});
});

app.put('/admin/update', function(req,res) {

  User.findOne({name:req.body.name}, function(err, user) {
    User.update({name:req.body.name},{$set:{accumTime:Number(user.accumTime)+Number(req.body.time)}}, function(err, output) {
      if(err) res.status(500).json({ error: 'database failure' });
      console.log(output);
    });

  });



});
/*Usage example*/

app.use(express.static(__dirname + '/public'));
app.listen(3000, function(){
  console.log('connected 3000port!');
});
