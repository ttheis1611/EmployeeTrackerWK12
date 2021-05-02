-- books table is column 1 book_name, column 2 price
SELECT
  books.book_name AS book_name, prices.price AS price
-- from books table
FROM books
-- 
JOIN  prices ON books.price = prices.id
ORDER BY price;
