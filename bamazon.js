var mysql = require('mysql');
var inquirer = require('inquirer');
var table = require('cli-table');

var con = mysql.createConnection({
	host: "localhost",
  	user: "root",
  	password: "",
  	database: "bamazon"
});

con.connect(function(err) {
  	if (err) throw err;
  	console.log("Connected as id " + con.threadId);
  	afterConnect();
  	con.end();
});

function afterConnect() {
	con.query('SELECT * FROM products', function(err, results){
		if (err) throw err;
		console.log(results)
		console.log('====================================')
	})
}