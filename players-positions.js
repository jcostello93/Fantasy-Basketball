module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getTeams(res, mysql, context, complete){
        mysql.pool.query("SELECT id, name, coach, location FROM teams", function(error, results, fields){
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
            mysql.pool.query("SELECT players.id, players_positions.id AS pp_id, fname, lname, positions.name AS position_name FROM players INNER JOIN players_positions ON players.id = players_positions.player_id INNER JOIN positions ON positions.id = players_positions.position_id", function(error, results, fields){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                context.players = results;
                context.jsscripts = ["deleteplayer-position.js", "selectteam.js", "selectposition.js", "updateplayer-position.js"];                               
                complete();
            }); 
        }

        if (control == 1) {
            var sql = "SELECT players.id, players_positions.id AS pp_id, fname, lname, positions.name AS position_name FROM players INNER JOIN players_positions ON players.id = players_positions.player_id INNER JOIN positions ON positions.id = players_positions.position_id WHERE players.lname = ?";
            console.log(req.body.searchplayer); 
            var inserts = [req.body.searchplayer];
            sql = mysql.pool.query(sql,inserts,function(error, results, fields){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }else{
                    console.log(results); 
                    context.players = results; 
                    context.jsscripts = ["deleteplayer-position.js", "selectteam.js", "selectposition.js", "updateplayer-position.js"];                               
                    complete(); 
                }
            });
        }

        if (control == 2) {
            var sql = "SELECT players.id, players_positions.id AS pp_id, fname, lname, positions.name AS position_name FROM players INNER JOIN players_positions ON players.id = players_positions.player_id INNER JOIN positions ON positions.id = players_positions.position_id WHERE positions.id = ?";
            console.log(req.body.searchposition); 
            var inserts = [req.body.searchposition];
            sql = mysql.pool.query(sql,inserts,function(error, results, fields){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }else{
                    console.log(results); 
                    context.players = results; 
                    context.jsscripts = ["deleteplayer-position.js", "selectteam.js", "selectposition.js", "updateplayer-position.js"];                               
                    complete(); 
                }
            });
        }
    }

    function getPositions(res, mysql, context, complete){
        mysql.pool.query("SELECT id, name FROM positions", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.positions = results;
            complete();
        });
    }

    function getPlayer(res, mysql, context, id, complete){
        var sql = "SELECT id, fname, lname, team, years, salary FROM players WHERE id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.player = results[0];
            complete();
        });
    }

     function getPosition(res, mysql, context, id, complete){
            var sql = "SELECT id, name FROM positions WHERE id = ?";
            var inserts = [id];
            mysql.pool.query(sql, inserts, function(error, results, fields){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                context.position = results[0];
                complete();
            });
    }

    function getPlayerPosition(res, mysql, context, id, complete){
        var sql = "SELECT players_positions.id AS pp_id, players.fname AS pp_fname, players.lname AS pp_lname, players.id AS player_id, positions.name AS pp_posname, positions.id AS pos_id FROM players_positions INNER JOIN players ON players_positions.player_id = players.id INNER JOIN positions ON positions.id = players_positions.position_id WHERE players_positions.id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.player_position = results[0];
            console.log(context.player_position); 
            complete();
        });
}


    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteplayer-position.js"];
        var mysql = req.app.get('mysql');
        getPlayers(res, mysql, context, complete, req, 0);
        getPositions(res, mysql, context, complete);
        getTeams(res, mysql, context, complete); 
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('players-positions', context);
            }

        }
    });


    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectposition.js", "updateplayer-position.js"];
        var mysql = req.app.get('mysql');
        getPlayer(res, mysql, context, req.params.id, complete);
        getTeams(res, mysql, context, complete);
        getPlayerPosition(res, mysql, context, req.params.id, complete);
        getPositions(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 4){
                console.log(context); 
                res.render('update-player-position', context);
            }

        }
    });


    router.post('/', function(req, res){
        console.log(req.body.player_id);
        console.log(req.body.position_id);
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO players_positions (player_id, position_id) VALUES (?,?)";
        var inserts = [req.body.player_id, req.body.position_id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/players-positions');
            }
        });
    });


    router.put('/:id', function(req, res){
        console.log(req.body.player_id); 
        console.log(req.body.position_id); 
        console.log(req.params.id); 
        var mysql = req.app.get('mysql');
        var sql = "UPDATE players_positions SET player_id=?, position_id=? WHERE id=?";
        var inserts = [req.body.player_id, req.body.position_id, req.params.id];
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
        var control = 0; 
        if (req.body.searchplayer) {
            control = 1; 
        }
        if (req.body.searchposition) {
            control = 2; 
        }
        var context = {};
        context.jsscripts = ["selectteam.js"];  
        var mysql = req.app.get('mysql');
        getPlayers(res, mysql, context, complete, req, control); 
        getTeams(res, mysql, context, complete);  
        getPositions(res, mysql, context, complete);          
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('players-positions', context);
            }

        }
    });
    
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM players_positions WHERE id = ?";
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