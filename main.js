var express = require('express');
var session = require('express-session');
var mysql = require('./dbcon.js');  
var bodyParser = require('body-parser');
var fs = require('fs');
var bcrypt = require("bcryptjs");


var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});


var key = fs.readFileSync('encryption/private.key');
var cert = fs.readFileSync('encryption/fantasyproject_me.crt');
var ca = fs.readFileSync('encryption/fantasyproject_me.ca-bundle'); 

var options = {
  key: key,
  cert: cert, 
  ca: ca
};

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);

app.set('mysql', mysql);
app.use(express.static(__dirname + '/public'));

var https = require('https');
https.createServer(options, app).listen(443);


var http = require('http');
http.createServer(app).listen(80);


var forceSsl = require('express-force-ssl');
app.use(forceSsl);


app.use(session({
  secret: "thisisapassword1",
  resave: true,
  saveUninitialized: true,
}));;



app.use('/players', require('./players.js'));
app.use('/teams', require('./teams.js'));
app.use('/leagues', require('./leaguesServer.js'));
app.use('/leagues/join', require('./leaguesServer.js'));
app.use('/leagues/exit', require('./leaguesServer.js'));
app.use('/leagues/display', require('./leaguesServer.js'));
app.use('/register', require('./registerServer.js')); 
app.use('/locations', require('./locations.js'));
app.use('/positions', require('./positions.js'));
app.use('/user', require('./user.js')); 
app.use('/password', require('./passwordServer.js')); 
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
app.use('/fantasy-teams/change', require('./fantasy-teams.js'));
app.use('/fantasy-teams/remove', require('./fantasy-teams.js'));
//app.use('/fantasy-teams/search', require('./fantasy-teams.js'));
app.use('/matchup', require('./matchup.js'));
app.use('/matchup/change', require('./matchup.js'));
app.use('/matchup/update', require('./matchup.js'));

function isLoggedIn(req) {
		if (!req.session.username) {
			return 0;
		}
		return 1; 
	}


app.get('/change', function(req, res, next){
	if (isLoggedIn(req) == 0) {
		res.redirect('/'); 
	}
	else {
		var context = {};
		var mysql = req.app.get('mysql');
		var sql = "SELECT playerId, fname, lname FROM players WHERE teamId = ? AND playerId NOT IN (SELECT playerId FROM fantasy_players WHERE teamId = ?) ORDER BY lname";
		var inserts = [req.query.id, req.query.fantasyId];
		sql = mysql.pool.query(sql,inserts,function(error, results, fields){
			if(error){
				console.log(error); 
				res.write(JSON.stringify(error));
				res.end();
			}else{
				context.options = results; 
				res.send(context); 
			}
		});
	}
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
	var sql = "SELECT playerId, fname, lname, players.teamId, teams.name AS team_name, pos FROM players INNER JOIN teams ON players.teamId = teams.teamId WHERE (lname = ? OR fname = ?) AND playerId NOT IN (SELECT playerId FROM fantasy_players WHERE teamId = ?)";
	var inserts = [req.query.lname, req.query.lname, req.query.fantasyId];
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


app.post('/login', function(req, res, next){ 
	var mysql = req.app.get('mysql');
	var responseObject = {}; 
	var context = {}; 
	isLoginAuthentic(req.body.username, req.body.password, mysql, responseObject, function() {
		if (responseObject.answer == true) {
			req.session.username = req.body.username; 
			req.session.userId = responseObject.id; 
			if (req.body.password.length > 20) {
				res.send("update"); 
			}
			else {			
				res.send(req.body.username); 
			}
		}
		else {
			res.send("-1"); 
		}
	});
});

app.get('/login', function(req, res, next) {
	res.send(req.session.username); 
});
  
app.get('/logout', function(req, res, next) {
	delete req.session.username; 
	delete req.session.userId; 
	res.redirect('/'); 
}); 
  
app.get('/',function(req,res){
	var context = {};
	context.homepage = true;
	res.render('./home', context);
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


function isLoginAuthentic(username, password, mysql, responseObject, callback) {
	var sql = "SELECT id, username, passwordHash, salt FROM users WHERE username = ?";
	var inserts = [username];
	sql = mysql.pool.query(sql, inserts, function(error, rows, fields){
		if (error) {
			console.log(error); 
		}
		else {
			if (rows[0]) {
				var hash = rows[0].passwordHash; 
				var salt = rows[0].salt; 	
				responseObject.id = rows[0].id; 				
				bcrypt.compare(password, hash, function(err, res) {
					responseObject.answer = res; 
					callback(); 
				});
			}
			else {
				responseObject.answer = false; 
				callback(); 
			}
		}
	});
	
}


