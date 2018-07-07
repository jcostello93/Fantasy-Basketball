module.exports = function(){
    var express = require('express');
    var router = express.Router();	
	const bcrypt = require("bcryptjs");
	
	function isLoggedIn(req) {
		if (!req.session.username) {
			return 0;
		}
		return 1; 
	}
	
	function updatePassword(req, res, mysql, responseObject, complete) {
		bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(req.body.newPassword, salt, function(err, hash) {
		        var sql = "UPDATE users SET passwordHash = ?, salt = ? WHERE users.id = ?";
				var inserts = [hash, salt, req.session.userId];
				sql = mysql.pool.query(sql,inserts,function(error, results, fields){
					if(error){
						if(error.code == "ER_DUP_ENTRY") {
							responseObject.errorCode = error.code; 
							res.send(error.code); 
						}
					} else{		
						responseObject.userId = results.insertId; 
					}
					complete();
				});
			});
		});
	}
	
	function verifyOldPassword(req, res, mysql, responseObject, callback) {
		var sql = "SELECT id, username, passwordHash, salt FROM users WHERE id = ?";
		var inserts = [req.session.userId];
		sql = mysql.pool.query(sql, inserts, function(error, rows, fields){
			if (error) {
				console.log(error); 
			}
			else {
				if (rows[0]) {
					var hash = rows[0].passwordHash; 
					var salt = rows[0].salt; 	
					responseObject.id = rows[0].id; 				
					bcrypt.compare(req.body.oldPassword, hash, function(err, res) {
						responseObject.oldPassword = res; 
						callback(); 
					});
				}
				else {
					responseObject.oldPassword = false; 
					callback(); 
				}
			}
		});	
	}
	
	function verifyUser(req, res, complete, responseObject) {
		var mysql = req.app.get('mysql');
		var sql = "SELECT users.username FROM users WHERE users.id = ? AND users.username = ?";
		var inserts = [req.session.userId, req.params.username];
		mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			else {
				if (results.length == 0) {
					responseObject.answer = -1; 
				}
				else {
					responseObject.answer = 1; 
				}
				complete();
			}
		}); 	
	}
	
	router.get('/:username', function (req, res) {
		if (isLoggedIn(req) == 0) {
			res.redirect('/'); 
		}
		else {
			var responseObject = {}; 
			var context = {}; 
			var callbackCount = 0; 
			context.jsscripts = ["login.js", "updateuser.js"];
			verifyUser(req, res, complete, responseObject);			
			function complete(){
				callbackCount++;
				if(callbackCount >= 1){
					if (responseObject.answer == -1) {
						res.redirect('/');
					}
					else {
						context.username = req.params.username; 
						res.render('update-user', context);
					}
				}
			}
		}
	}); 
	
	router.post('/', function (req, res) {
		var mysql = req.app.get('mysql');	
		var responseObject = {}; 
		var callbackCount = 0; 
		verifyOldPassword(req, res, mysql, responseObject, function () {
			if (responseObject.oldPassword == true) {
				updatePassword(req, res, mysql, responseObject, complete); 
			}
			else {
				res.send("-1"); 
			}
		}); 
		function complete(){
				callbackCount++;
				if(callbackCount >= 1){
					res.send("1"); 
				}

		}
	}); 

    return router;
}();
