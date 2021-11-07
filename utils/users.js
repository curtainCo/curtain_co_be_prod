const crypto = require("crypto")
const { User } = require("../models/user")

function getAllUsers(req) {
    return User.find().lean()
}

function getUser(req) {
    const userId = req.params.id
    return User.findById(userId).populate("orders").lean()
}

function addUser(req) {
    return User.create(req.body)
}

function updateUser(req) {
    const userId = req.params.id
    return User.findByIdAndUpdate(userId, req.body, { new: true }).lean()
}

function removeUser(req) {
    const userId = req.params.id
    return User.findByIdAndDelete(userId)
}

function getUserByEmail(req) {
    const userEmail = req.body.email
    return User.findOne({ email: userEmail })
}

async function addOrderToUser(user, orderId) {
    try {
        const updatedOrders = [...user.orders, orderId]
        await User.findByIdAndUpdate(
            user.id,
            { orders: updatedOrders },
            { new: true }
        )
    } catch (error) {
        console.log(error)
    }
}

async function removeOrderFromUser(user, orderId) {
    try {
        // filters the array of orderIds the user has
        const updatedOrders = user.orders.filter((id) => id != orderId)
        await User.findByIdAndUpdate(
            user.id,
            { orders: updatedOrders },
            { new: true }
        )
    } catch (error) {
        console.log(error)
    }
}

async function addResetPasswordToUser(user) {
    try {
        const token = crypto.randomBytes(20).toString("hex")
        console.log("TOKEN ---", token)
        const updatedUser = user._doc
        updatedUser.resetPasswordToken = token
        updatedUser.resetPasswordExpires = Date.now() + 3600000
        return User.findByIdAndUpdate(user.id, updatedUser, {
            new: true,
        }).lean()
    } catch (error) {
        console.log(error)
    }
}

async function getUserByToken(token) {
    try {
        return User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: {
                $gt: Date.now(),
            },
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getAllUsers,
    getUser,
    addUser,
    updateUser,
    removeUser,
    getUserByEmail,
    addOrderToUser,
    removeOrderFromUser,
    addResetPasswordToUser,
    getUserByToken,
}
