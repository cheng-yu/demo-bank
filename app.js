const express = require('express');
const bodyParser = require('body-parser');
const accountRoutes = require('./src/routes/accountRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/accounts', accountRoutes);

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = { app, server };