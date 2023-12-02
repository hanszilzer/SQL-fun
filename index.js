const inquirer = require('inquirer');
const connection = require('./db/db');

async function main() {
    const { action } = await inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'Select an action:',
        choices: [
            'View All Departments',
            'View All Roles',
            'View All Employees',
            'Add Department',
            'Add Role',
            'Add Employee',
            'Update Employee Role'
        ]
    });

    switch (action) {
        case 'View All Departments':
            viewAllDepartments();
            break;
        case 'View All Roles':
            viewAllRoles();
            break;
        case 'View All Employees':
            viewAllEmployees();
            break;
        case 'Add Department':
            addDepartment();
            break;
        case 'Add Role':
            addRole();
            break;
        case 'Add Employee':
            addEmployee();
            break;
        case 'Update Employee Role':
            updateEmployeeRole();
            break;
        default:
            console.error('Invalid action');
            break;
    }
}

function viewAllDepartments() {
    connection.query('SELECT * FROM department', (err, results) => {
        if (err) {
            console.error('Error fetching departments:', err);
            return;
        }
        console.table(results);
        main(); // Continue with the main menu
    });
}

function viewAllRoles() {
    connection.query(`
        SELECT r.title, r.salary, d.name AS department
        FROM role r
        JOIN department d ON r.department_id = d.id
    `, (err, results) => {
        if (err) {
            console.error('Error fetching roles:', err);
            return;
        }
        console.table(results);
        main(); // Continue with the main menu
    });
}

function viewAllEmployees() {
    connection.query(`
        SELECT e.id, e.first_name, e.last_name, r.title AS job_title, d.name AS department
        FROM employee e
        JOIN role r ON e.role_id = r.id
        JOIN department d ON r.department_id = d.id
    `, (err, results) => {
        if (err) {
            console.error('Error fetching employees:', err);
            return;
        }
        console.table(results);
        main(); // Continue with the main menu
    });
}

function addDepartment() {
    inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'Enter the name of the department:'
    }).then((answers) => {
        connection.query('INSERT INTO department SET ?', { name: answers.name }, (err, results) => {
            if (err) {
                console.error('Error adding department:', err);
                return;
            }
            console.log(`Department "${answers.name}" added successfully.`);
            main(); // Continue with the main menu
        });
    });
}

function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the title of the role:'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary for the role:'
        },
        {
            type: 'input',
            name: 'department_id',
            message: 'Enter the department ID for the role:'
        }
    ]).then((answers) => {
        connection.query('INSERT INTO role SET ?', {
            title: answers.title,
            salary: answers.salary,
            department_id: answers.department_id
        }, (err, results) => {
            if (err) {
                console.error('Error adding role:', err);
                return;
            }
            console.log(`Role "${answers.title}" added successfully.`);
            main(); // Continue with the main menu
        });
    });
}

function addEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Enter the first name of the employee:'
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Enter the last name of the employee:'
        },
        {
            type: 'input',
            name: 'role_id',
            message: 'Enter the role ID for the employee:'
        },
        {
            type: 'input',
            name: 'manager_id',
            message: 'Enter the manager ID for the employee (or leave blank if none):'
        }
    ]).then((answers) => {
        connection.query('INSERT INTO employee SET ?', {
            first_name: answers.first_name,
            last_name: answers.last_name,
            role_id: answers.role_id,
            manager_id: answers.manager_id || null
        }, (err, results) => {
            if (err) {
                console.error('Error adding employee:', err);
                return;
            }
            console.log(`Employee "${answers.first_name} ${answers.last_name}" added successfully.`);
            main(); // Continue with the main menu
        });
    });
}

function updateEmployeeRole() {
    // Fetch employee names and role titles for user selection
    connection.query(`
        SELECT id, CONCAT(first_name, ' ', last_name) AS full_name
        FROM employee
    `, (err, employees) => {
        if (err) {
            console.error('Error fetching employees:', err);
            return;
        }

        connection.query(`
            SELECT id, title
            FROM role
        `, (err, roles) => {
            if (err) {
                console.error('Error fetching roles:', err);
                return;
            }

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee_id',
                    message: 'Select the employee to update:',
                    choices: employees.map(employee => ({
                        name: employee.full_name,
                        value: employee.id
                    }))
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'Select the new role for the employee:',
                    choices: roles.map(role => ({
                        name: role.title,
                        value: role.id
                    }))
                }
            ]).then((answers) => {
                connection.query('UPDATE employee SET ? WHERE ?', [
                    { role_id: answers.role_id },
                    { id: answers.employee_id }
                ], (err, results) => {
                    if (err) {
                        console.error('Error updating employee role:', err);
                        return;
                    }
                    console.log('Employee role updated successfully.');
                    main(); // Continue with the main menu
                });
            });
        });
    });
}

// Call the main function to start the application
main();
