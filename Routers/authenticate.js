const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
require("../Database/dbConnection"); // connection to the data base
const User = require("../Database/databaseSchema");
const authentication = require("../MiddleWares/Authentication");

//                         signup
router.post("/signup", async (req, res) => {
  console.log(req.body);
  const { userName, email, coachingCode, password, cPassword } = req.body;
  if (!userName || !email || !coachingCode || !password || !cPassword) {
    return res.status(400).send({ error: "Bad Request" });
  }
  if (coachingCode != process.env.COACHING_CODE) {
    return res.status(401).send({ error: "Invalid Coaching Code" });
  }
  if (password != cPassword) {
    return res.status(401).send({ error: "Passwords do not match" });
  }
  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(409).send({ error: "User already exists" });
    }
    const user = new User({
      userName,
      email,
      password,
      cPassword,
    });
    await user.save();
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error creating user" });
  }
});

//                   signin

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password) {
    return res.status(400).json({ error: "Please fill in all the credentials" });
  }

  try {
    const userExist = await User.findOne({ email: email });
    if (!userExist) {
      return res.status(401).json({ error: "User not found. Please sign up first." });
    }
    const isTrue = await bcrypt.compare(password, userExist.password);
    if (isTrue) {
      // token and cookie work
      const token = await userExist.generateAuthToken();

      return res.status(200).json({ token: token });
    } else {
      return res.status(401).json({ error: "Incorrect password. Please try again." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


//// secret page authentication route
router.post("/secret", authentication, (req,res)=> {
  res.status(200).json({user:req.user});
});



module.exports = router;
