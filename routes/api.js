const express = require("express")
const router = express.Router()
const Axios = require("axios")
const qs = require("qs")

const inProduction = process.env.NODE_ENV === "production"

// Accessing our models and passport for login/signup 

const db = require("../models")
const passport = require("../config/passport")

router.get("/", (req, res) => {
    if (req.user) {
        res.json(req.user)
    }
    else {
        res.json("no user logged in")
    }
});

// Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
// how we configured our Mongoose User Model. If the user is created successfully, proceed to log the user in,
// otherwise send back an error

router.post("/signup", function (req, res) {

    console.log("user signup")

    db.User.create({
        username: req.body.username,
        password: req.body.password
    })
        .then(function () {
            console.log("user successfully added")
            res.redirect(307, "/api/login")
        })
        .catch(function (err) {
            console.log(err.message)
            res.status(401).json(err);
        });
})

// Using the passport.authenticate middleware with our local strategy.
// If the user has valid login credentials, send them to the members page.
// Otherwise the user will be sent an error
router.post(
    "/api/login",
    passport.authenticate("local"),
    (req, res) => {
        console.log(req.user)
        if (req.user || req.session.user) {
            var redir = { redirect: "/slackAuth" };
            return res.json(redir)
        }
        else {
            var redir = { redirect: "/login" }
            return res.json(redir)
        }
    });

router.post("/slackAuth", async (req, res) => {
    try {

        const slackAuthURL = "https://slack.com/api/oauth.v2.access"

        var slackRedirect_uri

        if (inProduction) {
                slackRedirect_uri = "https://smartrecruitersslack.herokuapp.com/slackAppAdd"

            }

        else {
                slackRedirect_uri = "http://localhost:3000/slackAppAdd"
        }

        const body = qs.stringify({
            code: req.body.code,
            client_id: "273664409857.1607139541536",
            client_secret: "491b448938dec8513e1b27fbf603cd68",
            redirect_uri: slackRedirect_uri
        })

        const slackRequest = await Axios.post(slackAuthURL, body, {
            headers:
            {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })

        console.log(slackRequest)

        let dbSlackAuthBody = {
            slackAppAuthToken: slackRequest.data.access_token,
            slackUserAuthToken: slackRequest.data.authed_user.access_token,
            slackUserID: slackRequest.data.authed_user.id,
            slackWorkspaceID: slackRequest.data.team.id

        }

        let responseBody = {
            redir: "/smartKey"
        }


        const dbUserUpdate = await db.User.findByIdAndUpdate(req.user._id, dbSlackAuthBody , { new: true })

        console.log(dbUserUpdate)

        res.json(responseBody)
        
    }
    catch (error) {
        console.log(error)
    }
})

router.post("/smartAuth", (req, res) => {
    console.log(req.user)

    const update = { 
        smartKey: req.body.smartKey,
        smartCompanyID: req.body.companyIdentifier  
    }
    const id = req.user._id
    const options = {new: true}
    
    db.User.findByIdAndUpdate(id, update, options)
        .then(response => {
            console.log(response)
            res.status(200).send("success")

        })
})

router.post("/smartWebhook", (req, res) => {
    console.log(req.body)

    const hookSecret = req.headers["x-hook-secret"]
    res.set("X-Hook-Secret", hookSecret)
    res.status(200).send("success!")
})

// router.post("/jobCreated", async (req, res) => {
//     try {
//         console.log(res.body)
//     }
//     catch {
//         console.log(err.message)

//     }
// })

// router.post("/jobCreated/:companyId", async (req, res) => {

//     try {

//         console.log (req.body)

//         const hookSecret = req.headers["x-hook-secret"]
//         res.set("X-Hook-Secret", hookSecret)
//         res.status(200).send("success!")

//         console.log(req.params)

//         const webCompanyID = req.params.companyId

//         const filter = {
//             smartCompanyID: webCompanyID,
//             smartKey: { $ne: null }
//         }

//         const dbUser = await db.User.findOne(filter)

//         console.log(dbUser)

//         const smartKey = "DCRA1-508de08834a14350bab3892dfdb22bae"

//         const jobID = req.body.id

//         // Querying SmartRecruiters API to get Job Title and Location

//         const jobInfoQueryURL = "https://api.smartrecruiters.com/jobs/" + jobID

//         const jobInfoQuery = await Axios.get(jobInfoQueryURL, {
//             headers: {
//                 "X-SmartToken": smartKey
//             }
//         })

//         const linkToJob = "https://www.smartrecruiters.com/app/jobs/details/" + jobID

//         const jobTitle = jobInfoQuery.data.title
//         const jobLocation = jobInfoQuery.data.location.city + ", " + jobInfoQuery.data.location.region
//         console.log(jobTitle)

//         console.log(jobLocation)

//         // Querying SmartRecruiters API to get Hiring Team Members

//         const jobQueryURL = "https://api.smartrecruiters.com/jobs/" + jobID + "/hiring-team"

//         const hiringTeamQuery = await Axios.get(jobQueryURL, { 
//             headers: {
//                 "X-SmartToken": smartKey
//             } 
//         })

//         const hiringTeamMembers = hiringTeamQuery.data.content

//         var hiringManagerURL

//         for (i=0; i < hiringTeamMembers.length; i++) {
//             const currentMember = hiringTeamMembers[i]

//             if (currentMember["role"]==="HIRING_MANAGER") {
//                 hiringManagerURL = currentMember.actions.details.url
//             }
//         }

//         var hiringManager

//         if(hiringManagerURL) {
//             const userInfoQuery = await Axios.get(hiringManagerURL, {
//                 headers: {
//                     "X-SmartToken": smartKey
//                 }
//             })

//             hiringManager = userInfoQuery.data.firstName + " " + userInfoQuery.data.lastName

//             console.log(hiringManager)
//         }
//         else {
//             hiringManager = "Not added yet"
//         }

//         for (i=0; i < hiringTeamMembers.length; i++) {
//             const user = hiringTeamMembers[i]

//             const userQueryURL = user.actions.details.url

//             const userInfoQuery = await Axios.get(userQueryURL, {
//                 headers: {
//                     "X-SmartToken": smartKey
//                 }
//             })

//             let formattedRole

//             switch(user.role) {
//                 case "HIRING_MANAGER": 
//                     formattedRole = "Hiring Manager"
//                 break;

//                 case "RECRUITER": 
//                     formattedRole = "Recruiter"
//                 break;

//                 case "INTERVIEWER": 
//                     formattedRole = "Interviewer"
//                 break;

//                 case "EXECUTIVE": 
//                     formattedRole = "Executive"
//                 break;

//                 case "COORDINATOR":
//                     formattedRole = "Coordinator"
//                 break;
//                 default: 
//                     formattedRole = user.role
//             }

//             const userData = {
//                 email: userInfoQuery.data.email,
//                 firstName: userInfoQuery.data.firstName, 
//                 lastName: userInfoQuery.data.lastName,
//                 hiringTeamRole: user.role
//             }

//             const dbUser = await db.User.findOne ({username: userData.email})

//                 // If user is in our database, then send slack message

//             if (dbUser) {

//                 console.log(dbUser)

//                 const token = dbUser.slackAppAuthToken

//                 const channel = dbUser.slackUserID

//                 var blocks =  [
//                         {
//                             "type": "section",
//                             "text": {
//                                 "type": "plain_text",
//                                 "text": "You have been added to a hiring team!",
//                                 "emoji": true
//                             }
//                         },
//                         {
//                             "type": "divider"
//                         },
//                         {
//                             "type": "section",
//                             "fields": [
//                                 {
//                                     "type": "plain_text",
//                                     "text": "Job Title: " + jobTitle,
//                                     "emoji": true
//                                 },
//                                 {
//                                     "type": "plain_text",
//                                     "text": "Location: " + jobLocation,
//                                     "emoji": true
//                                 },
//                                 {
//                                     "type": "plain_text",
//                                     "text": "Hiring Manager: " + hiringManager,
//                                     "emoji": true
//                                 },
//                                 {
//                                     "type": "plain_text",
//                                     "text": "Your Role: " + formattedRole,
//                                     "emoji": true
//                                 }
//                             ]
//                         },
//                         {
//                             "type": "divider"
//                         },
//                         {
//                             "type": "section",
//                             "text": {
//                                 "type": "mrkdwn",
//                                 "text": "Click to view job in SmartRecruiters."
//                             },
//                             "accessory": {
//                                 "type": "button",
//                                 "text": {
//                                     "type": "plain_text",
//                                     "text": "View Job",
//                                     "emoji": true
//                                 },
//                                 "value": "View Job",
//                                 "url": linkToJob,
//                                 "action_id": "button-action"
//                             }
//                         }
//                     ]

//                 const queryBlocks = JSON.stringify(blocks)

//                 const body = qs.stringify({
//                     channel: channel,
//                     blocks: queryBlocks
//                 })

//                 await Axios.post("https://slack.com/api/chat.postMessage", body, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         "Content-Type": "application/x-www-form-urlencoded"
//                     }
//                 })

//             }
//         }
//     }
//     catch (error) {
//         console.log(error)
//     }
    
// })

// router.post("/offerCreated", (req, res) => {

//     const hookSecret = req.headers["x-hook-secret"]
//     res.set("X-Hook-Secret", hookSecret)
//     res.status(200).send("success!")

// })



// module.exports = router;