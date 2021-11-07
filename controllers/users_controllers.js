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
    // find user
    try {
        const user = await getUserByEmail(req)
        if (!user) {
            return res.status(404).json({ message: "User not found." })
        }
        const userWithToken = await addResetPasswordToUser(user)

        // Send an email here
        try {
            const nodeMailerResponse = await sendRecoveryEmail(userWithToken)
            // successful recovery email but details didn't match
            // console.log(nodeMailerResponse)
            // if (
            //     !nodeMailerResponse ||
            //     nodeMailerResponse.accepted[0] !== req.body.email
            // ) {
            //     console.log("here")
            //     return res.status(400).json({
            //         message:
            //             "Nodemailer's accepted email did not match the request's email",
            //     })
            // }
            res.status(202).json({ message: "Recovery email sent." })
        } catch (error) {
            console.log("here2")
            return res.status(500).json({
                message: "Recovery email not sent",
                error,
            })
        }
    } catch (error) {
        console.log("here3")
        return res.status(500).json({ message: error })
    }

    return res
}

async function resetPassword(req, res) {
    // reset password of user if post request
    if (req.method === "POST") {
        try {
            const updatedUser = await updateUser(req)
            if (!updatedUser) {
                return res.status(400)
            }
            return res.status(200).json({ message: "User password updated" })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    // return user if only checking token on restricted password reset page
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

        // return user details
        res.status(200).json({
            userId: user.id,
            userEmail: user.email,
            message: "user exists",
        })
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

module.exports = {
    indexUsers,
    showUser,
    changeUser,
    deleteUser,
    forgotPassword,
    resetPassword,
}
