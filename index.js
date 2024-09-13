//NOTE: Steps have been altered at the direct instruction of teaching staff as simply entering postgres without them results in "FATAL ERROR" when attempting to connect to employee_db. Alter as needed.

//STEPS - 1: Open Terminal in database folder, type: "psql -U userNameHere employee_db", 
//        2: Type \i schema.sql (already have the \c employee_db command embedded within the schema, do not need a manual "connection" command or separate seed file to use database)
//        3: Open Second Terminal in root folder of JS file, run "Node index.js" (ensure dependancies "inquirer@8.2.4" and postgres' "pg" have been met via the "npm i _____" command prior to executing EmployeeTracker)

//Require Specific Version of "Inquirer@8.2.4", otherwise will not function correctly.
const inquirer = require('inquirer');
//Require PostGres (do NOT enter username to run, Readme's show username as "postgres" which is not accurate, use "psql postgres" with no -U or username entered)
//See Activity #23 and #24 of 12-SQL unit for use on "Pool" of the Connection Pool, documentation HERE:https://node-postgres.com/features/pooling
const { Pool } = require('pg');

//Constants for Main Menu, use ASYNC and AWAIT within inquirer to execute. 
//Write Each Prompt AS FUNCTION, return as inquirer prompt, then call from RunAPP below.
const mainMenu = () => // OPENING PROMPT
  {
    return inquirer.prompt([ //return the selected menu choice
      {
        type: 'list',
        name: 'selectedOption',
        message: 'Welcome to Employee Tracker, please select option from below...',
        choices: ['View all departments','View all roles','View all employees','Add a department','Add a role','Add an employee','Update an employee role', 'Exit',],
      },
    ]);
  };

// OPTION 1: View All Departments
const viewAllDepartments = async () => 
{
  const { rows } = await pool.query('SELECT * FROM department'); //takes the column of "DEPARTMENTS" from PostGres using the "pool" defined above during PG import and returns on next line
  return rows;
};
// OPTION 2: View All Roles
const viewAllRoles = async () => 
{
  const { rows } = await pool.query('SELECT * FROM role'); //takes the column of "DEPARTMENTS" from PostGres using the "pool" defined above during PG import and returns on next line
  return rows;
};
// OPTION 3: View All Employees
const viewAllEmployees = async () => 
{
  const { rows } = await pool.query('SELECT * FROM employee'); //takes the column of "DEPARTMENTS" from PostGres using the "pool" defined above during PG import and returns on next line
  return rows;
};
// OPTION 4: Add a Department
const addADepartment = () => 
{
  return inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What would you like the name of your new department to be?',
    },
  ]);
};
// OPTION 5: Add a Role  
const addARole = (departments) => 
{
  return inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'What would you like the name of your new role to be?',
    },
    {
      type: 'input',
      name: 'salary',
      message: 'What would you like the salary of your new role to be?',
    },
    {
      type: 'list',
      name: 'department',
      message: 'What would you like the department of your new role to be?',
      choices: departments.map(department => ({ name: department.name, value: department.id })),
    },
  ]);
};
// OPTION 6: Add an Employee  
const addAnEmployee = (roles, employees) => 
{
  return inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: 'What is the first name of your new employee?',
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'What is the last name of your new employee?',
    },
    {
      type: 'list',
      name: 'role',
      message: 'What is the role of your new employee?',
      choices: roles.map(role => ({ name: role.title, value: role.id })),
    },
    {
      type: 'list',
      name: 'manager',
      message: 'Who is the manager of your new employee?',
      choices: [{ name: 'None', value: null }, ...employees.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }))],
    },
  ]);
};  
// OPTION 7: Update an Employee Role
const updateEmployeesRole = (employees, roles) => 
{
  return inquirer.prompt([
    {
      type: 'list',
      name: 'employee',
      message: 'Which employee would you like to update?',
      choices: employees.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id })),
    },
    {
      type: 'list',
      name: 'role',
      message: 'What is the role of your updated employee?',
      choices: roles.map(role => ({ name: role.title, value: role.id })),
    },
  ]);
};
  
//connect to postgres database  
const pool = new Pool({
    user: 'davehyler', //PostgreSQL username
    host: 'localhost',
    database: 'employee_db', //PostgreSQL DB
    password: '', //password (leave blank if did not setup a PW during installation)
    port: 5432, //PostGres running on port "5432", change value if setting up PG Port to a different number. Leave AS-IS otherwise.
});
// Add a new department
const addDepartment = async (departmentName) => 
{
  const query = 'INSERT INTO department (name) VALUES ($1)';
    await pool.query(query, [departmentName]);
    console.log(departmentName,' has been added.');
  };
// Add a new role
const addRole = async (title, salary, departmentId) => 
{
  const query = 'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)';
  try 
  {
    await pool.query(query, [title, salary, departmentId]);
    console.log('Role has been added.');
  } 
  catch (error) { console.error('Error', error); throw error;}
};
// Add a new employee
const addEmployee = async (firstName, lastName, roleId, managerId) => 
{
  const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)';
    await pool.query(query, [firstName, lastName, roleId, managerId]);
    console.log('Your new hire has been added.');
  };
// Update an employee's role
const updateEmployeeRole = async (employeeId, roleId) => 
{
  const query = 'UPDATE employee SET role_id = $1 WHERE id = $2';
  try 
  {
    await pool.query(query, [roleId, employeeId]);
    console.log('The employee role has been updated');
  } catch (error) { console.error('Error', error); throw error; }
};

//see module 09 for SWITCH and CASE usage
//see module 12 for ASYNC and AWAIT usage (use prior to function, then wait for the initial menu choice above to return value to "switch" to the selectedOption)
const runApp = async () => {
  try {
    let exit = false;
    while (!exit) {
      const { selectedOption } = await mainMenu();
      switch (selectedOption) 
      {
        case 'View all departments': //see "following options" on readme for NAMING CONVENTION of menu ie "View All Departments"
          const departments = await viewAllDepartments();
          console.table(departments);
          break;
        case 'View all roles':
          const roles = await viewAllRoles();
          console.table(roles);
          break;
        case 'View all employees':
          const employees = await viewAllEmployees();
          console.table(employees);
          break;
        case 'Add a department':
          const { name: departmentName } = await addADepartment();
          await addDepartment(departmentName);
          break;
        case 'Add a role':
          const departmentsForRole = await viewAllDepartments();
          const { title, salary, department: departmentId } = await addARole(departmentsForRole);
          await addRole(title, salary, departmentId);
          break;
        case 'Add an employee':
          const rolesForEmployee = await viewAllRoles();
          const employeesForEmployee = await viewAllEmployees();
          const { firstName, lastName, role: roleId, manager: managerId } = await addAnEmployee(rolesForEmployee, employeesForEmployee);
          await addEmployee(firstName, lastName, roleId, managerId);
          break;

        case 'Update an employee role':
          const employeesToUpdateRole = await viewAllEmployees();
          const rolesToUpdateRole = await viewAllRoles();
          const { employee: employeeIdToUpdateRole, role: newRoleIdToUpdateRole } = await updateEmployeesRole(employeesToUpdateRole, rolesToUpdateRole);
          await updateEmployeeRole(employeeIdToUpdateRole, newRoleIdToUpdateRole);
          break;
        //Don't think I saw a requirement for an "EXIT" function on this assignment, but adding it anyways to make it easier to test and debug.
        case 'Exit':
          // exit = true;
          process.exit(0);
          break;
      }
    }
  } catch (error) {console.error(error);}
};

runApp();