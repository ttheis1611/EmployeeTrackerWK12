-- all tables
SELECT * FROM departments;
SELECT * FROM roles;
SELECT * FROM employee;

--add department
INSERT INTO department(dept_name) values ('');
--add role
INSERT INTO roles(title, salary, department_id) values ('');
--add employee
INSERT INTO employee(first_name, last_name, role_id, manager_id) values ('');
--update employee role
UPDATE employee SET role_id = '' WHERE employee.id = '';

-- all roles
SELECT roles.title, roles.id, department.dept_name, roles.salary FROM roles, department WHERE department.id = roles.department_id;

--all employee by department query
SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.dept_name, roles.salary, FROM employee INNER JOIN roles ON roles.id = employee.role_id
INNER JOIN department ON department_id = roles.department_id
WHERE department.dept_name = 'Management';

-- all employee data query
SELECT
  employee.id,
  employee.first_name, 
  employee.last_name, 
  roles.title, 
  roles.salary
FROM employee JOIN roles on roles.id

-- employee and departments
SELECT  
    employee.id,
    employee.first_name, 
    employee.last_name, 
    roles.title,
    department.dept_name,
    roles.salary,
FROM employee INNER JOIN roles ON roles.id = employee.role_id
INNER JOIN department ON department_id;

-- total budget
SELECT d.dept_name AS Department, sum(r.salary) AS Salary_Total FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN roles r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id GROUP By department;
