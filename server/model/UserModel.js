import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is Required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is Required"],
    },
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: false,
    },
    profileSetup: {
        type: Boolean,
        default: false,
    },
    color: {
        type: Number,
        required: false,
    },
    aboutMe: {
        type: String,
        required: false,
    },
    amount: {
        type: Number,
        required: false,
        default: 0, // optional default value for amount
    },

    facebook: {
        type: String,
        required: false,
    },
    instagram: {
        type: String,
        default: false,
    },
    github: {
        type: String,
        required: false,
    },
    twitter: {
        type: String,
        required: false,
    },

    bankaccountholder: {
        type: String,
        required: false,
    },
    accountno: {
        type: Number,
        required: false,
        default: 0, // optional default value for amount
    },
    ifscno: {
        type: String,
        required: false,
    },
    bankname: {
        type: String,
        required: false,
    },
    upiid: {
        type: String,
        required: false,
    },

    project1: {
        type: String,
        required: false,
    },
    project2: {
        type: String,
        required: false,
    },
    home: {
        type: String,
        required: false,
    },
    about: {
        type: String,
        required: false,
    },

    services: {
        type: String,
        required: false,
    },
    features: {
        type: String,
        required: false,
    },
});

// Hash password before saving user
userSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Static method to login user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error("Incorrect password");
    }
    throw Error("Incorrect email");
};

const User = mongoose.model("Users", userSchema);
export default User;