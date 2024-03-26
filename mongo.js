const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/Quote_App');
        console.log("Database connected");
    } catch (err) {
        console.error("Error connecting to database:", err.message);
    }
};

connectDB();

const Schema = mongoose.Schema;

// Define user schema
const userSchema = new Schema({
    eid1: { type: String, required: true },
    pass1: { type: String, required: true }
});

// Define color info schema
const colorInfoSchema = new Schema({
    post: String,
    color: String,
    date: String
});

// Plugin passport-local-mongoose for user schema
userSchema.plugin(passportLocalMongoose);

// Create models
const UserModel = mongoose.model("Userdetails", userSchema);
const ColorInfoModel = mongoose.model("Colorinfo", colorInfoSchema);

module.exports = {
    model1: UserModel,
    model2: ColorInfoModel
};
