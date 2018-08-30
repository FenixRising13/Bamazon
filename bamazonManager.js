require('console.table')
var inquirer = require('inquirer')
var mysql = require('mysql')
var Chalk = require('chalk')

var connection = mysql.createConnection({
  host: 'localhost',
  port: 8889,
  user: 'root',
  password: 'root',
  database: 'Bamazon'
})

connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack)
    return
  }

  console.log('connected as id ' + connection.threadId)
  ask()
})

var ask = function () {
  inquirer.prompt([{
    type: 'list',
    name: 'choice',
    message: 'Menu Options',
    choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit']
  }]).then(function (answer) {
    var choice = answer.choice
    if (choice === 'View Products for Sale') {
      display()
    } else if (choice === 'View Low Inventory') {
      lowInv()
    } else if (choice === 'Add to Inventory') {
      updateInv()
    } else if (choice === 'Add New Product') {
      newProduct()
    } else if (choice === 'Exit') {
      exit()
    }
  })
}

function display () {
  connection.query('SELECT id, item, price, stock FROM products', function (err, results) {
    if (err) throw err
    console.table(results)
    ask()
  })
}

function lowInv (results) {
  connection.query('SELECT id, item, price, stock FROM products WHERE stock < 5', function (err, results) {
    if (err) throw err
    for (var i = 0; i < results.length; i++) {
      console.log(
        Chalk.yellow('\nLow Inventory'),
        '\nItem: ' + results[i].item,
        '\nQty: ' + results[i].stock)
    }
  })
  ask()
}

function updateInv () {
  inquirer.prompt([{
    name: 'choose',
    message: 'What is the ID of the product you would like to update?'
  },
  {
    name: 'qty',
    message: 'How many in stock?'
  }
  ]).then(function (answer) {
    var newStock = answer.qty
    var id = answer.choose
    connection.query('UPDATE products SET stock = ? WHERE id=?', [newStock, id], function (err, results) {
      if (err) throw err
      console.log(Chalk.green('\nYou updated the qty of ' + id + ' to: ' + newStock))
      ask()
    })
  })
}

function newProduct () {
  inquirer.prompt([{
    name: 'item',
    message: 'Describe the item you would like to add (Caps Please).'
  },
  {
    name: 'price',
    message: 'What is the price of this item?'
  },
  {
    name: 'department',
    message: 'What department would you like it to be added to?'
  },
  {
    name: 'stock',
    message: 'How many will you be adding to inventory?'
  },
  {
    name: 'cost',
    message: 'How much do these cost (wholesale)?'
  }
  ]).then(function (answer) {
    connection.query('INSERT INTO products (item, price, stock, department, cost) VALUES (?,?,?,?,?)', [answer.item, answer.price, answer.stock, answer.department, answer.cost], function (err, res) {
      if (err) throw err
      console.log('You added: ' + answer.item)
      ask()
    })
  })
}

function exit () {
  connection.end()
}
