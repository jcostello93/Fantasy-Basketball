module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getTeams(res, mysql, context, complete){
        mysql.pool.query("SELECT teamId, name FROM teams", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.teams  = results;
            complete();
        });
    }

    function getPlayers(res, mysql, context, complete, req, control){
        if (control == 0) {
        mysql.pool.query("SELECT players.playerId, players.fname, players.lname, teams.name AS team_name, players.teamId, players.pos, players.years FROM players INNER JOIN teams ON teams.teamId = players.teamId", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.players = results;
            complete();
        }); }

        if (control == 1) {
            var sql = "SELECT players.playerId, players.fname, players.lname, teams.name AS team_name, players.pos, players.years FROM players INNER JOIN teams ON teams.teamId = players.teamId WHERE players.lname LIKE ?";
            var inserts = ["%"+req.body.searchname+"%"];
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
            var sql = "SELECT players.playerId, players.fname, players.lname, teams.name AS team_name, players.pos, players.years FROM players INNER JOIN teams ON teams.teamId = players.teamId WHERE players.teamId = ?";
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
        var sql = "SELECT playerId, fname, lname, teamId, pos, years FROM players WHERE playerId = ?";
        var inserts = [playerId];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.player = results[0];
			console.log(context.player); 
            complete();
        });
    }


    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteplayer.js"];
        var mysql = req.app.get('mysql');
        getPlayers(res, mysql, context, complete, req, 0);
        getTeams(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('players', context);
            }

        }
    });

    router.get('/:playerId', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectteam.js", "updateplayer.js"];
        var mysql = req.app.get('mysql');
        getPlayer(res, mysql, context, req.params.playerId, complete);
        getTeams(res, mysql, context, complete);
	console.log(context); 
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-player', context);
            }

        }
    });


    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO players (playerId, fname, lname, teamId, pos, years) VALUES (?,?,?,?,?,?)";
	if (req.body.pos == 1) {
		req.body.pos = "G"; 
	}
	if (req.body.pos == 2) {
		req.body.pos = "G-F"; 
	}
	if (req.body.pos == 3) {
		req.body.pos = "F"; 
	}
	if (req.body.pos == 4) {
		req.body.pos = "F-C"; 
	}
	if (req.body.pos == 5) {
		req.body.pos = "C"; 
	}
        if (req.body.team == "") {
            req.body.team = null;
        }
        var inserts = [req.body.playerId, req.body.fname, req.body.lname, req.body.teamId, req.body.pos, req.body.years];
	console.log(inserts); 
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/players');
            }
        });
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
        var sql = "UPDATE players SET fname=?, lname=?, teamId=?, pos=?, years=? WHERE playerId=?";
        if (req.body.team == ""){
            req.body.team = null; 
        }
        var inserts = [req.body.fname, req.body.lname, req.body.team, req.body.pos, req.body.years, req.params.playerId];
	console.log(inserts); 
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
