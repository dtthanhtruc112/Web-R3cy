const express = require('express')
const app = express()
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
const port = 3000
const cors=require('cors')
app.use(cors())
const mongoose = require('mongoose')
app.use('/image', express.static('uploads'));
require('dotenv').config();




//Http Request Logger
// const morgan = require('morgan')
// app.use(morgan("combined"))

// Parsing data received from the client
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Connecting with mongodb
const db = require("./config/db");
db.connect();



//+++++++++Router++++++++++
const exampleRouter = require('./routes/example.router')
app.use('/', exampleRouter)

const blogRouter = require('./routes/blog.router')
app.use('/', blogRouter)

const accountRouter = require('./routes/account.router')
app.use('/', accountRouter )

const cartRouter = require('./routes/cart.router')
app.use('/', cartRouter )

// app.use('/send-email', routes);

app.listen(port, () => {
    console.log (`My server's listening on port: ${port}`)
})
