const mongoose = require('mongoose');
const encrypt = require('../utilities/encription');
//const REQUIRED_VALIDATION_MESSAGE = '{PATH} IS REQUIRED';

const userSchema = new mongoose.Schema({
    email: {type: mongoose.SchemaTypes.String, required: [true,'Email is required'], unique: true},
    password: {type: mongoose.SchemaTypes.String, required: [true, 'Password is required']},
    salt: {type: mongoose.SchemaTypes.String},
    roles: [{type: mongoose.SchemaTypes.String}],
});

userSchema.method({
    authenticate:(pass) => {
        return encrypt.getHashedPass(this.getSalt, pass) === this.password;
    }
});

let User = mongoose.model('User', userSchema);
module.exports = User;
module.exports.seedAdminUser = () =>{
    User.find({}).then(users => {
        if(users.length > 0) return;
        let salt = encrypt.getSalt();
        let password = encrypt.getHashedPass(salt, 'softuni');
        User.create({
            email: 'admin@admin.bg',
            password,
            salt,
            roles: ['Admin']
        })
    });
};
