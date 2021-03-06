const bcrypt = require('bcryptjs');
const UserModel = require('./user');
const tokenProvider = require('../../common/tokenProvider');
const HttpError = require('../../common/httpError');

const signUp = async (req, res, next) => {
    const { username, password } = req.body;

    const existedUser = await UserModel.findOne({ username });
    
    if (existedUser) {
        throw new HttpError('Signup failed, username already existed', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await UserModel.create({ username, password: hashPassword });

    const token = tokenProvider.sign(newUser._id);

    res.send({
        success: 1,
        data: {
            _id: newUser._id,
            username: newUser.username,
            token,
        },
    });
};

const login = async (req, res) => {
    const { username, password } = req.body;

    const existedUser = await UserModel.findOne({ username });

    if (!existedUser) {
        throw new HttpError('Signin failed, username dont exist', 400);
    }

    const hashPassword = existedUser.password;

    const matchedPassword = await bcrypt.compare(password, hashPassword);

    if (!matchedPassword) {
        throw new HttpError('Signin failed, password not correct', 400);
    }

    const token = tokenProvider.sign(existedUser._id);

    res.send({
        success: 1,
        data: {
            _id: existedUser._id,
            username: existedUser.username,
            token,
        },
    });
};

const getUserInfo = async (req, res) => {
    const { user } = req;
    const userInfo = user ? {
        username: user.username,
        _id: user.id,
    } : null;

    res.send({ success: 1, data: userInfo });
}

const verify = (req, res) => {
    const { user } = req;

    res.send({
        success: 1, 
        data: user,
    })
}

module.exports = {
    signUp,
    login,
    getUserInfo,
    verify,
};