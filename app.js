require("dotenv").config();
const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://admin:"+ process.env.mongoose_KEY +"@cluster0.q6ymj.mongodb.net/Cluster0?retryWrites=true&w=majority", 
{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true, useFindAndModify: false

})

// MIDDLEWARE CONTROLLERS
const esusu_user_register = require("./api/controllers/user_register")
const esusu_user_login = require("./api/controllers/user_login")
const create_group = require("./api/controllers/create_group")
const search_group = require("./api/controllers/search_groups")
const join_public_group = require("./api/controllers/join_public_group")
const member_invite = require("./api/controllers/group_invite")
const member_activity = require("./api/controllers/member_activity")
// MIDDLEWARE FUNCTIONS
const auth_token = require("./api/middleware/Auth_Token")


// SETTING UP EXPRESS
const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static("public"))



// HANDLING CORS ERROR FOR CROSS-PLATFORMS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
        "Access-Control-Allow-Headers",
        "Orign, X-Requested-With, Content-Type, Authorization"
    );

    if (req.method === "OPTIONS"){
        res.header("Access-Control-Allow-Methods",
        "GET, PUT, PATCH, DELETE, POST")
        return res.status(200).json({})
    }

    next();
})
// CODE BLOCK END 


// ROUTES
app.get("/", (req, res) => {res.send("Welcome to Esusu Confam")})
app.get("/api/register", esusu_user_register.get_registration_page)
app.post("/api/register", esusu_user_register.create_new_user)
app.delete("/api/delete/:userId", esusu_user_register.delete_user)
app.post("/api/login", esusu_user_login.login_user)
app.post("/api/new_group", auth_token, create_group.create_new_group)
app.get("/api/search_groups", auth_token, search_group.view_groups)
app.post("/api/join_group/:group_id", auth_token, join_public_group.join_group)
app.get("/api/admin/member_activity", auth_token, member_activity.view_member_activity)
app.post("/api/admin/invite/:public_user_id/:admin_group_id", auth_token, member_invite.invite_user)




// MARGINAL ERROR HANDLING
app.use((req,res,next) =>  {
    const error = new Error("Not Found")
    error.status = 404;
    next(error)

})

app.use((error, req,res,next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})
// CODE BLOCK END


let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}

// STARTING OFF OUR SERVER
app.listen(port, ()=> {
        console.log("server started at port " + port);   
})