require('console.table');
var inquirer = require('inquirer');
var mysql = require('mysql');
var Chalk = require('chalk');
//Don't hate the TA's; Hate the game;//
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
    ask();
});

var ask = function () {
    inquirer.prompt([{
        type: 'list',
        name: 'choice',
        message: 'Menu Options',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit']

    }]).then(function (answer) {
        var choice = answer.choice

        // Action for option 1 //
        if (choice == 'View Products for Sale') {
            display();
        }
        // Action for option 2 //
        else if (choice == 'View Low Inventory') {
            lowInv();
        }
        // Action for option 3 //
        else if (choice == 'Add to Inventory') {
            updateInv();
        }
        // Action for option 4 //
        else if (choice == 'Add New Product') {
            newProduct();
        }
        // Exit //
        else if (choice == 'Exit') {
            exit();
        }
    })
}

function display() {
    connection.query('SELECT id, item_id, price, stock_quantity FROM products', function (err, results) {
        if (err) throw err;

        console.table(results);
        ask();
    })
}

function lowInv(results) {
    var stock;

    connection.query('SELECT id, item_id, price, stock_quantity FROM products', function (err, results) {
        if (err) throw err;

        for (i = 0; i < results.length; i++) {
            stock = results[i].stock_quantity;
        }
        console.table(stock);

    })
    ask();
}

function updateInv() {
    ask();
}

function newProduct() {
    inquirer.prompt([{
        name: 'item_id',
        message: 'Describe the item you would like to add (Caps Please).'
    },

    {
        name: 'price',
        message: 'What is the price of this item?'
    },

    {
        name: 'stock',
        message: 'How many will you be adding to inventory?'

    }]).then(function (answer) {



        // ask();
    })
    
}

function exit() {
    connection.end();
}


