import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();    

const connectDB = async ()=>{
await  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })   
    .then(() => {
      console.log("DB connected --------");
    })
    .catch((e) => {
      console.log(e.message);
    });
}

export default connectDB; 
