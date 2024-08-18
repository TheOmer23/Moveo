import mongoose from "mongoose";
import bcrypt from "bcrypt"

const saltRounds = 10;

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    instrument: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// create a new user and save it to the database
export const createUser = async (user, isAdmin)=>{
    const encryptPassword = await bcrypt.hash(user.password, saltRounds);
    user.password = encryptPassword 
    user.isAdmin = isAdmin;
    const newUser = new User(user)
    const savedUser = await newUser.save();
    console.log(savedUser);
}

// connect to MongoDB database
export const connectDB = async (dbName) => {
    try{
        const mongoDB = process.env.MONGO_DB.replace(`<dbname>`, dbName);
        if(!mongoDB){
            throw new Error("MONGO_DB is not define")
        }
        await mongoose.connect(mongoDB);
        console.log("mongoDB connected");
    }
    catch (error){
        console.error(error.message);
        process.exit(1);
    }
}

export const findUserByUserName = async (userName) => {
    const user = await User.findOne({ userName: userName });
    return user
}