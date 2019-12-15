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

//-----prompts

//initial prompt - which type of query?
function menuPrompt(){
    inquirer
        .prompt({
            type: "list",
            name: "promptChoice",
            message: "Make a selection:",
            choices: ["View All Employees", "View All Employees by Department", "View All Employees by Manager", chalk.red("Exit Program")]
          })
        .then(answer => {
            switch(answer.promptChoice){
                case "View All Employees":
                queryEmployeesAll();
                break;

                case "View All Employees by Department":
                queryDepartments();
                break;

                case "View All Employees by Manager":
                queryManagers();
                break;

                case "\u001b[31mExit Program\u001b[39m":
                clear();
                process.exit();                
            }             
        });
}

//department prompt
function promptDepartments(departments){
    inquirer
        .prompt({
            type: "list",
            name: "promptChoice",
            message: "Select Department:",
            choices: departments
          })
        .then(answer => {
            queryEmployeesByDepartment(answer.promptChoice);            
        });
}

//manager prompt
function promptManagers(managers){
    inquirer
        .prompt({
            type: "list",
            name: "promptChoice",
            message: "Select Manager:",
            choices: managers
          })
        .then(answer => {
            queryEmployeesByManager(answer.promptChoice);            
        });
}

//-----queries

//query all employees
function queryEmployeesAll(){
    //sql query
    const query = `
    SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department_name, concat(manager.first_name, " ", manager.last_name) AS manager_full_name
    FROM employee 
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON department.id = role.department_id
	LEFT JOIN employee as manager ON employee.manager_id = manager.id;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        //build table data array from query result
        const tableData = [];
        for (let i = 0; i < res.length; i++) {
            tableData.push({ 
                "ID": res[i].id, 
                "First Name": res[i].first_name,
                "Last Name": res[i].last_name,
                "Role": res[i].title,
                "Salary": res[i].salary, 
                "Department": res[i].department_name,
                "Manager": res[i].manager_full_name
            });
        }
        //render screen
        renderScreen("All Employees", tableData);
    });
}

//query all departments
function queryDepartments(){
    //sql query
    const query = `SELECT department.name FROM department;`;
    connection.query(query, (err, res) => {
        // console.log(res);
        if (err) throw err;
        //extract department names to array
        const departments = [];
        for (let i = 0; i < res.length; i++) {
            departments.push(res[i].name);
        }
        //prompt for department selection
        promptDepartments(departments)
    });
}

//query all managers
function queryManagers(){
    //sql query
    const query = `
    SELECT DISTINCT concat(manager.first_name, " ", manager.last_name) AS full_name
    FROM employee
    LEFT JOIN employee AS manager ON manager.id = employee.manager_id;`;
    connection.query(query, (err, res) => {
        // console.log(res);
        if (err) throw err;
        //extract manager names to array
        const managers = [];
        for (let i = 0; i < res.length; i++) {
            managers.push(res[i].full_name);
        }
        //prompt for manager selection
        promptManagers(managers);
    });
}

//query employees by department
function queryEmployeesByDepartment(department){
    //sql query
    const query = `
    SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, concat(manager.first_name, " ", manager.last_name) AS manager_full_name
    FROM employee 
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN employee AS manager ON employee.manager_id = manager.id
    INNER JOIN department ON department.id = role.department_id
    WHERE department.name = "${department}";`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        //build table data array from query result
        const tableData = [];
        for (let i = 0; i < res.length; i++) {
            tableData.push({ 
                "ID": res[i].id, 
                "First Name": res[i].first_name,
                "Last Name": res[i].last_name,
                "Role": res[i].title,
                "Salary": res[i].salary, 
                "Manager": res[i].manager_full_name
            });
        }
        //render screen
        renderScreen(`${department} Department`, tableData);
    });
}

//query employees by manager
function queryEmployeesByManager(manager){
    //sql query
    const query = `
    SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department_name, concat(manager.first_name, " ", manager.last_name) AS manager_full_name 
    FROM employee 
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN employee AS manager ON employee.manager_id = manager.id
    INNER JOIN department ON department.id = role.department_id
    WHERE concat(manager.first_name, " ", manager.last_name) = "${manager}";`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        //build table data array from query result
        const tableData = [];
        for (let i = 0; i < res.length; i++) {
            tableData.push({ 
                "ID": res[i].id, 
                "First Name": res[i].first_name,
                "Last Name": res[i].last_name,
                "Role": res[i].title,
                "Salary": res[i].salary, 
                "Department": res[i].department_name
            });
        }
        //render screen
        renderScreen(`Employees managed by ${manager}`, tableData);
    });
    console.log(manager);
}