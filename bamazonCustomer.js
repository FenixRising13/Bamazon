import 'console.table'
import { prompt } from 'inquirer'
import { createConnection } from 'mysql'
import { red, green } from 'chalk'

const connection = createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'Bamazon'
})

connection.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack)
    return
  }

  console.log('connected as id ' + connection.threadId)
  ReadData()
})

const ReadData = () => {
  connection.query('SELECT id, item_id, price, stock_quantity, platform FROM products', (err2, res) => {
    if (err2) throw err2
    console.table(res)
    ask()
  })
}
// Inquirer function
const ask = () => {
  prompt([{
    name: 'choose',
    message: 'What is the ID of the product you would like to buy?'
  },
  {
    name: 'qty',
    message: 'How many would you like?'
  }
  ])
    .then((answer) => {
      connection.query('SELECT * FROM products WHERE id = ?', [answer.choose], (err3, results) => {
        if (err3) throw err3
        // console.log(results);
        const qty = parseInt(answer.qty)
        let stock
        let price
        // console.log(qty)

        for (let i = 0; i < results.length; i++) {
          stock = results[i].stock_quantity
          price = results[i].price
        }
        console.log(stock)
        // If qty is more than stock
        if (answer.choose === '') {
          console.log(red('Item Does Not Exist'))
          ask()
        } else if (qty > stock) {
          console.log(red('Insufficient Qty'))
          ask()
          // if quantity is <= stock
        } else {
          console.log(green('Your total purchase is $' + (price * qty) + ' + tax'))
          update(qty, answer.choose)
        }
      })
    })
}

const update = (qty, id) => {
  connection.query('UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?', [qty, id], function (err4, res) {
    if (err4) throw err4
  })
  connection.end()
}
