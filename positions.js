module.exports = function(){
    var express = require('express');
    var router = express.Router();


    function getPositions(res, mysql, context, complete, req, control){
        if (control == 0)  {
            mysql.pool.query("SELECT id, name FROM positions", function(error, results, fields){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                context.jsscripts = ["deleteposition.js", "selectteam.js"];          
                context.positions = results;
                complete();
            }); 
        }
            
        if (control == 1) {
            var sql = "SELECT id, name FROM positions WHERE name = ?";
            var inserts = [req.body.searchposition];
            console.log(req.body.searchposition); 
            sql = mysql.pool.query(sql,inserts,function(error, results, fields){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }else{
                    context.positions = results; 
                    console.log(results);
                    context.jsscripts = ["deleteposition.js", "selectteam.js"];                  
                    complete(); 
                }
            });
        }
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


    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteposition.js"];
        var mysql = req.app.get('mysql');
        getPositions(res, mysql, context, complete, req, 0);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('positions', context);
            }

        }
    });


    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectteam.js", "updateposition.js"];
        var mysql = req.app.get('mysql');
        getPosition(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-position', context);
            }

        }
    });


    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO positions (name) VALUES (?)";
        var inserts = [req.body.name];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/positions');
            }
        });
    });

    /* The URI that update data is sent to in order to update a person */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE positions SET name=? WHERE id=?";
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

    router.post('/search', function(req, res){
        var callbackCount = 0;             
        var context = {};
        context.jsscripts = ["selectteam.js"];  
        var mysql = req.app.get('mysql');
        getPositions(res, mysql, context, complete, req, 1); 
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('positions', context);
            }

        }
    });
    
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM positions WHERE id = ?";
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
