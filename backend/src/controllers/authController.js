const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

exports.signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET || "devsecret",
        );

        res.status(201).json({
            message: "User created successfully",
            token,
            userId: newUser._id
        });
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0].toUpperCase();
            return res.status(400).json({
                message: `${field} ALREADY EXISTS`,
                field,
                success: false
            });
        }

        res.status(500).json({ message: "Error creating user", success: false,error });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: "Invalid Email or Password", success: false });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Email or Password", success: false });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || "devsecret",
        );

        res.status(200).json({ token, userId: user._id });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", success: false, error });
    }
};
