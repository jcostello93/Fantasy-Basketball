module.exports = function(){
    var express = require('express');
    var router = express.Router();	
	const bcrypt = require("bcryptjs");
	
	function registerUser(req, res, mysql, responseObject, callback) {
		bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(req.body.password, salt, function(err, hash) {
		        var sql = "INSERT INTO users (username, passwordHash, salt, email) VALUES (?, ?, ?, ?)";
				var inserts = [req.body.username, hash, salt, req.body.email];
				sql = mysql.pool.query(sql,inserts,function(error, results, fields){
					if(error){
						if(error.code == "ER_DUP_ENTRY") {
							responseObject.errorCode = error.code; 
							res.send(error.code); 
						}
					} else{		
						responseObject.userId = results.insertId; 
						responseObject.username = req.body.username; 
					}
					callback();
				});
			});
		});
	}
	
	function addExampleLeague(req, res, mysql, responseObject, callback) {
		var sql = "INSERT INTO leagues (name, admin) VALUES (?, ?)";
		var inserts = ["Example League", responseObject.username];
		sql = mysql.pool.query(sql,inserts,function(error, results, fields){
			if(error){
				console.log(error); 
				res.write(JSON.stringify(error));
				res.end();
			} else{		
				responseObject.leagueId = results.insertId; 
				callback(); 
			}
		});		
	}
	
	function addExampleTeams(req, res, mysql, responseObject, callback) {
		var sql = "INSERT INTO fantasy_teams(name,league, owner) VALUES ('Example Team 1', ?, ?), ('Example Team 2', ?, ?), ('Example Team 3', ?, ?), ('Example Team 4', ?, ?), ('Example Team 5', ?, ?), ('Example Team 6', ?, ?), ('Example Team 7', ?, ?), ('Example Team 8', ?, ?), ('Example Team 9', ?, ?), ('Example Team 10', ?, ?);";
		var inserts = []; 
		for (var i = 0; i < 10; i++) {
			inserts.push(responseObject.leagueId); 
			inserts.push(responseObject.username); 
		}
		sql = mysql.pool.query(sql, inserts ,function(error, results, fields){
			if(error){
				console.log(error); 
				res.write(JSON.stringify(error));
				res.end();
			} else{		
				responseObject.teamId = results.insertId; 
				callback(); 
			}
		});		
	}
	
	function addExamplePlayers(req, res, complete, mysql, responseObject) {
		var sql = "INSERT INTO fantasy_players (playerId, teamId) VALUES ('1627732',?), ('1628378',?), ('1626178',?), ('203084',?), ('1626167',?), ('203468',?), ('1627742',?), ('203506',?), ('203914',?), ('1627739',?), ('201935',?), ('1627741',?), ('1628381',?), ('200765',?), ('1628462',?), ('203994',?), ('201568',?), ('203085',?), ('1627747',?), ('1627752',?), ('202329',?), ('202326',?), ('201942',?), ('201163',?), ('1626168',?), ('203077',?), ('203458',?), ('2544',?), ('203083',?), ('1628372',?), ('201569',?), ('203932',?), ('200794',?), ('202738',?), ('203501',?), ('200768',?), ('201936',?), ('2738',?), ('203944',?), ('202696',?), ('203078',?), ('203076',?), ('201952',?), ('203933',?), ('1626171',?), ('203081',?), ('203095',?), ('202324',?), ('202683',?), ('101141',?), ('203464',?), ('203901',?), ('203115',?), ('203114',?), ('1626157',?), ('200826',?), ('203089',?), ('202710',?), ('1628398',?), ('202703',?), ('204001',?), ('203991',?), ('203079',?), ('203935',?), ('1626143',?), ('101127',?), ('201609',?), ('203897',?), ('1628366',?), ('200755',?), ('203507',?), ('1717',?), ('202685',?), ('202689',?), ('1627759',?), ('203471',?), ('2730',?), ('203200',?), ('203110',?), ('1626164',?), ('201583',?), ('2747',?), ('1627763',?), ('1628455',?), ('1628365',?), ('203953',?), ('203552',?), ('201566',?), ('1627812',?), ('1626162',?), ('2546',?), ('101162',?), ('203952',?), ('1628369',?), ('200746',?), ('201152',?), ('201959',?), ('203954',?), ('2548',?), ('201584',?), ('203087',?), ('1626204',?), ('202355',?), ('202339',?), ('201950',?), ('201142',?), ('201949',?), ('203500',?), ('101150',?), ('203613',?), ('1626161',?), ('203145',?), ('202083',?), ('101108',?), ('201567',?), ('203967',?), ('202704',?), ('202344',?), ('203459',?), ('202322',?), ('203484',?), ('202331',?), ('203999',?), ('201599',?), ('203915',?), ('201960',?), ('203918',?), ('201577',?), ('201937',?), ('202699',?), ('202693',?), ('2772',?), ('202328',?), ('201563',?), ('201933',?), ('202340',?), ('202681',?), ('204020',?), ('202711',?), ('2200',?), ('201572',?), ('201954',?), ('1627734',?), ('202695',?), ('202691',?), ('201143',?), ('201586',?), ('203109',?), ('201588',?), ('202694',?), ('203482',?), ('202734',?), ('1626156',?), ('1627749',?), ('1627750',?), ('203496',?), ('200752',?), ('1626163',?), ('1627755',?), ('201587',?), ('1627737',?), ('204060',?), ('1628374',?), ('203497',?), ('203490',?), ('1626196',?), ('201188',?), ('1626179',?), ('1626159',?), ('201939',?), ('201144',?), ('201976',?);";
		var inserts = [];
		for (var i = 0; i < 172; i++) {
			var j = i % 10; 
			inserts.push(responseObject.teamId + j); 
		}

		sql = mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				console.log(error); 
				res.write(JSON.stringify(error));
				res.end();
			} else{		
 
				complete(); 
			}
		});
	}
	
	function addUserLeagueRelationship(req, res, mysql, responseObject, complete) {
		var sql = "INSERT INTO users_leagues (userId, leagueId) VALUES (?, ?)";
		var inserts = [responseObject.userId, responseObject.leagueId];
		sql = mysql.pool.query(sql,inserts,function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			} else{		
				complete(); 
			}
		});	
	}


    router.post('/', function(req, res){
		var callbackCount = 0; 
        var mysql = req.app.get('mysql');
		var responseObject = {}; 
		registerUser(req, res, mysql, responseObject, function () {
			addExampleLeague(req, res, mysql, responseObject, function() { 
				addUserLeagueRelationship(req, res, mysql, responseObject, complete); 
				addExampleTeams(req, res, mysql, responseObject, function () {
					addExamplePlayers(req, res, complete, mysql, responseObject); 
				}); 
			}); 
		}); 
		
		function complete(){
			callbackCount++;
			if(callbackCount >= 2 && !responseObject.errorCode){
				res.redirect('/');
			}
		}
    });

    router.get('/', function(req, res){
		var context = {};
        context.jsscripts = ["register.js"];              
		res.render('register', context); 
    });

    return router;
}();
