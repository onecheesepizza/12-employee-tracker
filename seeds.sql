USE employeesDB;

INSERT INTO department (id, name)
VALUES 
(1, "Management"), 
(2, "Engineering"), 
(3, "Sales"), 
(4, "Marketing");

INSERT INTO role (id, title, salary, department_id)
VALUES 
(1, "CEO", 100000, 1), 
(2, "Product Manager", 80000, 1), 
(3, "Senior Engineer", 80000, 2),
(4, "Junior Engineer", 80000, 2),
(5, "Sales Lead", 80000, 3),
(6, "Creative Director", 80000, 4),
(7, "Social Media Manager", 60000, 4);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES 
(1, "John", "Doe", 1, 1), 
(2, "Joe", "Rop", 2, 1), 
(3, "Blarf", "Ranlp", 3, 1), 
(4, "Jort", "Plawn", 4, 3), 
(5, "Wort", "Plorry", 5, 1), 
(6, "Wrop", "Furtin", 6, 1),
(7, "Tril", "Yurktun", 7, 6);


SELECT * FROM employee;
SELECT * FROM role;
SELECT * FROM department;