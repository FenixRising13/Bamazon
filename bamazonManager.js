require('console.table');
var inquirer = require('inquirer');
var mysql = require('mysql');
var Chalk = require('chalk');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Bamazon'
});

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
    ask()
});

var ask = function () {
    inquirer.prompt([{
        type: 'list',
        name: 'choice',
        message: 'Menu Options',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']

    }]).then(function (answer) {
        console.log(answer);
        var choice = answer.choice
        connection.query('SELECT * FROM products WHERE id = ?', [answer.choose], function (err3, results) {
            if (err3) throw err3;
            // 
            console.log(results);
            var qty = parseInt(answer.qty);
            var stock;
            var price;

            console.log(qty);


            for (i = 0; i < results.length; i++) {
                stock = results[i].stock_quantity;
                price = results[i].price;
            }
            console.log(stock);
            // If qty is more than stock

        })

    })

}