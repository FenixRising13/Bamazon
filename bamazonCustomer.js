require('console.table');
var inquirer = require('inquirer');
var mysql = require('mysql');
var Chalk = require('chalk');
var colors = require('colors');

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
    ReadData()
});

var ReadData = function () {

    connection.query('SELECT id, item_id, price, stock_quantity, platform FROM products', function (err2, res) {
        if (err2) throw err2;
        console.table(res);
        ask()
    })
}
// Inquirer function
var ask = function () {
    inquirer.prompt([
        {
            name: 'choose',
            message: 'What is the ID of the product you would like to buy?'
        },
        {
            name: 'qty',
            message: 'How many would you like?',
        }
    ])
        .then(function (answer) {
            connection.query('SELECT * FROM products WHERE id = ?', [answer.choose], function (err3, results) {
                if (err3) throw err3;
                // 
                // console.log(results);
                var qty = parseInt(answer.qty);
                var stock;
                var price;
                // console.log(qty); 


                for (i = 0; i < results.length; i++) {
                    stock = results[i].stock_quantity;
                    price = results[i].price;
                }
                console.log(stock);
                // If qty is more than stock
                if (answer.choose == '') {
                    console.log(Chalk.red('Item Does Not Exist'));
                    ask();
                }
                else if (qty > stock) {
                    console.log(Chalk.red('Insufficient Qty'));
                    ask();
                }
                // if quantity is <= stock
                else {
                    console.log(Chalk.green('Your total purchase is $' + (price * qty)));
                    update(qty, answer.choose);
                }

            })

        })

}

var update = function (qty, id) {
    connection.query('UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?', [qty, id], function (err4, res) {
        if (err4) throw err4;
    })
    connection.end();
}