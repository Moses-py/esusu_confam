const Savings_group = require("../models/saving_group")
const crypto = require("crypto")

exports.create_new_group = (req, res) => {
    const groupId = crypto.randomBytes(3).toString('hex');
    const {_id, fullName, email, userID } = req.userData._doc
    const userGroupDetails = {
        _id: _id,
        member_id: userID,
        member_name: fullName,
        member_email: email,
        role: "Group Admin",
        amount_saved: 0
        
    }
    Savings_group.findOne({group_name: req.body.group_name}).select("group_name").exec().then(found_group => {
        if(found_group) {
            res.status(409).json({
                statusCode: 409,
                status: "failed",
                message: "Group Name not available for use"
            })
        } else {
            const newGroup = new Savings_group ({
                group_name: req.body.group_name,
                group_description: req.body.group_description,
                max_members: req.body.max_members,
                group_privacy: req.body.group_privacy,
                groupID: groupId,
                group_admin: {
                    _id: _id,
                    adminID: userID,
                    admin_name: fullName,
                    admin_email: email,
                },
                invite_message: req.body.invite_message,
                savings_amount : req.body.savings_amount,
                group_members: [userGroupDetails] 
            })
            newGroup.save().then(result => {
                res.status(201).json({
                    message: "Group successfully created",
                    ...result._doc
                })
            }).catch(
                err => {
                    res.status(500).json({
                        statusCode: 500,
                        status: "failed",
                        message: "Error encountered",
                        error: err
                    })
                }
            )
        }
    }).catch(err => {
        res.status(500).json({
            error: err,
            message: "error encountered"
        })
    })
}
