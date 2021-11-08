const express = require("express")
const router = express.Router()
const { register, login, logout } = require("../controllers/auth_controller")
const {
    checkAuthenticated,
    checkNotAuthenticated,
} = require("../middlewares/auth")

router.post("/", checkNotAuthenticated, login)
router.post("/register", checkNotAuthenticated, register)
router.get("/logout", checkAuthenticated, logout)

module.exports = router
