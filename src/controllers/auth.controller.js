const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @route POST /api/auth/register
 * @description Register a new user expecting username, email and password in the request body
 * @access
 */


async function registerUserController(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please provide username, email and password' });
    }


    const isUserAlreadyExists = await userModel.findOne({
        $or : [{ username }, { email }] })
    if (isUserAlreadyExists) {
        return res.status(400).json({ message: 'User already exists' });
    
    }
    const hash = await bcrypt.hash(password, 10);
    const User = new userModel.create({ username, email, password: hash });

    const token = jwt.sign({ id: user._id , username : user.username  }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // 1 day
    res.status(201).json({ message: 'User registered successfully', token });
    
}



 module.exports = { registerUserController };