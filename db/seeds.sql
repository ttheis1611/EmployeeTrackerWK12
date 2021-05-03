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
VALUES ('Salesperson', 45000, 2),
       ('Lead Sales', 55000, 2),
       ('Accountant', 51050, 3),
       ('Lead Accountant', 95000, 3),
       ('Software Engineer', 65000, 4),
       ('Lead Engineer', 75000, 4),
       ('Paralegal', 50000, 5),
       ('Ethics Lawyer', 150000, 5),
       ('Technician', 35000, 6),
       ('Lead Technician', 45000, 6);
       ('Manager', 85000, 1);

-- Employee insert

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Tommy', 'Heathcliff' 'Salesperson', 1),
       ('James', 'Brown' 'Lead Sales', 1),
       ('Joely', 'Habernathy' 'Accountant', 2),
       ('Anna', 'Abecromby' 'Lead Accountant', 2),
       ('Rainy', 'Daize' 'Software Engineer', 2),
       ('Maggie', 'Apple' 'Lead Engineer', 2),
       ('Cara', 'Sanning' 'Paralegal', ''),
       ('Theodore', 'Mattlock' 'Ethics Lawyer', ''),
       ('Samuel', 'Boltemup' 'Technician', 5),
       ('Benny', 'Swartz' 'Lead Technician', 5),
       ('Dash', 'Riprock' 'Manager', 1),
       ('Benjamin', 'Button' 'Manager', 2),
       ('Tori', 'Helpener' 'Manager', 5);