import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bycrypt from "bcrypt";
import validator from "validator";

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exits" });
    }

    const isMatch = bycrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Password doesn't match" });
    }

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//create a token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

//register
const registerUser = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const exits = await userModel.findOne({ email });

    if (exits) {
      return res.json({ success: false, message: "user all ready exits" });
    }

    //validation
    if (!validator.isEmail(email)) {
      return res.json({
        success: fasle,
        message: "please enter the valid email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "please enter a strong password",
      });
    }

    //if everything works
    const salt = await bycrypt.genSalt(10);
    const hashPassword = await bycrypt.hash(password, salt);

    //add new user
    const newUser = new userModel({
      username: username,
      email: email,
      password: hashPassword,
    });

    const user = newUser.save();

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { loginUser, registerUser };
