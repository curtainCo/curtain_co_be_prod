const { getAllUsers, getUser, updateUser, removeUser } = require('../utils/users');

// TODO: Fail cases and where to redirect/ what to send
// back if so

async function indexUsers(req, res) {
  try {
    const allUsers = await getAllUsers(req);
    res.status(200).json(allUsers);

  } catch (error) {
    res.status(500).json({ message: error });
  }
}

async function showUser(req, res) {
  try {
    const user = await getUser(req);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error });

  }
}

async function changeUser(req, res) {
  try {
    const updatedUser = await updateUser(req);

    if (!updatedUser) {
      return res.status(400).json({ message: "Invalid Request. User not found" });
    }

    res.status(200).json(updatedUser);

  } catch (error) {
    res.status(500).json({ message: error });
  }
}

async function deleteUser(req, res) {
  try {
    // TODO - potentially redirect
    // TODO - returns the removed user document
    const removedUser = await removeUser(req);
    // res.sendStatus(204);

    if (!removedUser) {
      return res.status(400).json({ message: "User not found. Unable to Delete user." });
    }
    res.status(202).send(removedUser);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}


module.exports = {
  indexUsers,
  showUser,
  changeUser,
  deleteUser
};