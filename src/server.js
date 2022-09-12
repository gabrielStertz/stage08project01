const express = require('express');
const app = express();
app.get('/message', (req, res) => {
  res.send('Hello, world')
})
app.get('/user/:id', (req, res) => {
  const {id} = req.params
  res.send(`Id do usuário: ${id}`)
})
const PORT = 3333;
app.listen(PORT, () => console.log(`Server is running on Port: ${PORT}`));