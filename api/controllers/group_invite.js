const Savings_group = require("../models/saving_group")
const User= require("../models/user")

exports.invite_user = (req, res) => {
    const invited_user = req.params.public_user_id;
    
    Savings_group.findOne({groupID: req.params.admin_group_id}).exec().then(group => {
        if(group) {
            const invite_details = {
                notification_type: "Invite",
                notification_content: group.group_invite_message
            }
    
            User.findOne({userID: invited_user}).select("associated_group").then(found_result => {
                const {associated_group} = found_result

                const checkIfGroupExistsForUser = []
                associated_group.map(item => {
                    checkIfGroupExistsForUser.push(item.groupID);
                })


                if(checkIfGroupExistsForUser.includes(req.body.group_id)) {
                    res.status(409).json({
                        statusCode: 409,
                        status: "failed",
                        message: "Already a group member"
                    })

    
                } else{
                    User.findOneAndUpdate({userID: invited_user}, {$push: {"notifications": invite_details}}).exec().then(result => {
                        res.status(200).json({
                            statusCode: 200,
                            status: "successful",
                            message: "Invitation sent",
                        })
                    }).catch(err => {
                        res.status(500).json({
                            error: err,
                            message: "invite failed"
                        })
                    })
                }
            })
        } else {
            res.status(404).json({
                statusCode: 404,
                status: "failed",
                message: "Group not found",
            })
        }

    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })
}