const User = require("../models/user")
const bcrypt =require("bcrypt")
const crypto = require("crypto")
const mongoose = require("mongoose")

function errors(err) {
    return res.status(500).json({
        message: "Error encountered",
        error: err
    })
}
exports.get_registration_page = (req, res) => {
    User.find().exec().then(users=> {
        res.status(200).json(({
            count: users.length,
            details: users.map(user=> {
                return {
                    _id: user._id,
                    user_name: user.fullName,
                    user_email: user.email,
                    user_ID: user.userID,
                    associated_groups: user.associated_group,
                    notifications: user.notifications
                }
            })
        }))
    }).catch(err => {
        res.status(500).json({
            statusCode: 500,
            status:"failed",
            message: "Error encountered"
        })
    })
}

exports.create_new_user = (req, res) => {
    User.findOne({email: req.body.email}).exec().then(member => {
        if(member) {
            res.status(409).json({
                statusCode: 409,
                status: "failed",
                message: "User already exists"
            })
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    errors(err)
                } else {
                    if(hash) {
                        var id = crypto.randomBytes(3).toString('hex');

                        const memberDetails = {
                            _id: mongoose.Types.ObjectId(),
                            fullName: req.body.fullName,
                            email: req.body.email,
                            password: hash,
                            userID: id
                        }
        
                        const newMember = new User({
                            ...memberDetails
                        })
        
                        newMember.save().then(saveResult => {
                            res.status(201).json({
                                data: {
                                    statusCode: 201,
                                    status: "successful",
                                    message: "New Member created successfully",
                                }

                            })
                        }).catch(err=> {
                            res.json({
                                statusCode: 500,
                                status: "failed",
                                message: "Server error"
                            })
                        })
                    }
                }
            })
        }
    }).catch(err => {
        errors(err)
    })
}

exports.delete_user = (req,res) =>{
    User.deleteOne({_id: req.params.userId}).exec().then(
        res.status(200).json({message: "User successfully deleted"})
    ).catch(err=>{
        errors(err)
    })
}