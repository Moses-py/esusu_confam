const Savings_groups = require("../models/saving_group")


exports.view_member_activity = (req, res) => {
    const {userID} = req.userData._doc
    Savings_groups.find().exec().then(groups => {
        const get_my_group = groups.filter(group => {
            return group.group_admin.adminID === userID
        })


    
        res.status(200).json({
            data: get_my_group.map(individualGroup => {
                return individualGroup.group_members
            })
        })
    }).catch(err =>{
        req.status(500).json({
            error: err
        })
    })
}
