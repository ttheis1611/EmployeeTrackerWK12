DROP DATABASE IF EXISTS business_db ;
CREATE DATABASE business_db;

USE business_db;

CREATE TABLE department(
  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  dept_name varchar(30)
);

CREATE TABLE roles(
  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NULL,
  salary decimal (10,2) NULL,
  department_id INT NULL,
  FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name varchar(30) NOT NULL,
  last_name varchar(30) NOT NULL,
  role_id INT,
  manager_id INT,
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id) 
);