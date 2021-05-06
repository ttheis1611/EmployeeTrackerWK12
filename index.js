const inquirer = require('inquirer');
//const connection = require('./connection');


const startApp = () => {
    inquirer.prompt({

        type: "list",
        choices: [
            "View All Employees",
            "View All Roles",
            "View Departments",
            "Add Employee",
            "Add Role",
            "Add Department",
            "Update Employee Role",
            "Quit"
        ],
        message: "What would you like to do?",
        name: "userChoice"
    })
        .then(function (result) {
            console.log("You entered: " + result.option);

            switch (result.option) {
                case "View All Employees":
                    break;
                case "View All Roles":
                    break;
                case "View All Departments":
                    break;
                case "Add Employee":
                    break;
                case "Add Role":
                    break;
                case "Add Department":
                    break;
                case "Update Employee Role":
                    break;
                default:
                    Quit();
            }
        })

};

function Quit() {
    process.exit();
}

startApp();