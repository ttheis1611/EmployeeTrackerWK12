USE business_db;

-- Department insert
INSERT INTO department (dept_name)
VALUES ('Management'),
       ('Sales'),
       ('Finance'),
       ('Engineering'),
       ('Legal'),
       ('Operations');

-- Department insert
INSERT INTO roles (title, salary, department_id)
VALUES ('Manager', 85000, 1),
       ('Salesperson', 45000, 2),
       ('Lead Sales', 55000, 2),
       ('Accountant', 51050, 3),
       ('Lead Accountant', 95000, 3),
       ('Software Engineer', 65000, 4),
       ('Lead Engineer', 75000, 4),
       ('Paralegal', 50000, 5),
       ('Ethics Lawyer', 150000, 5),
       ('Technician', 35000, 6),
       ('Lead Technician', 45000, 6);

-- Employee insert

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Tommy', 'Heathcliff', 1, NULL),
       ('James', 'Brown', 2, 1),
       ('Joely', 'Habernathy', 3, 1),
       ('Anna', 'Abecromby', 4, 1),
       ('Rainy', 'Daize', 5, 1),
       ('Maggie', 'Apple', 6, 1),
       ('Cara', 'Sanning', 7, 1),
       ('Theodore', 'Mattlock', 8, 1),
       ('Samuel', 'Boltemup', 9, 1),
       ('Benny', 'Swartz', 10, 1),
       ('Dash', 'Riprock', 11, 1),
       ('Benjamin', 'Button', 6, 1),
       ('Tori', 'Helpener', 10, 1);