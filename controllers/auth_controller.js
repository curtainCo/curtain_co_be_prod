const passport = require("passport")
const { addUser, getUserByEmail } = require("../utils/users")

// TODO: validations

async function register(req, res) {
    const email = req.body.email
    try {
        const existingEmail = await getUserByEmail(req)
        if (existingEmail) {
            return res.status(400).json({ message: "Existing Email" })
        }
        try {
            const newUser = await addUser(req)
            const newUserNoPassword = { ...newUser }
            delete newUserNoPassword.password
            return res.status(201).json(newUserNoPassword)
        } catch (error) {
            return res.status(400).json({ message: "Couldn't create new user" })
        }
    } catch (error) {
        return res.status(400).json({ message: "Unable to register" })
    }
}

const authenticate = passport.authenticate("local", { failureFlash: true })

function login(req, res) {
    authenticate(req, res, () => {
        // REMEMBER ME COMP
        if (req.user.rememberMe) {
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000 // Cookie expires after 30 days
        } else {
            req.session.cookie.maxAge = 3600000
        }
        console.log("authenticated", req.user.email)
        console.log("session object:", req.session)
        console.log("req.user:", req.user)
        res.status(200).json({ user: req.user, sessionID: req.sessionID })
    })
}

function logout(req, res) {
    req.logout()
    console.log("logged out user")
    console.log("session object:", req.session)
    console.log("req.user:", req.user)
    res.sendStatus(204)
}

module.exports = {
    register,
    login,
    logout,
}
