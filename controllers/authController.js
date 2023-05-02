import jwt from "jsonwebtoken";
import nid from "nid";

import User from "../models/userSchema.js";
import { comparePassword, hashPassword } from "../utils/auth.js";

// Register User

const RegisterUser = async (req, res) => {
  try {
    // Destructure Req Body

    let { name, email, phone, address, type, password } = req.body;

    // Validation

    if (!name) return res.status(400).send("Name is required");
    if (!password || password.length < 6) {
      return res.status(400).send("Password is required and has to be min 6 characters long");
    }
    if (!email) return res.status(400).send("email is required");
    if (email) email = email.toLowerCase();
    let userEmailExist = await User.findOne({ email }).exec();
    if (userEmailExist) return res.status(401).send("Email is taken");

    if (!phone) return res.status(400).send("Phone Number is required");
    let phoneNumberExist = await User.findOne({ phone }).exec();
    if (phoneNumberExist) return res.status(401).send("Phone number is taken");

    // Unique ID number
    const uniqueNumber = nid({ alphabet: "1234567890", length: 6 });
    const userId = `USER-0${uniqueNumber()}`;

    // Hash Password
    const hashedPassword = await hashPassword(password);

    // Register
    const user = new User({
      name,
      email,
      phone,
      address,
      type,
      userId,
      password: hashedPassword,
    });

    await user.save();
    res.status(200).send(user);
  } catch (error) {
    res.status(401).json(error);
    throw error;
  }
};

// Login

const LoginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (email) email = email.toLowerCase();
    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(404).send("User with email Id not found");

    const matchPassword = await comparePassword(password, user.password);
    if (!matchPassword) return res.status(401).send("Password did not match");

    const accessToken = jwt.sign(
      { phone: user.phone, _id: user._id, type: user.type },
      process.env.JWT_ACCESS_TOKEN,
      {
        expiresIn: "7d",
      },
    );

    user.password = undefined;
    user.isActive = undefined;
    user.membershipStatus = undefined;

    res.json({ user, token: accessToken });
    console.log("Login successful");
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error. Please Try Again");
  }
};

const LogoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ message: "Sign out success" });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { RegisterUser, LoginUser, LogoutUser };
