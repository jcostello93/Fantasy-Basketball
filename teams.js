module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getTeams(res, mysql, context, complete, req, control){
        if (control == 0) {
            mysql.pool.query("SELECT teams.teamId, teams.name FROM teams", function(error, results, fields){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                context.teams  = results;
                complete();
            }); 
        }
        if (control == 1) {
            var sql = "SELECT teams.teamId, teams.name FROM teams WHERE name = ?";
            var inserts = [req.body.searchteam];
            mysql.pool.query(sql, inserts, function(error, results, fields){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                context.jsscripts = ["deleteteam.js"];              
                context.teams = results; 
                complete();
            });
        }
    }

    function getTeam(res, mysql, context, teamId, complete){
        var sql = "SELECT teamId, name FROM teams WHERE teamId = ?";
        var inserts = [teamId];
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
        context.jsscripts = ["deleteteam.js"];
        var mysql = req.app.get('mysql');
        getTeams(res, mysql, context, complete, req, 0);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('teams', context);
            }

        }
    });


    router.get('/:teamId', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectcoach.js", "selectlocation.js", "updateteam.js"];
        var mysql = req.app.get('mysql');
        getTeam(res, mysql, context, req.params.teamId, complete);  
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-team', context);
            }

        }
    });

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO teams (teamId, name) VALUES (?,?)";
        var inserts = [req.body.teamId, req.body.name];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/teams');
            }
        });
    });

    /* The URI that update data is sent to in order to update a person */

    router.put('/:teamId', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE teams SET teamId=?, name=? WHERE teamId=?";
        var inserts = [req.body.teamId, req.body.name, req.params.teamId];
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

    router.post('/search', function(req, res){
        var callbackCount = 0;             
        var context = {};
        var mysql = req.app.get('mysql');
        getTeams(res, mysql, context, complete, req, 1);           
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('teams', context);
            }

        }
    });

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM teams WHERE teamId = ?";
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
