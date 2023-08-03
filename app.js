const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'learn',
});

// Test the database connection
pool.query('SELECT 1;', (error, results) => {
    if (error) {
      console.error('Error testing database connection:', error);
    } else {
      console.log('Database connection is successful!');
    }
  });

// API endpoint to get all expenses
app.get('/api/expenses', (req, res) => {
    pool.query('SELECT * FROM expenses;', (error, results) => {
      if (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results);
      }
    });
  });

  
  // API endpoint to add an expense
app.post('/api/expenses', (req, res) => {
  const { title, date, amount } = req.body;

   // Check if req.body exists and contains the expected properties
   if (!title || !date || !amount) {
    return res.status(400).json({ error: 'Invalid data. Title, date, and amount are required.' });
  }

  // Assuming your expenses table has columns 'title', 'date', and 'amount'
  const q = `INSERT INTO expenses ( title, date, amount) VALUES (?, ?, ?)`;
  pool.query(q, [title, date, amount], (error, results) => {
    if (error) {
      console.error('Error adding expense:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: 'Expense added successfully!' });
    }
  });
});



app.delete('/api/expenses/:id', (req, res) => {
  const expenseId = req.params.id;

  // Assuming your expenses table has a primary key 'id'
  const query = 'DELETE FROM expenses WHERE id = ?';

  pool.query(query, [expenseId], (error, results) => {
    if (error) {
      console.error('Error deleting expense:', error);
      res.status(500).json({ error: 'Failed to delete expense from the database' });
    } else {
      console.log('Expense deleted successfully:', expenseId);
      res.json({ message: 'Expense deleted successfully!' });
    }
  });
});



// API endpoint to update the title of an expense by ID
app.put('/api/expenses/:id', (req, res) => {
  const expenseId = req.params.id;
  const { title } = req.body;

  // Assuming your expenses table has columns 'id' and 'title'
  const query = 'UPDATE expenses SET title = ? WHERE id = ?';

  pool.query(query, [title, expenseId], (error, results) => {
    if (error) {
      console.error('Error updating title:', error);
      res.status(500).json({ error: 'Failed to update title in the database' });
    } else {
      console.log('Title updated successfully:', expenseId);
      res.json({ message: 'Title updated successfully!' });
    }
  });
});

  // Default route for the root endpoint
app.get('/', (req, res) => {
    res.send('API server is running!');
  });
  

  // Start the server
app.listen(port, () => {
    console.log(`API server is running on port ${port}`);
  });