const express = require("express")
const app=express()
const port = 3000

const morgan=require("morgan")
// app.use(morgan("combined"))

app.get("/", (req,res) => {
    res.send("hello")
})


app.listen(port, ()=> {
    console.log(`My server listening on port ${port}`)
})

const bodyParser=require("body-parser")
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));
const cors=require("cors");
app.use(cors())

const { MongoClient, ObjectId } = require('mongodb');
client = new MongoClient("mongodb://127.0.0.1:27017");
client.connect();
database = client.db("WebR3cy");
orderCollection = database.collection("order");
productCollection = database.collection("product")
userCollection = database.collection("user")

// API  truy vấn toàn bộ product và trả về JsonArray
app.get("/products",cors(),async (req,res)=>{
    const result = await productCollection.find({}).toArray();
    res.send(result)
})
// API  truy vấn toàn bộ order và trả về JsonArray
app.get("/orders",cors(),async (req,res)=>{
    const result = await orderCollection.find({}).toArray();
    res.send(result)
})
// API  truy vấn toàn bộ user và trả về JsonArray
app.get("/users",cors(),async (req,res)=>{
    const result = await userCollection.find({}).toArray();
    res.send(result)
})
