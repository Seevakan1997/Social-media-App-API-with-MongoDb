const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")


dotenv.config();
mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGO_URL,{useNewUrlParser: true,
    useUnifiedTopology: true,})
    .then(() => {
        console.log('Connected to MongoDB');
      })
      .catch((err) => {
        console.error(err);
      });

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);


app.get("/",(req,res)=>{
    res.send("welcome to Home page");
})

app.listen(19002,()=>{
    console.log("backend running");
})