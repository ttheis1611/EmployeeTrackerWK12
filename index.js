const mysql = require("mysql2");
const inquirer = require("inquirer");
const connection = require("./db/connection");


class Database {
    constructor(config) {
        this.connection = mysql.createConnection(config);
    }

    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
}

const db = new Database({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "PASSWORD",
    database: "business_db"
});

// Builds complete employee table
async function showEmployeeSummary() {
    console.log(' ');
    await db.query('SELECT e.id, e.first_name AS First_Name, e.last_name AS Last_Name, r.title AS Title, r.salary AS Salary, d.dept_name AS Department, CONCAT(m.first_name, " ", m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN roles r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id ORDER BY e.id', (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
    });
};

// Builds a table which shows existing roles and their departments
async function showRoleSummary() {
    console.log(' ');
    await db.query('SELECT r.id, r.title, r.salary, d.dept_name AS department FROM roles r LEFT JOIN department d ON r.department_id = d.id', (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
    })
};

// Builds a table which shows existing departments
async function showDepartments() {
    console.log(' ');
    await db.query('SELECT id, dept_name AS department FROM department', (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
    })
};

// Called inside inquirers to check that the user isn't just trying to fill spots with empty space
async function confirmStringInput(input) {
    if ((input.trim() != "") && (input.trim().length <= 30)) {
        return true;
    }
    return "Invalid input. Please limit your input to 30 characters or less."
};

// Adds a new employee after asking for name, role, and manager
async function addEmployee() {
    let positions = await db.query('SELECT id, title FROM roles');
    let managers = await db.query('SELECT id, CONCAT(first_name, " ", last_name) AS Manager FROM employee');
    managers.unshift({ id: null, Manager: "None" });

    inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "Enter employee's first name:",
            validate: confirmStringInput
        },
        {
            name: "lastName",
            type: "input",
            message: "Enter employee's last name:",
            validate: confirmStringInput
        },
        {
            name: "role",
            type: "list",
            message: "Choose employee role:",
            choices: positions.map(obj => obj.title)
        },
        {
            name: "manager",
            type: "list",
            message: "Choose the employee's manager:",
            choices: managers.map(obj => obj.Manager)
        }
    ]).then(answers => {
        let positionDetails = positions.find(obj => obj.title === answers.role);
        let manager = managers.find(obj => obj.Manager === answers.manager);
        db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?)", [[answers.firstName.trim(), answers.lastName.trim(), positionDetails.id, manager.id]]);
        console.log("\x1b[32m", `${answers.firstName} was added to the employee database!`);
        startApp();
    });
};

// Removes an employee from the database
async function removeEmployee() {
    let employees = await db.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee');
    employees.push({ id: null, name: "Cancel" });

    inquirer.prompt([
        {
            name: "employeeName",
            type: "list",
            message: "Remove which employee?",
            choices: employees.map(obj => obj.name)
        }
    ]).then(response => {
        if (response.employeeName !== "Cancel") {
            let unluckyEmployee = employees.find(obj => obj.name === response.employeeName);
            db.query("DELETE FROM employee WHERE id=?", unluckyEmployee.id);
            console.log("\x1b[32m", `${response.employeeName} was let go...`);
        }
        startApp();
    })
};

// Change the employee's manager. Also prevents employee from being their own manager
async function updateManager() {
    let employees = await db.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee');
    employees.push({ id: null, name: "Cancel" });

    inquirer.prompt([
        {
            name: "empName",
            type: "list",
            message: "For which employee?",
            choices: employees.map(obj => obj.name)
        }
    ]).then(employeeInfo => {
        if (employeeInfo.empName === "Cancel") {
            startApp();
            return;
        }
        let managers = employees.filter(currEmployee => currEmployee.name != employeeInfo.empName);
        for (i in managers) {
            if (managers[i].name === "Cancel") {
                managers[i].name = "None";
            }
        };

        inquirer.prompt([
            {
                name: "mgName",
                type: "list",
                message: "Change their manager to:",
                choices: managers.map(obj => obj.name)
            }
        ]).then(managerInfo => {
            let empID = employees.find(obj => obj.name === employeeInfo.empName).id
            let mgID = managers.find(obj => obj.name === managerInfo.mgName).id
            db.query("UPDATE employee SET manager_id=? WHERE id=?", [mgID, empID]);
            console.log("\x1b[32m", `${employeeInfo.empName} now reports to ${managerInfo.mgName}`);
            startApp();
        })
    })
};

// Updates the selected employee's role
async function updateEmployeeRole() {
    let roles = await db.query('SELECT id, title FROM roles');
    let employees = await db.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee');
    employees.push({ id: null, name: "Cancel" });

    inquirer.prompt([
        {
            name: "empName",
            type: "list",
            message: "For which employee?",
            choices: employees.map(obj => obj.name)
        },
        {
            name: "newRole",
            type: "list",
            message: "Change their role to:",
            choices: roles.map(obj => obj.title)
        }
    ]).then(answers => {
        if (answers.empName !== "Cancel") {
            let empID = employees.find(obj => obj.name === answers.empName).id
            let roleID = roles.find(obj => obj.title === answers.newRole).id
            db.query("UPDATE employee SET role_id=? WHERE id=?", [roleID, empID]);
            console.log("\x1b[32m", `${answers.empName} new role is ${answers.newRole}`);
        }
            startApp();
        
    })
};

// Add a new role to the database
async function addRole() {
    let departments = await db.query('SELECT * FROM department');

    inquirer.prompt([
        {
            name: "roleName",
            type: "input",
            message: "Enter new role title:",
            validate: confirmStringInput
        },
        {
            name: "salaryNum",
            type: "number",
            message: "Enter role's salary:",
            // validate: num => {
            //     if (isNaN(parseInt(num))) {
            //         return true;
            //     }
            //     return "Please enter a valid number."
            // }
        },
        {
            name: "roleDepartment",
            type: "list",
            message: "Choose the role's department:",
            choices: departments.map(obj => obj.dept_name)
        }
    ]).then(answers => {
        const depID = departments.find(obj => obj.dept_name === answers.roleDepartment).id
        db.query("INSERT INTO roles (title, salary, department_id) VALUES (?)", [[answers.roleName, answers.salaryNum, depID]]);
        console.log("\x1b[32m", `${answers.roleName} was added. Department: ${answers.roleDepartment}`);
        startApp();
    })
};

// Updates a role on the database
async function updateRole() {
    let roles = await db.query('SELECT id, title FROM roles');
    roles.push({ id: null, title: "Cancel" });
    let departments = await db.query('SELECT * FROM department');

    inquirer.prompt([
        {
            name: "roleName",
            type: "list",
            message: "Update which role?",
            choices: roles.map(obj => obj.title)
        }
    ]).then(response => {
        if (response.roleName === "Cancel") {
            startApp();
            return;
        }
        inquirer.prompt([
            {
                name: "salaryNum",
                type: "number",
                message: "Enter role's salary:",
                // validate: input => {
                //     if (isNaN(parseInt(input))) {
                //         return true;
                //     }
                //     return "Please enter a valid number."
                // }
            },
            {
                name: "roleDepartment",
                type: "list",
                message: "Choose the role's department:",
                choices: departments.map(obj => obj.dept_name)
            }
        ]).then(answers => {
            let depID = departments.find(obj => obj.dept_name === answers.roleDepartment).id
            let roleID = roles.find(obj => obj.title === response.roleName).id
            db.query("UPDATE roles SET title=?, salary=?, department_id=? WHERE id=?", [response.roleName, answers.salaryNum, depID, roleID]);
            console.log("\x1b[32m", `${response.roleName} was updated.`);
            startApp();
        })
    })
};

// Remove a role from the database
async function removeRole() {
    let roles = await db.query('SELECT id, title FROM roles');
    roles.push({ id: null, title: "Cancel" });

    inquirer.prompt([
        {
            name: "roleName",
            type: "list",
            message: "Remove which role?",
            choices: roles.map(obj => obj.title)
        }
    ]).then(response => {
        if (response.roleName !== "Cancel") {
            let noMoreRole = roles.find(obj => obj.title === response.roleName);
            db.query("DELETE FROM roles WHERE id=?", noMoreRole.id);
            console.log("\x1b[32m", `${response.roleName} was removed. Please reassign associated employees.`);
        }
        startApp();
    })
};

// Add a new department to the database
async function addDepartment() {
    inquirer.prompt([
        {
            name: "depName",
            type: "input",
            message: "Enter new department:",
            validate: confirmStringInput
        }
    ]).then(answers => {
        db.query("INSERT INTO department (dept_name) VALUES (?)", [answers.depName]);
        console.log("\x1b[32m", `${answers.depName} was added to departments.`);
        startApp();
    })
};

// Remove a department from the database
async function removeDepartment() {
    let departments = await db.query('SELECT id, dept_name FROM department');
    departments.push({ id: null, dept_name: "Cancel" });

    inquirer.prompt([
        {
            name: "depName",
            type: "list",
            message: "Remove which department?",
            choices: departments.map(obj => obj.dept_name)
        }
    ]).then(response => {
        if (response.depName !== "Cancel") {
            let deleteDepartment = departments.find(obj => obj.dept_name === response.depName);
            db.query("DELETE FROM department WHERE id=?", deleteDepartment.id);
            console.log("\x1b[32m", `${response.depName} was removed. Please reassign associated roles.`);
        }
        startApp();
    })
};

// Options to make changes to employees specifically
function editEmployeeOptions() {
    inquirer.prompt({
        name: "editChoice",
        type: "list",
        message: "What would you like to update?",
        choices: [
            "Add A New Employee",
            "Change Employee Role",
            "Change Employee Manager",
            "Remove An Employee",
            "Return To Main Menu"
        ]
    }).then(response => {
        switch (response.editChoice) {
            case "Add A New Employee":
                addEmployee();
                break;
            case "Change Employee Role":
                updateEmployeeRole();
                break;
            case "Change Employee Manager":
                updateManager();
                break;
            case "Remove An Employee":
                removeEmployee();
                break;
            case "Return To Main Menu":
                startApp();
                break;
        }
    })
};

// Options to make changes to roles
function editRoleOptions() {
    inquirer.prompt({
        name: "editRoles",
        type: "list",
        message: "What would you like to update?",
        choices: [
            "Add A New Role",
            "Update A Role",
            "Remove A Role",
            "Return To Main Menu"
        ]
    }).then(responses => {
        switch (responses.editRoles) {
            case "Add A New Role":
                addRole();
                break;
            case "Update A Role":
                updateRole();
                break;
            case "Remove A Role":
                removeRole();
                break;
            case "Return To Main Menu":
                startApp();
                break;
        }
    })
};

// Options to make changes to departments
function editDepartmentOptions() {
    inquirer.prompt({
        name: "editDeps",
        type: "list",
        message: "What would you like to update?",
        choices: [
            "Add A New Department",
            "Remove A Department",
            "Return To Main Menu"
        ]
    }).then(responses => {
        switch (responses.editDeps) {
            case "Add A New Department":
                addDepartment();
                break;
            case "Remove A Department":
                removeDepartment();
                break;
            case "Return To Main Menu":
                startApp();
                break;
        }
    })
};

// Main interface loop. Called after pretty much every function completes
function startApp() {
    inquirer.prompt({
        name: "mainmenu",
        type: "list",
        message: "Main Menu: What would you like to do?",
        choices: [
            "View All Employees",
            "Edit Employeee Info",
            "View Roles",
            "Edit Roles",
            "View Departments",
            "Edit Departments",
            "Quit"
        ]
    }).then(responses => {
        switch (responses.mainmenu) {
            case "View All Employees":
                showEmployeeSummary();
                break;
            case "Edit Employeee Info":
                editEmployeeOptions();
                break;
            case "View Roles":
                showRoleSummary();
                break;
            case "Edit Roles":
                editRoleOptions();
                break;
            case "View Departments":
                showDepartments();
                break;
            case "Edit Departments":
                editDepartmentOptions();
                break;
            default:
                quit();
        }
    });
}

// Quit function to escape app
function quit() {
    connection.end();
    process.exit();
}
// ETM employee tracking system on app start.

console.log("^^^***********************************************^^^\n|	________     __________     __      __      |\n|      |   _____|   |____  ____|   |   |  |   |     |\n|      |  |___           | |       |  _ || _  |     |\n|      |   ___|          | |       | | |  | | |     |\n|      |  |_____         | |       | |  ||  | |     |\n|      |________|        |_|       |_|      |_|     |\n|                                                   |\n|	      Employee Tracking Manager             |\n|                                                   |\n^^^***********************************************^^^\n\nv1.0.0\nMAIN MENU\n");

startApp();
