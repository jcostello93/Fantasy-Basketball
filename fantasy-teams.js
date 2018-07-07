module.exports = function(){
    var express = require('express');
    var router = express.Router();
	
	function isLoggedIn(req) {
		if (!req.session.username) {
			return 0;
		}
		return 1; 
	}

	function verifyUser(req, res, id, complete, responseObject) {
		var mysql = req.app.get('mysql');
		var sql = "SELECT users.username, leagues.name FROM users INNER JOIN users_leagues ON users_leagues.userId = users.id INNER JOIN leagues ON leagues.id = users_leagues.leagueId INNER JOIN fantasy_teams ON fantasy_teams.league = leagues.id WHERE fantasy_teams.id = ? AND users.id = ?";
		var inserts = [id, req.session.userId];
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

    function getTeams(res, mysql, context, complete, req, control){
        if (control == 0) {
			var sql = "SELECT fantasy_teams.id, fantasy_teams.name, leagues.name AS league_name FROM fantasy_teams INNER JOIN leagues ON leagues.id = fantasy_teams.league INNER JOIN users_leagues ON users_leagues.leagueId = leagues.Id INNER JOIN users ON users.id = users_leagues.userId WHERE users.username = ? AND fantasy_teams.owner = ?";
			var inserts = [req.session.username, req.session.username]; 
            mysql.pool.query(sql, inserts, function(error, results, fields){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                context.teams  = results;
                complete();
            }); 
        }
        if (control == 1) {
            var sql = "SELECT id, name FROM fantasy_teams WHERE name = ?";
            var inserts = [req.body.searchteam];
            mysql.pool.query(sql, inserts, function(error, results, fields){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                context.jsscripts = ["deletefantasy-team.js"];              
                context.teams = results; 
                complete();
            });
        }
    }

    function getLeagues(res, mysql, context, complete, req){
       	var sql = "SELECT users.username, leagues.id, leagues.name FROM users_leagues INNER JOIN users ON users.id = users_leagues.userId INNER JOIN leagues ON leagues.id = users_leagues.leagueId WHERE users.username = ?"; 
		var inserts = [req.session.username]; 
		mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.leagues  = results;
            complete();
        });
    }

    function getPlayers(res, mysql, context, complete, req, control, fantasy_id){
         var sql = "SELECT players.playerId, players.fname, players.lname, teams.name AS team_name, players.pos FROM players INNER JOIN fantasy_players ON fantasy_players.playerId = players.playerId INNER JOIN fantasy_teams ON fantasy_teams.id = fantasy_players.teamId INNER JOIN teams ON teams.teamId = players.teamId WHERE fantasy_teams.id = ? ORDER BY players.lname";
        var inserts = [fantasy_id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.players = results; 
            complete();
        });
	}

    function getTeam(res, mysql, context, id, complete){
        var sql = "SELECT fantasy_teams.id, fantasy_teams.owner, fantasy_teams.name, leagues.name AS league_name FROM fantasy_teams INNER JOIN leagues ON leagues.id = fantasy_teams.league WHERE fantasy_teams.id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.team = results[0];
            complete();
        });
    }
	
	function getRealTeams(res, mysql, context, complete, req){
        var sql = "SELECT name, teamId FROM teams"; 
        mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.teams = results; 
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
			context.jsscripts = ["deletefantasy-team.js"];
			var mysql = req.app.get('mysql');
			getTeams(res, mysql, context, complete, req, 0);
			getLeagues(res, mysql, context, complete, req);
			function complete(){
				callbackCount++;
				if(callbackCount >= 2){
					res.render('fantasy-teams', context);
				}
			}
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
			var control = 0; 
			context.jsscripts = ["selectcoach.js", "selectlocation.js", "updatefantasy-team.js", "login.js"];
			var mysql = req.app.get('mysql');
			verifyUser(req, res, req.params.id, complete, responseObject); 
			getTeam(res, mysql, context, req.params.id, complete); 
			getPlayers(res, mysql, context, complete, req, control, req.params.id)
			getRealTeams(res, mysql, context, complete, req); 
			function complete(){
				callbackCount++;
				if(callbackCount >= 4){
					if (responseObject.answer == -1) {
						res.redirect('/');
					}
					else {
						context.username = req.session.username; 
						context.fantasyId = req.params.id; 
						res.render('update-fantasy-team', context);
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
			var sql = "INSERT INTO fantasy_teams (name, league, owner) VALUES (?,?, ?)";
			var inserts = [req.body.name, req.body.league, req.session.username];		
			sql = mysql.pool.query(sql,inserts,function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.end();
				}else{
					res.redirect('/fantasy-teams');
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
			var sql = "UPDATE fantasy_teams SET name=? WHERE id=?";
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
			var sql = "DELETE FROM fantasy_teams WHERE id = ?";
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
