import mongoose from "mongoose";

const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGOOSEDB)
        console.log("Connect DB")
    }catch(err){
        console.log(err)
    }
}

export default connectDB;