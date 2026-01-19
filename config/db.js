import mongoose from "mongoose";

const dburl ="mongodb+srv://employee:1234@cluster0.zp3ipbn.mongodb.net/?appName=Cluster0"
mongoose.set("strictQuery",true,"useNewUrlParser",true);

const connection = async()=>{
    try{
        await mongoose.connect(dburl);
        console.log("MongoDB connected");
    }catch(e){
        console.error("mongoDB connection failed",e.message);
        process.exit();
    }
};
export default connection;