PRAGMA foreign_keys = ON;
UPDATE payment_methods
SET name = 'Cash'
WHERE id = '32332081-7a2b-4e67-a198-fddf2451f426';

UPDATE payment_methods
SET name = 'Credit Card'
WHERE id = '6440df5d-c76c-4074-9256-dd2dccf8a50b';

UPDATE payment_methods
SET name = 'Debit Card'
WHERE id = '0b571243-2143-4afc-a728-f6e5c4e8a9e1';

UPDATE payment_methods
SET name = 'BTC'
WHERE id = '3ae8f71e-954a-4795-8531-368354c67ede';
