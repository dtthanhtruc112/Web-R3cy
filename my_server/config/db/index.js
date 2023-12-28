const mongoose = require("mongoose")
require('dotenv/config')
// async function connect(){
//     try{
//         await mongoose.connect(process.env.DB_URL);
//         // process.env.tên biến ở .env
//         console.log("Connected succesfully")
//     }catch(error){
//         console.log("Error: ", error.message);
//     }
// }

async function connect(){
    try{
        await mongoose.connect(process.env.CONNECTION_STRING);
        // process.env.tên biến ở .env
        console.log("Connected succesfully")
    }catch(error){
        console.log("Error: ", error.message);
    }
}
module.exports = {connect};



