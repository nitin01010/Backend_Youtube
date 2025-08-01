const User = require("../module/users.modules");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

async function handlegetAllUser(req, res) {
    try {
        const AllUser = await User.find({});
        res.status(200).json({ message: 'all user get', data: AllUser });
    } catch (error) {
        res.status(200).json({ message: 'somethink worng ...', error });
    }
}

async function handleRegister(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please enter all required fields." });
        }

        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim();

        const existingEmail = await User.findOne({ email: trimmedEmail });
        if (existingEmail) {
            return res.status(409).json({ message: "Email is already in use." });
        }

        const existingUsername = await User.findOne({ username: trimmedUsername });
        if (existingUsername) {
            return res.status(409).json({ message: "Username is already taken." });
        }

        const saltRounds = parseInt(process.env._PASSWORD_VALUE_KEY) || 10;
        const hashPass = await bcrypt.hash(password, saltRounds);

        const newUser = await User.create({
            username: trimmedUsername,
            email: trimmedEmail,
            password: hashPass,
        });

        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(201).json({
            message: "User created successfully.",
            token,
        });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong.", error: error.message });
    }
}

async function handleLogin(req, res) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Please enter username and password." });
        }

        const trimmedUsername = username.trim();

        const user = await User.findOne({ username: trimmedUsername });
        if (!user) {
            return res.status(401).json({ message: "Invalid username not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid  password." });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Login successful.",
            token,
        });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong.", error: error.message });
    }
}

async function handleDeleteByid(req, res) {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        await User.findByIdAndDelete(id);

        res.status(200).json({
            message: "User deleted successfully.",
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong.", error: error.message });
    }
}

module.exports = {
    handlegetAllUser,
    handleRegister,
    handleLogin,
    handleDeleteByid
}