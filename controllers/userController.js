const User = require('../models/user');

async function getUser(req, res) {
    try {
        const user = await User.findByPk(req.param.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function getUsers(req, res) {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error){
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { getUser, getUsers };