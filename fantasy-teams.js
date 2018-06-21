module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getTeams(res, mysql, context, complete, req, control){
        if (control == 0) {
            mysql.pool.query("SELECT fantasy_teams.id, fantasy_teams.name, leagues.name AS league_name FROM fantasy_teams INNER JOIN leagues ON leagues.id = fantasy_teams.league", function(error, results, fields){
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

    function getPlayers(res, mysql, context, complete, req, control, fantasy_id){
         var sql = "SELECT players.playerId, players.fname, players.lname, teams.name AS team_name, players.pos FROM players INNER JOIN fantasy_players ON fantasy_players.playerId = players.playerId INNER JOIN fantasy_teams ON fantasy_teams.id = fantasy_players.teamId INNER JOIN teams ON teams.teamId = players.teamId WHERE fantasy_teams.id = ?";
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
        var sql = "SELECT fantasy_teams.id, fantasy_teams.name, leagues.name AS league_name FROM fantasy_teams INNER JOIN leagues ON leagues.id = fantasy_teams.league WHERE fantasy_teams.id = ?";
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
 

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletefantasy-team.js"];
        var mysql = req.app.get('mysql');
        getTeams(res, mysql, context, complete, req, 0);
	getLeagues(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('fantasy-teams', context);
            }

        }
    });


    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
	var control = 0; 
        context.jsscripts = ["selectcoach.js", "selectlocation.js", "updatefantasy-team.js"];
        var mysql = req.app.get('mysql');
	getTeam(res, mysql, context, req.params.id, complete); 
	getPlayers(res, mysql, context, complete, req, control, req.params.id)
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-fantasy-team', context);
            }

        }
    });


    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO fantasy_teams (name, league) VALUES (?,?)";
        var inserts = [req.body.name, req.body.league];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/fantasy-teams');
            }
        });
    });


    router.put('/:id', function(req, res){
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
    });



    router.delete('/:id', function(req, res){
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
        })
    })

    return router;
}();
