require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { User, Token } = require('../models')


module.exports = {
    userHealth: (req, res) => {
        return res.status(200).send('User API is working!');
    },

    userRegister: async (req, res, next) => {
        const { username, password } = req.body

        const hashedPWD = await bcrypt.hash(password, 10)

        try {
            const userResult = await User.findOne({
                where: {
                    username: username
                },
            })

            if (userResult) {
                return res.status(409).send('Username is already taken');
            }

            await User.create({
                username: username,
                password: hashedPWD
            });

            return res.status(200).send({ message: 'User Created Successfully' });
        } catch (error) {
            return res.status(500).send({ message: 'Internal Server Error', error: error });
        }
    },

    userLogin: async (req, res) => {
        const { username, password } = req.body

        try {
            const userResult = await User.findOne({
                where: {
                    username: username
                },
            })

            if (!userResult) {
                return res.status(401).send('Invalid Username or Password');
            }

            const isPasswordMatch = await bcrypt.compare(password, userResult.password)

            if (!isPasswordMatch) {
                return res.status(401).send('Invalid Username or Password');
            }

            const token = jwt.sign({ id: userResult.id, username: userResult.username }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
            const refreshToken = jwt.sign({ id: userResult.id, username: userResult.username }, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: '7d' });


            const tokenResult = await Token.findOne({
                where: {
                    userId: userResult.id
                }
            })

            if (!tokenResult) {
                tokenResult = await Token.create({
                    userId: userResult.id,
                    refreshToken: refreshToken,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 วัน
                });
            } else {
                tokenResult.refreshToken = refreshToken;
                tokenResult.expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 วัน
                await tokenResult.save()
            }

            return res.status(200).send({ message: 'Login Success', token: token, refreshToken: refreshToken });
        } catch (error) {
            return res.status(500).send({ message: 'Internal Server Error', error: error });
        }
    },

    userRefreshToken: async (req, res) => {
        const { refreshToken } = req.body

        if (!refreshToken) {
            return res.status(401).send('Refresh Token is required');
        }

        try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY)

            const findRefreshToken = await Token.findOne({
                where: {
                    refreshToken: refreshToken
                }
            })

            if (!findRefreshToken) {
                return res.status(403).send('Refresh Token is not valid');
            }

            const newToken = jwt.sign({ id: decoded.id, username: decoded.username }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

            return res.status(200).send({ token: newToken });
        } catch (error) {
            return res.status(500).send({ message: 'Internal Server Error', error: error });
        }
    },

    userLogout: async (req, res) => {
        const { refreshToken } = req.body

        if (!refreshToken) {
            return res.status(401).send('Token is required');
        }

        try {
            await Token.update({
                refreshToken: null,
                expiresAt: null
            },
                {
                    where: {
                        refreshToken: refreshToken
                    }
                }
            );

            return res.status(200).send({ message: 'Logout Success' });
        } catch (error) {
            return res.status(500).send({ message: 'Internal Server Error', error: error });

        }
    }
}

