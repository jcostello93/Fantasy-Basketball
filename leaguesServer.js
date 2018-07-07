module.exports = function(){
    var express = require('express');
    var router = express.Router();
	
	function isLoggedIn(req) {
		if (!req.session.username) {
			return 0;
		}
		return 1; 
	}
	
	function addLeague(req, res, mysql, responseObject) {
		var sql = "INSERT INTO leagues (name, publicKey, admin) VALUES (?, ?, ?)"; 			// add league
		var inserts = [req.body.name, responseObject.key, req.session.username];
		sql = mysql.pool.query(sql,inserts,function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}else{
				sql = "INSERT INTO users_leagues (userId, leagueId) VALUES (?, ?)";			// add user_league relationship
				var inserts = [req.session.userId, results.insertId]; 
				sql = mysql.pool.query(sql,inserts,function(error, results, fields){
					if(error){
						res.write(JSON.stringify(error));
						res.end();
					}
					else {				
						res.redirect('/leagues');
					}
				});
			}
		});
	}
	
	function getUniqueKey(req, res, mysql, responseObject, keyCallback) {
		var sql = "SELECT id FROM leagues WHERE publicKey = ?"; 
		var publicKey = getRandomInt(100000, 999999);  
		var inserts = [publicKey]; 
		mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			else {
				if (results[0]) {
					responseObject.unique = false; 
				}
				else {
					responseObject.key = publicKey; 
					responseObject.unique = true; 
				}
				keyCallback(); 
			}            
		}); 
		
	}
	
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function verifyUser(req, res, id, complete, responseObject) {
		var mysql = req.app.get('mysql');
		var sql = "SELECT users.username, leagues.name FROM users INNER JOIN users_leagues ON users_leagues.userId = users.id INNER JOIN leagues ON leagues.id = users_leagues.leagueId WHERE leagues.id = ? AND users.id = ? AND leagues.admin = ?";
		var inserts = [id, req.session.userId, req.session.username];
		mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			else {
				if (results.length == 0) {
					responseObject.answer = -1; 
				}
				complete();
			}
		}); 	
	}

    function getLeagues(res, mysql, context, complete, req, control){
		var sql = "SELECT users.username, leagues.name, leagues.publicKey, leagues.admin, leagues.id FROM users_leagues INNER JOIN users ON users.id = users_leagues.userId INNER JOIN leagues ON leagues.id = users_leagues.leagueId WHERE users.username = ?"; 
		var inserts = [req.session.username]; 
		mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.leagues = results;
			complete();
		}); 

    }

    function getLeague(res, mysql, context, id, complete, req){
        var sql = "SELECT users.username, leagues.name, leagues.id FROM users_leagues INNER JOIN users ON users.id = users_leagues.userId INNER JOIN leagues ON leagues.id = users_leagues.leagueId WHERE users.username = ? AND leagues.id = ?";
        var inserts = [req.session.username, id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.league = results[0];
            complete();
        });
    }

    router.get('/', function(req, res){
		if (isLoggedIn(req) == 0) {
			res.redirect('/'); 
		}
		else {
			var callbackCount = 0;
			var context = {};
			//maybe add login.js to context
			context.jsscripts = ["deleteleague.js", "leagues.js"];
			var mysql = req.app.get('mysql');
			getLeagues(res, mysql, context, complete, req, 0);
			function complete(){
				callbackCount++;
				if(callbackCount >= 1){
					context.username = req.session.username; 
					res.render('leagues', context);
				}

			}
		}
    });
	
	router.get('/display/:id', function(req, res){
		if (isLoggedIn(req) == 0) {
			res.redirect('/'); 
		}
		else {
			var mysql = req.app.get('mysql');
			var context = {};
			var sql = "SELECT fantasy_teams.name AS team_name, fantasy_teams.owner, fantasy_teams.id AS team_id, leagues.name AS league_name, leagues.admin FROM fantasy_teams INNER JOIN leagues ON leagues.id = fantasy_teams.league WHERE leagues.id = ?"; 
			var inserts = [req.params.id];
			mysql.pool.query(sql, inserts, function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.end();
				}
				else {
					context.teams = results; 
					if (results[0]) {
						if (results[0].admin == req.session.username) {
							context.leagueAdmin = req.session.username;
						}
					}
					context.jsscripts = ["league-teams.js"];
					res.render("league-teams", context); 
				}
			});
		}
    });


    router.get('/:id', function(req, res){
		if (isLoggedIn(req) == 0) {
			res.redirect('/'); 
		}
		else {
			callbackCount = 0;
			var context = {};
			var responseObject = {}; 
			context.jsscripts = ["selectteam.js", "updateleague.js"];
			var mysql = req.app.get('mysql');
			verifyUser(req, res, req.params.id, complete, responseObject); 
			getLeague(res, mysql, context, req.params.id, complete, req);
			function complete(){
				callbackCount++;
				if(callbackCount >= 2){
					if (responseObject.answer == -1) {
						res.redirect('/');
					}
					else {
						res.render('update-league', context);
					}
				}

			}
		}
    });


    router.post('/', function(req, res){
		if (isLoggedIn(req) == 0) {
			res.redirect('/'); 
		}
		else {
			var mysql = req.app.get('mysql');
			var responseObject = {}; 
			var publicKey = getUniqueKey(req, res, mysql, responseObject, keyCallback); 	
			function keyCallback() {
				if (responseObject.unique == true) {
					addLeague(req, res, mysql, responseObject); 
				}
				else {
					getUniqueKey(req, res, mysql, responseObject, keyCallback);			// repeat until key is unique
				}
			}
		}
    });
	
	router.post('/exit', function(req, res){
		if (isLoggedIn(req) == 0) {
			res.redirect('/'); 
		}
		else {
			var mysql = req.app.get('mysql');
			var sql = "DELETE FROM users_leagues WHERE userId = ? AND leagueId = ?"; 
			var inserts = [req.session.userId, req.body.leagueId];
			mysql.pool.query(sql, inserts, function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.end();
				}
				else {
					res.send("1"); 
				}
			});
		}
    });
	
	router.post('/join', function(req, res){
		if (isLoggedIn(req) == 0) {
			res.redirect('/'); 
		}
		else {
			var mysql = req.app.get('mysql');
			var sql = "SELECT id FROM leagues WHERE publicKey = ? AND name = ?"; 
			var inserts = [req.body.publicKey, req.body.name]; 
			mysql.pool.query(sql, inserts, function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.end();
				}
				else {
					if (results[0]) {
						var sql = "INSERT INTO users_leagues (userId, leagueId) VALUES (?,?)"; 
						var inserts = [req.session.userId, results[0].id]; 
						mysql.pool.query(sql, inserts, function(error, results, fields){
							if(error){
								res.write(JSON.stringify(error));
								res.end();
							}
							else {
								res.redirect('/leagues');
							}
						});
					}
					else {
						res.redirect('/leagues');
					}
				}
			});
		}
	});


    router.put('/:id', function(req, res){
		if (isLoggedIn(req) == 0) {
			res.redirect('/'); 
		}
		else {
			var mysql = req.app.get('mysql');
			var sql = "UPDATE leagues SET name=? WHERE id=?";
			var inserts = [req.body.name, req.params.id];
			sql = mysql.pool.query(sql,inserts,function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.end();
				}else{
					res.status(200);
					res.end();
				}
			});
		}
    });


    router.delete('/:id', function(req, res){
		if (isLoggedIn(req) == 0) {
			res.redirect('/'); 
		}
		else {
			var mysql = req.app.get('mysql');
			var sql = "DELETE FROM leagues WHERE id = ?";
			var inserts = [req.params.id];
			sql = mysql.pool.query(sql, inserts, function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.status(400);
					res.end();
				}else{
					res.status(202).end();
				}
			});
		}
    });

    return router;
}();
