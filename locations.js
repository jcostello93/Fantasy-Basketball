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

    function getLocations(res, mysql, context, complete, req, control){
        if (control == 0) {
            mysql.pool.query("SELECT id, city, state, population FROM locations", function(error, results, fields){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                context.jsscripts = ["deletelocation.js"];         
                context.locations = results;
                complete();
            });
        }

        if (control == 1) {
            var sql = "SELECT id, city, state, population FROM locations WHERE city = ?";
            var inserts = [req.body.searchlocation];
            mysql.pool.query(sql, inserts, function(error, results, fields){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                context.jsscripts = ["deletelocation.js"];         
                context.locations = results; 
                complete();
            }); 
        }

        if (control == 2) {
            mysql.pool.query("SELECT id, city, state, population FROM locations ORDER BY population DESC", function(error, results, fields){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                context.locations = results;
                context.jsscripts = ["deletelocation.js"];         
                complete();
            }); 
        }
    }

    function getLocation(res, mysql, context, id, complete){
        var sql = "SELECT id, city, state, population FROM locations WHERE locations.id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.location = results[0];
            complete();
        });
    }


    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletelocation.js"];
        var mysql = req.app.get('mysql');
        getLocations(res, mysql, context, complete, req, 0);
        getTeams(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('locations', context);
            }

        }
    });


    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectteam.js", "updatelocation.js"];
        var mysql = req.app.get('mysql');
        getLocation(res, mysql, context, req.params.id, complete);
        getTeams(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-location', context);
            }

        }
    });


    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO locations (city, state, population) VALUES (?,?,?)";
        var inserts = [req.body.city, req.body.state, req.body.population];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/locations');
            }
        });
    });


    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE locations SET city=?, state=?, population=? WHERE id=?";
        var inserts = [req.body.city, req.body.state, req.body.population, req.params.id];
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
        getLocations(res, mysql, context, complete, req, 1); 
        getTeams(res, mysql, context, complete);           
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('locations', context);
            }

        }
    });

    router.post('/sort', function(req, res){
        var callbackCount = 0;     
        var context = {};
        var mysql = req.app.get('mysql');
        getLocations(res, mysql, context, complete, req, 2); 
        getTeams(res, mysql, context, complete);     
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('locations', context);
            }
        }        
    });


    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM locations WHERE id = ?";
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