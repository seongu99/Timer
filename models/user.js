var mongoose = require('mongoose');
var user = mongoose.Schema({
    name : String,
    pwd : String,
    email : String
});
// var User = mongoose.model('user', user);
module.exports = mongoose.model('user', user);
