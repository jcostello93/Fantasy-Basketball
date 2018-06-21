var express = require('express');
var mysql = require('./dbcon.js');  
var bodyParser = require('body-parser');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});


app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', 3000);
app.set('mysql', mysql);
app.listen(3000);
app.use(express.static(__dirname + '/public'));

var cors = require('cors');
app.use(cors());

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});



app.use('/players', require('./players.js'));
app.use('/teams', require('./teams.js'));
app.use('/leagues', require('./leagues.js'));
app.use('/locations', require('./locations.js'));
app.use('/positions', require('./positions.js'));
app.use('/players-positions', require('./players-positions.js'));
app.use('/players/search', require('./players.js'));
app.use('/players/filter', require('./players.js'));
app.use('/players/sort', require('./players.js'));
app.use('/teams/search', require('./teams.js'));
app.use('/positions/search', require('./positions.js'));
app.use('/players-positions/search', require('./players-positions.js'));
app.use('/locations/search', require('./locations.js'));
app.use('/locations/sort', require('./locations.js'));
app.use('/fantasy-teams', require('./fantasy-teams.js'));
app.use('/fantasy-teams/remove', require('./fantasy-teams.js'));
//app.use('/fantasy-teams/search', require('./fantasy-teams.js'));
app.use('/matchup', require('./matchup.js'));
app.use('/matchup/change', require('./matchup.js'));
app.use('/matchup/update', require('./matchup.js'));


app.get('/change', function(req, res, next){
  var mysql = req.app.get('mysql');
  var context = {};
  context.jsscripts = ["selectteam.js", "addplayer-position.js",]; 
  var sql = "SELECT id, fname, lname FROM players WHERE team = ?";
  var inserts = [req.query.id];    
  var context = {};    
  sql = mysql.pool.query(sql, inserts, function(error, results, fields){
      if(error){
          res.write(JSON.stringify(error));
          res.status(400);
          res.end();
      }else{
          context.options = results; 
          res.send(context); 
          res.status(202).end();
      }
  })
});

app.get('/remove', function(req, res, next){ 
	var mysql = req.app.get('mysql'); 
	var context = {};
	var sql = "DELETE FROM fantasy_players WHERE playerId=? AND teamId=?";
	var inserts = [req.query.playerId, req.query.fantasyId];
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

app.get('/search', function(req, res, next){ 
	var mysql = req.app.get('mysql'); 
	var context = {};
	var sql = "SELECT playerId, fname, lname, players.teamId, teams.name AS team_name, pos FROM players INNER JOIN teams ON players.teamId = teams.teamId WHERE lname = ?";
	var inserts = [req.query.lname];
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
	});

});

    app.get('/add', function(req, res){
        var mysql = req.app.get('mysql');
	var context = {};
        var sql = "INSERT INTO fantasy_players (playerId, teamId) VALUES (?,?)";
        var inserts = [req.query.playerId, req.query.teamId];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

        var mysql = req.app.get('mysql');
	var sql = "SELECT playerId, fname, lname, players.teamId, teams.name AS team_name, pos FROM players INNER JOIN teams ON players.teamId = teams.teamId WHERE playerId = ?";
        var inserts = [req.query.playerId];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
	    else {
		context.added = results;
		res.send(context);
	    }
	});
	

        });
    });



app.get('/',function(req,res){
  res.render('./home');
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});



