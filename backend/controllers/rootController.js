const getRootMessage = (req, res) => {
  res.status(200).send("Menobot Backend Running");
};

module.exports = { getRootMessage };
