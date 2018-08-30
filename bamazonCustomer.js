// require('console.table')
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
  ReadData()
})

var ReadData = function () {
  connection.query('SELECT id, item, price, stock, platform FROM products', function (err, res) {
    if (err) throw err
    console.table(res)
    ask()
  })
}
// Inquirer function
var ask = function () {
  inquirer.prompt([{
    name: 'choose',
    message: 'What is the ID of the product you would like to buy?'
  },
  {
    name: 'qty',
    message: 'How many would you like?'
  }
  ])
    .then(function (answer) {
      connection.query('SELECT * FROM products WHERE id = ?', [answer.choose], function (err, results) {
        if (err) throw err
        // console.log(results);
        var qty = answer.qty
        // console.log('qty: ' + qty)
        var stock
        var price
        for (var i = 0; i < results.length; i++) {
          stock = results[i].stock
          price = results[i].price
        }
        // console.log('stock' + stock)
        // If qty is more than stock
        if (answer.choose === '') {
          console.log(Chalk.red('Item Does Not Exist'))
          ask()
        } else if (qty === '') {
          console.log(Chalk.yellow('No quantity entered'))
          ask()
        } else if (qty > stock) {
          console.log(Chalk.red('Insufficient Qty'))
          ask()
          // if quantity is <= stock
        } else {
          console.log(Chalk.green('Your total purchase is $' + (price * qty) + ' + tax'))
          update(qty, answer.choose)
        }
      })
    })
}

var update = function (qty, id) {
  connection.query('UPDATE products SET stock = stock - ? WHERE id = ?', [qty, id], function (err, res) {
    if (err) throw err
  })
  connection.end()
}
