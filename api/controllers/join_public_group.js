const Savings_group = require("../models/saving_group")
const User = require("../models/user")

exports.join_group = (req, res) => {
    // Check if user is a part of the group

    Savings_group.findOne({groupID: req.params.group_id}).exec().then(foundGroup => {

        if(foundGroup) {
            const {userID, fullName,email, _id} = req.userData._doc            
            const members = foundGroup.group_members;

            const id_array = []

            members.map(member => {
                id_array.push(member.member_id)
            })
        
        
            console.log(id_array);
            
            if(id_array.includes(userID)) {
                res.status(409).json({
                    statusCode: 409,
                    status: "failed",
                    message: "Member exist"
                })            
            } else {
                const newMemberDetails = {
                    _id: _id,
                    member_id: userID,
                    member_name: fullName,
                    member_email: email,
                    role: "Group Member",
                    amount_saved: 0
                    
                }
                Savings_group.findOneAndUpdate({groupID: req.params.group_id}, {$push: {"group_members": newMemberDetails}}).exec().then(
                    result => {
                        if(result) {
                            res.status(201).json({
                                statusCode: 201,
                                status: "successful",
                                message: "Successfully joined group"
                            })
    
                            const groupDetails ={
                                groupID: foundGroup.groupID,
                                groupName: foundGroup.group_name,
                                groupDesc: foundGroup.group_description,
                                groupLeader: foundGroup.group_admin
                            }
                            User.findOneAndUpdate({userID: userID}, {$push: {"associated_group": groupDetails}}).exec()
                        } else {
                            res.status(500).json({
                                statusCode: 500,
                                status: "failed"
                            })
                        }
                    }
                )
                .catch(err => {
                    res.status(500).json({
                        error: err
                    })
                })
            }
        } else {
            res.status(404).json({
                statusCode: 404,
                status: "failed",
                message: "Group not found"
            })
        }


        
    }).catch(err => {})

}