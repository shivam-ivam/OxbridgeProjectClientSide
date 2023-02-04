const mongoose = require("mongoose");


console.log(process.env.DB)
mongoose.connect(process.env.DB)
.then(() => {
console.log("connection with database done");
})
.catch((err)=>{
    console.log("conneciton with database is unsuccessful");
    console.log(err);
});

