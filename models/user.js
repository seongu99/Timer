var mongoose = require('mongoose');
var user = mongoose.Schema({
    name : String,
    pwd : String,
    email : String,
    accumTime:mongoose.Schema.Types.Mixed
});
// var User = mongoose.model('user', user);
module.exports = mongoose.model('user', user);
