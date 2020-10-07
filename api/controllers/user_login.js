const User = require("../models/user")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

function errors(err) {
    return res.status(500).json({
        message: "Error encountered",
        error: err
    })
}


exports.login_user = (req, res) => {
    User.findOne({email: req.body.email}).exec().then(emailFound => {
        if(emailFound) {
            bcrypt.compare(req.body.password, emailFound.password, (err, passwordTrue) => {
                if(err) {
                    res.status(500).json({
                        message: "Error encountered",
                        error: err
                    })
                } else {
                    if(passwordTrue) {
                        const token = jwt.sign({
                            ...emailFound
                        }, process.env.JWT_KEY, {expiresIn: "1h"})
                        res.status(200).json({
                            message: "Auth successful",
                            token:token
                        })
                    } else {
                        res.status(401).json({
                            statusCode: 401,
                            status: "failed",
                            message: "Auth failed"
                        })
                    }
                }
            })
        }else {
            res.status(401).json({
                statusCode: 401,
                status: "failed",
                message: "Auth failed"
            })
        }
    }).catch(err => {
        errors(err)
    })

}