// require('console.table')
const inquirer = require('inquirer');
const mysql = require('mysql');
const Chalk = require('chalk');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 8889,
  user: 'root',
  password: 'root',
  database: 'Bamazon',
});

connection.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
  readData();
});

const readData = () => {
  connection.query('SELECT id, item, price, stock, platform FROM products',
    (err, res) => {
      if (err) throw err;
      console.table(res);
      ask();
    });
};
// Inquirer function
const ask = () => {
  inquirer.prompt([{
        name: 'choose',
        message: 'What is the ID of the product you would like to buy?',
      },
      {
        name: 'qty',
        message: 'How many would you like?',
      },
    ])
    .then((answer) => {
      connection.query('SELECT * FROM products WHERE id = ?',
        [answer.choose], (err, results) => {
          if (err) throw err;
          // console.log(results);
          const qty = answer.qty;
          // console.log('qty: ' + qty)
          let stock;
          let price;
          for (let i = 0; i < results.length; i++) {
            stock = results[i].stock;
            price = results[i].price;
          }
          // console.log('stock' + stock)
          // If qty is more than stock
          if (answer.choose === '') {
            console.log(Chalk.red('Item Does Not Exist'));
            ask();
          } else if (qty === '') {
            console.log(Chalk.yellow('No quantity entered'));
            ask();
          } else if (qty > stock) {
            console.log(Chalk.red('Insufficient Qty'));
            ask();
            // if quantity is <= stock
          } else {
            console.log(Chalk.green('Your total purchase is $'
            + (price * qty) + ' + tax'));
            update(qty, answer.choose);
          }
        });
    });
};

const update = (qty, id) => {
  connection.query('UPDATE products SET stock = stock - ? WHERE id = ?',
    [qty, id], (err, res) => {
      if (err) throw err;
    });
  connection.end();
};
