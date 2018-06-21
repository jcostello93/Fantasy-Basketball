var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : 'nyknicks1',
  database        : 'nba'
});
module.exports.pool = pool;
