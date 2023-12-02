INSERT INTO department (name) VALUES
  ('Sales'),
  ('Marketing'),
  ('Development');

-- Insert roles
INSERT INTO role (title, salary, department_id) VALUES
  ('Sales Manager', 70000, 1),
  ('Sales Representative', 50000, 1),
  ('Marketing Manager', 80000, 2),
  ('Marketing Coordinator', 55000, 2),
  ('Software Engineer', 90000, 3),
  ('Database Administrator', 85000, 3);

-- Insert employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('John', 'Doe', 1, NULL),
  ('Jane', 'Smith', 2, 1),
  ('Bob', 'Johnson', 3, 1),
  ('Alice', 'Williams', 4, 2),
  ('Charlie', 'Brown', 5, 3),
  ('Eva', 'Davis', 6, 3);