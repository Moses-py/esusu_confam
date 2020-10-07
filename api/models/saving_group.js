const mongoose= require("mongoose")

const groupSchema = mongoose.Schema({
    groupID: {type: String},
    group_name: {type: String, required: true},
    group_description: {type:String, required: true},
    max_members: {type:Number, required: true},
    group_privacy: {type: String, required: true},
    group_admin: {type: Object},
    savings_amount: {type: Number, required: true},
    group_members: {type: Array},
    invite_message: {type: String, required: true}
})

module.exports = mongoose.model("Savings_group", groupSchema)