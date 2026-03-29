const Counter = require("../models/counter");

async function getNextSequence(idName) {
  const counter = await Counter.findOneAndUpdate(
    { id: idName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

module.exports = getNextSequence;