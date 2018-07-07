module.exports = function(){
    var express = require('express');
    var router = express.Router();	
	var bcrypt = require("bcryptjs");
	var nodemailer = require('nodemailer');
	var fs = require('fs');
	var readline = require('readline');


	function sendPassword(req, res, responseObject, callback) {
		 // create reusable transporter object using the default SMTP transport
		var emailText = "Hello " + responseObject.username + ",\n\nHere is your temporary password: " + responseObject.newPassword; 
		emailText += "\n\nBest,\nfantasyproject.me";
		var myOutput = {};
		
		var rd = readline.createInterface({
			input: fs.createReadStream('credentials.txt'),
			output: myOutput,
			console: false
		});
		
		fileContents = [];


		rd.on('line', function(line) {
			fileContents.push(line); 
		});
		
		rd.on('close', function () {
			var transporter = nodemailer.createTransport({
			 service: 'gmail',
			 auth: {
					user: fileContents[0],
					pass: fileContents[1]
				}
			});
			
			// setup e-mail data with unicode symbols
			var mailOptions = {
				from: 'admin@fantasyproject.me', // sender address
				to: req.body.email, // list of receivers
				subject: 'Fantasyproject.me reset password', // Subject line
				text: emailText
			};

			// send mail with defined transport object
			transporter.sendMail(mailOptions, function(error, info){
				if(error){
					return console.log(error);
					responseObject.emailError = error; 
				}
				callback(); 
			});
        });
		 
		
	}
	
	function randStrGen() {
	  var text = "";
	  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789!@#$%^*";

	  for (var i = 0; i < 50; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	  return text;
	}
	
	function generateNewPassword(req, res, mysql, responseObject, callback) {
		var randStr = randStrGen(); 
		responseObject.newPassword = randStr; 
		bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(randStr, salt, function(err, hash) {
		        var sql = "UPDATE users SET passwordHash = ?, salt = ? WHERE users.email = ?";
				var inserts = [hash, salt, req.body.email];
				sql = mysql.pool.query(sql,inserts,function(error, results, fields){
					if(error){
						if(error.code == "ER_DUP_ENTRY") {
							responseObject.errorCode = error.code; 
							res.send(error.code); 
						}
					} else{		
						responseObject.hash = hash; 
					}
					callback();
				});
			});
		});
	}
	
	function validateEmail(req, res, mysql, responseObject, callback) {
		var sql = "SELECT id, username FROM users WHERE email = ?";
		var inserts = [req.body.email];    
		var context = {};    
		sql = mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.status(400);
				res.end();
			}else{
					if (results[0]) {
						responseObject.username = results[0].username; 
						responseObject.email = true; 
					}
					else {
						responseObject.email = false; 
					}
					callback(); 
			  }
		  });
	}

	router.get('/', function (req, res) {
		var context = {}; 
		context.jsscripts = ["password.js"];
		res.render('password', context); 
	}); 
	
	router.post('/', function (req, res) {
		var mysql = req.app.get('mysql');
		responseObject = {}; 
		validateEmail(req, res, mysql, responseObject, function () {
			if (responseObject.email == true) {
				generateNewPassword(req, res, mysql, responseObject, function () {
					if (responseObject.hash) {
						sendPassword(req, res, responseObject, function() {
							if (!responseObject.emailError) {
								res.send("1"); 
							}
						}); 
					}
				}); 
			}
			else {
				res.send("-1"); 
			}
		}); 
	}); 
	
    return router;
}();
