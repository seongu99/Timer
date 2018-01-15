var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// 1. mongoose 모듈 가져오기
var mongoose = require('mongoose');
// 2. testDB 세팅
mongoose.connect('mongodb://localhost:27017/testDB3');
// 3. 연결된 testDB 사용
var db = mongoose.connection;
// 4. 연결 실패
db.on('error', function(){
    console.log('Connection Failed!');
});
// 5. 연결 성공
db.once('open', function() {
    console.log('mongodb Connected!');
});

// 6. Schema 생성. (혹시 스키마에 대한 개념이 없다면, 입력될 데이터의 타입이 정의된 DB 설계도 라고 생각하면 됩니다.)
var user = mongoose.Schema({
    name : String,
    pwd : String,
    email : String
});

// 7. 정의된 스키마를 객체처럼 사용할 수 있도록 model() 함수로 컴파일
var User = mongoose.model('People3', user);


app.set('views', './views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res){
  res.render('index.ejs');
});


app.post('/timer', function(req, res){
  var newUser = new User({name:req.body.name, pwd:req.body.pwd, email:req.body.email});

  newUser.save(function(error, data){
      if(error){
          console.log(error);
      }else{
          console.log('Saved!');
      }
  });
  res.render('main.ejs');
  //res.send(name+','+pwd+','+email);
});

app.listen(3000, function(){
  console.log('connected 3000port!');
});
