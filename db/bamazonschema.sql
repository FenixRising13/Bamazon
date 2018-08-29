DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE `products` (
  id int(11) NOT NULL AUTO_INCREMENT,
  item_id varchar(255) DEFAULT NULL,
  price decimal(5,2) DEFAULT NULL,
  stock_quantity int(11) DEFAULT NULL,
  department_name varchar(255) DEFAULT NULL,
  cost decimal(5,2) DEFAULT NULL,
  platform varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;