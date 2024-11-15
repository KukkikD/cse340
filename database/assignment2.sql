--Insert the new record to the account table.
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

--Modify the Tony Stark Record to Change the Account Type to "Admin"
UPDATE account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

--Delete the Tony Stark Record from the Database
DELETE FROM account
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

--Modify the 'GM Hummer' Record
UPDATE inventory 
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior') 
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

--Use an Inner Join to Select the make and model fields from the inventory table 
--and the classification name field from the classification table.
SELECT inv_make, inv_model, classification.classification_name
FROM inventory
INNER JOIN classification ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport';

--Update File Paths in the Inventory Table
UPDATE inventory 
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');