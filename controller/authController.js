import UserModel from "../model/User.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../JWT/generateToken.js";

const register = async (req, res) => {
  const data = req.body;

  const userExist = await UserModel.findOne({
    email: data.email
  });

  if (userExist) {
    return res.json({
      message: "User already exists",
      success: false
    });
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await UserModel.create({
    email: data.email,
    password: hashedPassword
  });

  res.json({
    message: "User registered successfully",
    success: true,
    data: {
      _id: user._id,
      email: user.email,
      token: generateToken(user._id)
    },
    
  });
};

const login = async (req, res) => {
  const data = req.body;

  const user = await UserModel.findOne({
    email: data.email
  });

  if (!user) {
    return res.json({
      message: "Email is not registered",
      success: false,
      error: "User not exist with this email"
    });
  }

  const passwordMatch = await bcrypt.compare(
    data.password,
    user.password
  );

  if (!passwordMatch) {
    return res.json({
      message: "Password is wrong",
      success: false,
      error: "Password does not matched"
    });
  }

  res.json({
    message: "Login successful",
    success: true,
    data: {
      _id: user._id,
      email: user.email
    },
    token: generateToken(user._id)
  });
};

export default { register, login };
