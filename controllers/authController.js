const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { secret, expireIn } = require('../config/jwt');

async function login(req,res) {
    const { username,password } = req.body;
    try{
        const user = await User.findOne({ where: {username } });
        if(!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({message:'Invalid username or password'});
        }
        const token = jwt.sign({id: user.id, username: user.username}, secret, { expiresIn });
        res.cookie('token', token, {httpOnly: true });
        res.json({message: 'Login successful'});
    } catch (error) {
        console.error(reeor);
        res.status(500).json({message: 'Internal server error'})
    }
}

function logout(req,res) {
    res.clearcookie('token');
    res.json({ message: 'Logout Successful' });
}

module.exports = {login, logout};