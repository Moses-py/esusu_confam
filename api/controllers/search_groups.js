const Savings_groups = require("../models/saving_group")

exports.view_groups = (req, res) => {
    Savings_groups.find().select("group_name group_description groupID group_members group_privacy group_max-Members group_admin weekly_savings_amount").exec().then(groups => {
        if(groups) {
            res.status(200).json({
                count: groups.length,
                data:  groups.map(group => {
                    return {
                        group
                    } 
                }) 
            })
        } else {
            res.status(404).json({
                statusCode: 404,
                status: "failed",
                message: "Groups not found"
            })
        }
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })
}