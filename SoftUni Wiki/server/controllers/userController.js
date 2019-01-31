const User = require('../models/User');
const encrypt = require('../utilities/encription');
module.exports = {
    getRegister: (req, res) => {
        res.render('./user/register.hbs');
    },
    postRegister: (req, res) => {
        let regUser = req.body;
        let err = false;
        if(regUser.password.length < 6){
             err = 'Password must be at least 6 characters';
        }
        else if (regUser.password !== regUser.checkPassword){
            err = 'Passwords did not match';
        }
        if(err) {
            regUser.globalError = err;
            return res.render('./user/register.hbs', regUser);
        }

        let salt = encrypt.getSalt();
        let hashedPass = encrypt.getHashedPass(salt, regUser.password);
        User.create({
            email: regUser.email,
            password: hashedPass,
            salt,
            roles:['User']
        }).then(user => {
            req.logIn(user, (err, user) => {
                if(err){
                    res.locals.globalError = err;
                    res.render('./user/register.hbs', user);
                }
            });
            return res.redirect('/');
        }).catch(err => {
            console.log(err);
            regUser.globalError = 'Email already exist';
            res.render('./user/register.hbs', regUser);
        });
    },
    logout: (req, res) => {
        req.logOut();
        return res.redirect('/');
    },
    getLogin: (req, res) => {
        res.render('./user/login.hbs');
    },
    postLogin: (req, res) => {
        let logUser = req.body;
        User.findOne({email: logUser.email}).then(user => {
            let currentHashPass = encrypt.getHashedPass(user.salt, logUser.password);
            if(currentHashPass === user.password){
                req.logIn(user, (err, user) => {
                    if(err) throw err;
                });
                return res.redirect('/');
            }else{
                logUser.globalError = 'Password Incorrect';
                res.render('./user/login', logUser)
            }
        }).catch(err => {
            logUser.globalError = 'Email not found';
            res.render('./user/login.hbs', logUser);
        });
    }
};