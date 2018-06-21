module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getTeams(res, mysql, context, complete){
        mysql.pool.query("SELECT id, name FROM fantasy_teams", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.teams  = results;
            complete();
        });
    }

    function getLeagues(res, mysql, context, complete){
        mysql.pool.query("SELECT id, name FROM leagues", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.leagues  = results;
            complete();
        });
    }

    function getPlayers(res, mysql, context, complete, req, control){
        if (control == 0) {
        mysql.pool.query("SELECT players.playerId, players.fname, players.lname, teams.name AS team_name, players.fantasy_team, players.pos, players.years FROM players INNER JOIN teams ON teams.teamId = players.teamId", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.players = results;
            complete();
        }); }

        if (control == 1) {
            var sql = "SELECT players.playerId, players.fname, players.lname, teams.name AS team_name, players.fantasy_team, players.pos, players.years FROM players INNER JOIN teams ON teams.teamId = players.teamId WHERE players.lname = ?";
            var inserts = [req.body.searchname];
            sql = mysql.pool.query(sql,inserts,function(error, results, fields){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }else{
                    context.players = results; 
                    context.jsscripts = ["deleteplayer.js", "selectteam.js"];                  
                    complete(); 
                }
            });
        }

        if (control == 2) {
            var sql = "SELECT players.playerId, players.fname, players.lname, teams.name AS team_name, players.fantasy_team, players.pos, players.years FROM players INNER JOIN teams ON teams.teamId = players.teamId WHERE players.teamId = ?";
            var inserts = [req.body.team];
            sql = mysql.pool.query(sql,inserts,function(error, results, fields){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }else{
                    context.players = results; 
                    context.team = req.body.team;
                    context.jsscripts = ["deleteplayer.js", "selectteam.js"];                  
                    complete();                     
                }
            });
        }
        
    }

    function getPlayer(res, mysql, context, playerId, complete){
        var sql = "SELECT playerId, fname, lname, teamId, fantasy_team, pos, years FROM players WHERE playerId = ?";
        var inserts = [playerId];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.player = results[0];
            complete();
        }); }


    function getMatchup(res, mysql, context, team1, team2, complete){
        var sql = "SELECT players.playerId, players.fname, players.lname, teams.name AS team_name, players.pos FROM players INNER JOIN fantasy_players ON fantasy_players.playerId = players.playerId INNER JOIN fantasy_teams ON fantasy_teams.id = fantasy_players.teamId INNER JOIN teams ON teams.teamId = players.teamId WHERE fantasy_teams.id = ?";
        var inserts = [team1];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.team1 = results;
        });

        var sql = "SELECT players.playerId, players.fname, players.lname, teams.name AS team_name, players.pos FROM players INNER JOIN fantasy_players ON fantasy_players.playerId = players.playerId INNER JOIN fantasy_teams ON fantasy_teams.id = fantasy_players.teamId INNER JOIN teams ON teams.teamId = players.teamId WHERE fantasy_teams.id = ?";
        var inserts = [team2];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.team2 = results;
	    complete(); 
        });

    }


    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteplayer.js"];
        var mysql = req.app.get('mysql');
        getTeams(res, mysql, context, complete);
        getLeagues(res, mysql, context, complete);

        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('matchup', context);
            }

        }
    });

    router.get('/change', function(req, res, next){ 
	var mysql = req.app.get('mysql'); 
	var context = {};
	var sql = "SELECT id, name FROM fantasy_teams WHERE league = ?";
	var inserts = [req.query.id];
	sql = mysql.pool.query(sql, inserts, function(error, results, fields){
		if (error) {
			res.write(JSON.stringify(error)); 
			res.status(400); 
			res.end(); 
		}
		else {
			context.options = results;
			res.send(context); 
			res.status(202).end(); 
		}
	})
 
    });

    router.get('/update', function(req, res, next){ 
        var url1 = "http://data.nba.net/prod/v1/2017/players/";
        var url2 = "_profile.json"; 
       var request = require('request');
        request(url1 + req.query.playerId + url2, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            res.send(body); 
            res.status(202).end(); 
          }
        })

     
        });

    router.get('/:playerId', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectteam.js", "updateplayer.js"];
        var mysql = req.app.get('mysql');
        getPlayer(res, mysql, context, req.params.playerId, complete);
        getTeams(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-player', context);
            }

        }
    });


    router.post('/', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectteam.js", "updateplayer.js"];
        var mysql = req.app.get('mysql');
        getMatchup(res, mysql, context, req.body.team1, req.body.team2, complete);
        getTeams(res, mysql, context, complete);
        getLeagues(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                 res.render('matchup', context);
            }
        }
    });

    router.post('/search', function(req, res){
        var callbackCount = 0;             
        var control = 0; 
        if (req.body.searchname) {
            control = 1; 
        }
        var context = {};
        context.jsscripts = ["selectteam.js"];  
        var mysql = req.app.get('mysql');
        getPlayers(res, mysql, context, complete, req, control); 
        getTeams(res, mysql, context, complete);           
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('players', context);
            }

        }
    });

    router.put('/:playerId', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE players SET fname=?, lname=?, teamId=?, fantasy_team=?, pos=?, years=? WHERE playerId=?";
        if (req.body.team == ""){
            req.body.team = null; 
        }
        var inserts = [req.body.fname, req.body.lname, req.body.teamId, req.body.fantasy_team, req.body.pos, req.body.years, req.params.playerId];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });


    router.delete('/:playerId', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM players WHERE playerId = ?";
        var inserts = [req.params.playerId];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    return router;
}();
