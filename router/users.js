const express = require('express');
const userRouter = express.Router();
const pool = require('../database.js');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "f4973e1e-a81b-415e-b9c0-70d95d5b7481"

userRouter.post('/register', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
  
   
    const query = 'SELECT email, password FROM users WHERE email = $1';
  
    pool.query(query, [email], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Gagal mengambil data dari database' });
      }
  
      if (result.rows.length === 0) {
        return res.status(401).json({
          description: 'Email tidak ditemukan',
        }).end();
      }
  
      const user = result.rows[0];
      if (password === user.password) {

        const token = jwt.sign({
          email: email,
        }, JWT_SECRET);
  
        return res.status(200).json({
          token: token
        });
      } else {
     
        res.status(401).json({
          description: 'Kata sandi tidak sesuai'
        }).end();
      }
    });
  });
  
module.exports = userRouter;
