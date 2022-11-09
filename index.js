const express = require('express');
const cors = require('cors');
const colors = require('colors');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express()
//middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('fashion photography is running')
})
app.listen(port, () => {
    console.log(`fashion photography running on the port number ${port}`);
})