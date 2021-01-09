const ROLE = require('../config/roles');


function isAdmin(user) {
  return user.role === ROLE.ADMIN;
}

function isOwner(user, profileId) {
  return user.id === profileId;
}

module.exports = { isAdmin, isOwner };