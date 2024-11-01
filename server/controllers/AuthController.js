import jwt from "jsonwebtoken";
import User from "../model/UserModel.js";
import { compare } from "bcrypt";
import { renameSync, unlinkSync } from "fs";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, {
        expiresIn: maxAge,
    });
};

export const signup = async(req, res, next) => {
    try {
        const { email, password } = req.body;
        if (email && password) {
            const user = await User.create({ email, password });
            res.cookie("jwt", createToken(email, user.id), {
                maxAge,
                secure: true,
                sameSite: "None",
            });

            return res.status(201).json({
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    image: user.image,
                    profileSetup: user.profileSetup,
                    amount: user.amount,
                    facebook: user.facebook, // Ensure you retrieve social media fields
                    instagram: user.instagram,
                    github: user.github,
                    twitter: user.twitter,


                    bankaccountholder: user.bankaccountholder,
                    accountno: user.accountno,
                    ifscno: user.ifscno,
                    bankname: user.bankname,
                    upiid: user.upiid,

                    project1: user.project1,
                    project2: user.project2,

                },
            });
        } else {
            return res.status(400).send("Email and Password Required");
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};

export const login = async(req, res, next) => {
    try {
        const { email, password } = req.body;
        if (email && password) {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).send("User not found");
            }
            const auth = await compare(password, user.password);
            if (!auth) {
                return res.status(400).send("Invalid Password");
            }
            res.cookie("jwt", createToken(email, user.id), {
                maxAge,
                secure: true,
                sameSite: "None",
            });
            return res.status(200).json({
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    image: user.image,
                    profileSetup: user.profileSetup,
                    aboutMe: user.aboutMe,
                    amount: user.amount, // Make sure this field is retrieved
                    facebook: user.facebook, // Ensure you retrieve social media fields
                    instagram: user.instagram,
                    github: user.github,
                    twitter: user.twitter,

                    bankaccountholder: user.bankaccountholder, // Make sure this field is retrieved
                    accountno: user.accountno, // Ensure you retrieve social media fields
                    ifscno: user.ifscno,
                    bankname: user.bankname,
                    upiid: user.upiid,

                    project1: user.project1,
                    project2: user.project2,
                },
            });
        } else {
            return res.status(400).send("Email and Password Required");
        }
    } catch (err) {
        return res.status(500).send("Internal Server Error");
    }
};

export const getUserInfo = async(request, response, next) => {
    try {
        if (request.userId) {
            const userData = await User.findById(request.userId);
            if (userData) {
                return response.status(200).json({
                    id: userData.id,
                    email: userData.email,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    image: userData.image,
                    profileSetup: userData.profileSetup,
                    color: userData.color,
                    aboutMe: userData.aboutMe,
                    amount: userData.amount, // Make sure this field is retrieved
                    facebook: userData.facebook, // Ensure you retrieve social media fields
                    instagram: userData.instagram,
                    github: userData.github,
                    twitter: userData.twitter,

                    bankaccountholder: userData.bankaccountholder, // Make sure this field is retrieved
                    accountno: userData.accountno, // Ensure you retrieve social media fields
                    ifscno: userData.ifscno,
                    bankname: userData.bankname,
                    upiid: userData.upiid,

                    project1: userData.project1,
                    project2: userData.project2,
                });
            } else {
                return response.status(404).send("User with the given id not found.");
            }
        } else {
            return response.status(404).send("User id not found.");
        }
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
};


export const logout = async(request, response, next) => {
    try {
        response.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });
        return response.status(200).send("Logout successful");
    } catch (err) {
        return response.status(500).send("Internal Server Error");
    }
};

export const updateProfile = async(request, response, next) => {
    try {
        const { userId } = request;
        const {
            firstName,
            lastName,
            color,
            aboutMe,
            amount,
            facebook,
            instagram,
            github,
            twitter,

            bankaccountholder,
            accountno,
            ifscno,
            bankname,
            upiid,
            project1,
            project2,

        } = request.body;

        if (!userId) {
            return response.status(400).send("User ID is required.");
        }

        if (!firstName) {
            return response.status(400).send("First Name is required.");
        }

        // Update user data, allowing lastName to be optional
        const userData = await User.findByIdAndUpdate(
            userId, {
                firstName,
                lastName: lastName || "", // Set lastName as an empty string if not provided
                color,
                aboutMe: aboutMe || "",
                amount: amount || 0, // Set aboutMe as empty string if not provided
                facebook: facebook || "", // Set facebook as empty string if not provided
                instagram: instagram || "", // Set instagram as empty string if not provided
                github: github || "", // Set github as empty string if not provided
                twitter: twitter || "",

                bankaccountholder: bankaccountholder || "", // Set aboutMe as empty string if not provided
                accountno: accountno || "", // Set facebook as empty string if not provided
                ifscno: ifscno || "", // Set instagram as empty string if not provided
                bankname: bankname || "", // Set github as empty string if not provided
                upiid: upiid || "",
                project1: project1 || "",
                project2: project2 || "",
                // Set twitter as empty string if not provided
                profileSetup: true,
            }, {
                new: true,
                runValidators: true,
            }
        );

        return response.status(200).json({
            id: userData.id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            profileSetup: userData.profileSetup,
            color: userData.color,
            aboutMe: userData.aboutMe,
            amount: userData.amount,
            facebook: userData.facebook,
            instagram: userData.instagram,
            github: userData.github,
            twitter: userData.twitter,

            bankaccountholder: userData.bankaccountholder,
            accountno: userData.accountno,
            ifscno: userData.ifscno,
            bankname: userData.bankname,
            upiid: userData.upiid,

            project1: userData.project1,
            project2: userData.project2,

        });
    } catch (error) {
        console.error(error); // Log error for debugging
        return response.status(500).send("Internal Server Error.");
    }
};



export const addProfileImage = async(request, response, next) => {
    try {
        if (request.file) {
            const date = Date.now();
            let fileName = "uploads/profiles/" + date + request.file.originalname;
            renameSync(request.file.path, fileName);
            const updatedUser = await User.findByIdAndUpdate(
                request.userId, { image: fileName }, {
                    new: true,
                    runValidators: true,
                }
            );
            return response.status(200).json({ image: updatedUser.image });
        } else {
            return response.status(404).send("File is required.");
        }
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error.");
    }
};

export const removeProfileImage = async(request, response, next) => {
    try {
        const { userId } = request;

        if (!userId) {
            return response.status(400).send("User ID is required.");
        }

        const user = await User.findById(userId);

        if (!user) {
            return response.status(404).send("User not found.");
        }

        if (user.image) {
            unlinkSync(user.image);
        }

        user.image = null;
        await user.save();

        return response
            .status(200)
            .json({ message: "Profile image removed successfully." });
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error.");
    }
};