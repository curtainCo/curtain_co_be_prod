const { isAdmin, isOwner } = require("../utils/auth");

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.status(401).json({ message: "Must be authenticated to access" });
    }
}

function checkNotAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    } else {
        res.status(401).json({ message: "Must NOT be authenticated to access" });
    }
}

function checkAdmin(req, res, next) {
    if (isAdmin(req.user)) return next();
    return res
        .status(401)
        .json({ message: "Unauthorized User. Admin Access only" });
}

function checkAdminOrOwner(req, res, next) {
    console.log(req.user, req.params.id);
    if (isAdmin(req.user)) return next();
    if (isOwner(req.user, req.params.id)) return next();
    return res
        .status(401)
        .json({
            message:
                "Unauthorized User. You are not allowed to access this route.",
        });
}

async function checkOrderOwnerOrAdmin(req, res, next) {
    if (isAdmin(req.user)) return next();

    // checks if current user orders includes the id of the order to be updated
    const userOrders = req.user.orders;
    if (userOrders.includes(req.params.id)) return next();
    return res.status(403)
        .json({
            message:
                "Unauthorized User. You are not allowed to access this route."
        });
}

module.exports = {
    checkAuthenticated,
    checkNotAuthenticated,
    checkAdmin,
    checkAdminOrOwner,
    checkOrderOwnerOrAdmin
};
