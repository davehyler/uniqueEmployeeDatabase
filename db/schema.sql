DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
\c "host=localhost port=5432 dbname=employee_db connect_timeout=10 user=YOURUSERNAMEHERE" --//automatically connect to the database so this line does not need to be entered manually after running the schema
-- Drop tables prior to creating/recreating them when this schema and seeds are run (Can separate into SEEDS.SQL file for IF/WHEN we require a separate business or isolated values... though in reality that's no more work/efficiency/compute-power than editing the values here in a Portable Installation)
DROP TABLE IF EXISTS employee CASCADE;
DROP TABLE IF EXISTS role CASCADE;
DROP TABLE IF EXISTS department CASCADE;
-- Create Tables:
CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id)
);
CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);
-- Within the new department table, we will seed the following values of:
INSERT INTO department (name) VALUES
('Executive'),
('Research and Development'),
('Marketing'),
('Human Resources'),
('Accounting');
-- Within the new roles table, we will seed the following values of:
INSERT INTO role (title, salary, department_id) VALUES
('Manager', 100000, 1),
('Engineer', 90000, 2),
('Associate', 80000, 3),
('Trainee', 20000, 4),
('Accountant', 70000, 5);
-- Within the new employees table, we will seed the following values of:
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('John', 'Smith', 1, NULL),
('Bob', 'Benny', 1, NULL),
('Alice', 'Lafferty', 3, 1),
('Robert', 'Thornton', 4, 2),
('Bird', 'Parker', 5, 1),
('Adam', 'An', 3, 2),
('Tony', 'Stark', 2, 1),
('Richard', 'Hendrix', 3, 2),
('Homer', 'Simpson', 4, 1),
('Gavin', 'Belson', 5, 2),
('Boyd', 'Crowder', 3, 1),
('Cullen', 'Bohannon', 2, 2);
