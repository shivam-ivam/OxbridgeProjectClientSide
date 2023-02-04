const jwt = require("jsonwebtoken");
const User = require("../Database/databaseSchema");

const authentication = async (req, res, next) => {
  try {
    const token = req.body.token;
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    const rootUser = await User.findOne({
      _id: verifyToken._id,
      "tokens.token": token,
    });
    if (!rootUser) {
      req.user = false;
    }
    req.user = true;
  } catch (error) {
    res.status(401).send("Unaithorized:No token Provided");
    console.log(error);

  }
  next();
};

module.exports = authentication;
