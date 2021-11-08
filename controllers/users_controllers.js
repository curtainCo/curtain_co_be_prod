const {
    getAllUsers,
    getUser,
    updateUser,
    removeUser,
    getUserByEmail,
    addResetPasswordToUser,
    getUserByToken,
} = require("../utils/users")
const { sendRecoveryEmail } = require("../config/mailer")
const { TemporaryCredentials } = require("aws-sdk")

// TODO: Fail cases and where to redirect/ what to send
// back if so

async function indexUsers(req, res) {
    try {
        const allUsers = await getAllUsers(req)
        allUsers.forEach((u) => {
            delete u.password
        })
        res.status(200).json(allUsers)
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

async function showUser(req, res) {
    try {
        const user = await getUser(req)

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        delete user.password
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

async function changeUser(req, res) {
    try {
        const updatedUser = await updateUser(req)

        if (!updatedUser) {
            return res
                .status(400)
                .json({ message: "Invalid Request. User not found" })
        }
        delete updatedUser.password
        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

async function deleteUser(req, res) {
    try {
        // TODO - potentially redirect
        // TODO - returns the removed user document
        const removedUser = await removeUser(req)
        // res.sendStatus(204);

        if (!removedUser) {
            return res
                .status(400)
                .json({ message: "User not found. Unable to Delete user." })
        }
        res.status(202).send(removedUser)
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

async function forgotPassword(req, res) {
    try {
        const user = await getUserByEmail(req)
        if (!user) {
            return res.status(404).json({ message: "User not found." })
        }
        const userWithToken = await addResetPasswordToUser(user)
        console.log("userWithToken", userWithToken)

        // Send an email here
        try {
            const nodeMailerResponse = await sendRecoveryEmail(userWithToken)
            res.status(202).json({ message: "Recovery email sent." })
        } catch (error) {
            return res.status(500).json({
                message: "Recovery email not sent",
                error,
            })
        }
    } catch (error) {
        return res.status(500).json({ message: error })
    }
}

async function resetPassword(req, res) {
    // user is updating their password after token validated
    if (req.method === "POST") {
        console.log("here", req.body)
        try {
            const updatedUser = await updateUser(req)
            console.log(updatedUser)
            if (!updatedUser) throw new Error("Invalid Request. User not found")
        } catch (error) {
            return error
        }
        return res.status(200).json({ message: "User password updated." })
    } else if (req.method === "GET") {
        // user is getting their token validated
        try {
            const token = req.query.resetPasswordToken
            if (!Boolean(token)) {
                return res
                    .status(400)
                    .json({ message: "Bad Request. No token provided." })
            }
            const user = await getUserByToken(token)
            if (!user) {
                return res.status(404).json({
                    message:
                        "User not found. Invalid token or reset password link expired.",
                })
            }
            res.status(200).json({
                // user exists
                // TODO - figure out what details needs to be sent to the FE.
                message: "user exists",
                userId: user.id,
            })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }
    return null
}

module.exports = {
    indexUsers,
    showUser,
    changeUser,
    deleteUser,
    forgotPassword,
    resetPassword,
}
