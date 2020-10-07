const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    fullName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    userID: {type: String},
    associated_group: {type: Array},
    notifications: {type: Array}
})

module.exports = mongoose.model("Member",userSchema)
