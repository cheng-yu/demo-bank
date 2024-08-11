const express = require('express');
const bodyParser = require('body-parser');
const accountRoutes = require('./src/routes/accountRoutes');
const transferRequestRoutes = require('./src/routes/transferRequestRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/accounts', accountRoutes);
app.use('/transfer-requests', transferRequestRoutes);

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = { app, server };