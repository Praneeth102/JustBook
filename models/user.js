
const mongoose = require("mongoose");
const crypto  = require('crypto');
const uuidv1 = require("uuid/v1");
const { timeStamp } = require("console");

let userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    lastname: {
        type: String,
        required: false,
        maxlength: 32,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    userinfo: {
        type: String,
        trim: true
    },
    encry_password: {
        type: String,
        required: true
    },
    salt: String,
    role: {
        type: Number,
        default: 0
    },
    purchases: {
        type: Array,
        default: []
    }
},{timeStamps: true});

userSchema.virtual("password")
.set(function(password){
    this._password = password;
    this.salt = uuidv1();
    this.encry_password = this.securePassword(password);
})
.get(function(){
    return this._password;
})



userSchema.method={

    autheticate: function(plainpassword){
        return this.securePassword(plainpassword) === this.encry_password;

    },

    securePassword: function(plainpassword){
        if(!password) return "";
        try{
            return crypto.createHmac('sha256', this.salt)
            .update(plainpassword)
            .digest('hex');
        }catch(err){
            return "";
        }
    }
}

module.exports = mongoose.model("User",userSchema)