const {Schema , model}= require('mongoose');
const bycrypt = require('bcrypt');

const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    roles: [{ type: String }]  // Campo de roles como un array de Strings

},{
    timestams: true
});

UserSchema.methods.encryptPasswords = async password => {
    const salt = await bycrypt.genSalt(10);
    return await bycrypt.hash(password, salt);
}; 

UserSchema.methods.matchPassword = async function(password) {
    return await bycrypt.compare(password, this.password);
};

module.exports = model ('User', UserSchema);
