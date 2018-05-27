/*eslint-disable*/
var express = require('express');
var multer = require('multer');
var fs = require('fs');
var app = express();
var _router = express.Router();

var store = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now()+ '' +file.originalname);
    }
});

var upload = multer({storage: store}).single('file');

_router.post('/upload', function(req,res,next){
    upload(req,res,function(err){
        if(err){
            return res.status(501).json({error:err});
        }
        //do all database record saving activity
        return res.json({originalname:req.file.originalname, uploadname:req.file.filename});
    });
});
module.exports = _router;

// var DIR = './uploads/';
 
// var upload = multer({dest: DIR});
 
// app.use(function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', 'http://valor-software.github.io');
//   res.setHeader('Access-Control-Allow-Methods', 'POST');
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   next();
// });
 
// app.use(multer({
//   dest: DIR,
//   rename: function (fieldname, filename) {
//     return filename + Date.now();
//   },
//   onFileUploadStart: function (file) {
//     console.log(file.originalname + ' is starting ...');
//   },
//   onFileUploadComplete: function (file) {
//     console.log(file.fieldname + ' uploaded to  ' + file.path);
//   }
// }));
 
// app.get('/api', function (req, res) {
//   res.end('file catcher example');
// });
 
// app.post('/api', function (req, res) {
//   upload(req, res, function (err) {
//     if (err) {
//       return res.end(err.toString());
//     }
 
//     res.end('File is uploaded');
//   });
// });
 
// var PORT = process.env.PORT || 3000;
 
// app.listen(PORT, function () {
//   console.log('Working on port ' + PORT);
// });