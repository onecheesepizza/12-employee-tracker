const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const clear = require('console-clear');
const chalk = require('chalk');

//-----DB connection
const connection = mysql.createConnection({
    //host and port
    host: "localhost",
    port: 3306,
    //credentials
    user: "root",
    password: "",
    database: "employeesDB"
});
connection.connect(function(err) {
    if (err) throw err;
    //start app on DB connection
    startApp();
});

//-----start app with initial prompt
function startApp(){
    //clear console
    clear();
    //render header
    renderHeader()
    //menu prompt
    menuPrompt();
}

//-----render functions
//render header
function renderHeader(){
    console.log(chalk.hex("#00FFFF")(String.raw`
    ____      _ __            __  
   /  _/___  (_) /____  _____/ /_ 
   / // __ \/ / __/ _ \/ ___/ __ \
 _/ // / / / / /_/  __/ /__/ / / /
/___/_/ /_/_/\__/\___/\___/_/ /_/ `));
   console.log(chalk.dim("  Employee Database\n"));
}

//render table data and menu prompt
function renderScreen(tableTitle, tableData){
    //clear console
    clear();
    //render header
    renderHeader();
    //log table title to console in inverse colors
    console.log(chalk.inverse.bold(tableTitle));
    //log table to console
    console.table(tableData);
    //menu prompt
    menuPrompt();
}

//-----initial prompt - which type of query?
function menuPrompt(){
    inquirer
        .prompt({
            type: "list",
            name: "promptChoice",
            message: "Make a selection:",
            choices: ["View All Employees", chalk.red("Exit Program")]
          })
        .then(answer => {
            switch(answer.promptChoice){
                case "View All Employees":
                queryEmployeesAll();
                break;

                case "\u001b[31mExit Program\u001b[39m":
                clear();
                process.exit();                
            }             
        });
}

//-----queries
function queryEmployeesAll(){
    //sql query
    const query = `
    SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, concat(manager.first_name, " ", manager.last_name) AS manager_full_name
    FROM employee 
    LEFT JOIN role ON employee.role_id = role.id
	LEFT JOIN employee as manager ON employee.manager_id = manager.id;`;
    connection.query(query, (err, res) => {
        console.log(res);
        if (err) throw err;
        //build table data array from query result
        const tableData = [];
        for (let i = 0; i < res.length; i++) {
            tableData.push({ 
                "ID": res[i].id, 
                "First Name": res[i].first_name,
                "Last Name": res[i].last_name,
                "Role": res[i].title,
                "Role Salary": res[i].salary, 
                "Manager": res[i].manager_full_name
            });
        }
        //render screen
        renderScreen("Employee Details", tableData);
    });
}