var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

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
  	// con.end();
});

function afterConnect() {
	con.query('SELECT * FROM products', function(err, results) {
		if (err) throw err;

		var table = new Table({
		    head: ['Item ID', 'Product', 'Department', 'Price', 'Stock #']
		  , colWidths: [10, 20, 20, 10, 10]
		});

		table.push(
		    [results[0].item_id, results[0].product_name, results[0].department_name, "$" + results[0].price, results[0].stock_quantity]
		  , [results[1].item_id, results[1].product_name, results[1].department_name, "$" + results[1].price, results[1].stock_quantity]
		  , [results[2].item_id, results[2].product_name, results[2].department_name, "$" + results[2].price, results[2].stock_quantity]
		  , [results[3].item_id, results[3].product_name, results[3].department_name, "$" + results[3].price, results[3].stock_quantity]
		  , [results[4].item_id, results[4].product_name, results[4].department_name, "$" + results[4].price, results[4].stock_quantity]
		  , [results[5].item_id, results[5].product_name, results[5].department_name, "$" + results[5].price, results[5].stock_quantity]
		  , [results[6].item_id, results[6].product_name, results[6].department_name, "$" + results[6].price, results[6].stock_quantity]
		  , [results[7].item_id, results[7].product_name, results[7].department_name, "$" + results[7].price, results[7].stock_quantity]
		  , [results[8].item_id, results[8].product_name, results[8].department_name, "$" + results[8].price, results[8].stock_quantity]
		  , [results[9].item_id, results[9].product_name, results[9].department_name, "$" + results[9].price, results[9].stock_quantity]
		); 

		console.log(table.toString());

		function promptUser() {
			inquirer.prompt([
			    {
			      	type: "input",
			      	message: "What is the ID of the product you wish to buy?",
			      	name: "item_id",
			      	validate: function (input) {
					    var done = this.async();
					    setTimeout(function() {
					    	if (isNaN(+input)) {
					    		done('You must provide a number');
					        	return;
					      	}
					    	done(null, true);
					    }, 0);
					}
			    },
			    {
			      	type: "input",
			      	message: "How many do you wish to buy?",
			      	name: "quantity",
			      	validate: function (input) {
					    var done = this.async();
					    setTimeout(function() {
					    	if (isNaN(+input)) {
					    		done('You must provide a number');
					        	return;
					      	}
					    	done(null, true);
					    }, 0);
					}
			    },
			]).then(function(response) {
				if(response.quantity > results[response.item_id - 1].stock_quantity) {
					console.log('That amount exceeds our stock. We currently have ' + results[response.item_id - 1].stock_quantity + ' in inventory.')
					promptUser()
				} else {
					var newStock = results[response.item_id - 1].stock_quantity - response.quantity;

					function updateProduct() {
						var query = con.query(
						    "UPDATE products SET ? WHERE ?",
						    [
						      {
						      	stock_quantity: newStock
						      },
						      {
						        item_id: response.item_id
						      }
						    ],
						    function(err, results) {
						    	if (err) throw err;
						    	console.log(results);
						    }
						);
					}

					updateProduct();

					console.log('That will be $' + (response.quantity * results[response.item_id - 1].price) + ' . Thank you very much!');
				}
			});	
		}
		promptUser();	
	})
}