const { getAllConsults, addConsult, getConsult, updateConsult, removeConsult } = require('../utils/consults');

async function indexConsults(req, res) {
  try {
    const allConsults = await getAllConsults(req);
    res.status(200).json(allConsults);

  } catch (error) {
    res.status(500).json({ message: error });
  }
}

async function createConsult(req, res) {
  try {
    const newConsult = await addConsult(req);
    res.status(201).json(newConsult);
  } catch (error) {
    res.status(400).json({ message: "Invalid Fields", error: error });
  }
}

async function showConsult(req, res) {
  try {
    const consult = await getConsult(req);

    if (!consult) {
      return res.status(404).json({ message: "Consult not found." });
    }

    res.status(200).json(consult);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

async function changeConsult(req, res) {
  try {
    const updatedConsult = await updateConsult(req);

    if (!updatedConsult) {
      return res.status(400).json({ message: "Invalid Request. Consult not found." });
    }

    res.status(200).json(updatedConsult);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

async function deleteConsult(req, res) {
  try {
    const removedConsult = await removeConsult(req);

    if (!removedConsult) {
      return res.status(404).json({ message: "Consult not found. Unable to Delete consult" });
    }

    res.status(202).json(removedConsult);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

module.exports = {
  indexConsults,
  createConsult,
  showConsult,
  changeConsult,
  deleteConsult
};