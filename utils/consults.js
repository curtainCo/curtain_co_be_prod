const Consult = require('../models/consult');

function getAllConsults(req) {
  return Consult.find();
}

function addConsult(req) {
  const newConsult = req.body;
  return Consult.create(newConsult);
}

function getConsult(req) {
  const consultId = req.params.id;
  return Consult.findById(consultId);
}

function updateConsult(req) {
  const consultId = req.params.id;
  return Consult.findByIdAndUpdate(consultId, req.body, { new: true });
}

function removeConsult(req) {
  const consultId = req.params.id;
  return Consult.findByIdAndDelete(consultId);
}

module.exports = {
  getAllConsults,
  addConsult,
  getConsult,
  updateConsult,
  removeConsult
};