module.exports = function(){
    var express = require('express');
    var router = express.Router();


    function getLeagues(res, mysql, context, complete, req, control){
        if (control == 0) {
            mysql.pool.query("SELECT id, name FROM leagues", function(error, results, fields){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                context.leagues = results;
                context.jsscripts = ["deleteleague.js"];              
                complete();
            }); 
        }

    }

    function getLeague(res, mysql, context, id, complete){
        var sql = "SELECT id, name FROM leagues WHERE id = ?";
        var inserts = [id];
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
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteleague.js"];
        var mysql = req.app.get('mysql');
        getLeagues(res, mysql, context, complete, req, 0);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('leagues', context);
            }

        }
    });


    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectteam.js", "updateleague.js"];
        var mysql = req.app.get('mysql');
        getLeague(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-league', context);
            }

        }
    });


    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO leagues (name) VALUES (?)";
        var inserts = [req.body.name];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/leagues');
            }
        });
    });


    router.put('/:id', function(req, res){
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
    });


    router.delete('/:id', function(req, res){
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
        })
    })

    return router;
}();
