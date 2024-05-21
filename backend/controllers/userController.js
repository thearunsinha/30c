import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/UserModel.js";
import generateToken from "../utils/generateToken.js";

//@desc Authenticate user and GET Token
//@route POST /api/users/login
//@access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

//@desc User Register
//@route POST /api/users
//@access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email: email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists, Try login");
  }

  const user = await User.create({
    name,
    email,
    password,
  });
  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("Invalid User data");
  }
});

//@desc Logout User / Clear cookies
//@route POST /api/users/logout
//@access Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0), //User expires instead of expiresIn if there is any issue
  });
  res.status(200).json({ message: "Logged Out Successfully!" });
});

//@desc GET User Profile
//@route GET /api/users/profile
//@access Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//@desc User Profile Update
//@route GET /api/users/profile
//@access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

/**
 *
 *                  ADMIN ACCESS ROUTES
 *
 */

//@desc GET Users
//@route GET /api/users
//@access Private/Admin Access Only
const getUsers = asyncHandler(async (req, res) => {
  res.send("GET Users- Admin Only");
});

//@desc GET User By Id
//@route GET /api/users/:id
//@access Private/Admin Access Only
const getUserById = asyncHandler(async (req, res) => {
  res.send("GET User By Id- Admin Only");
});

//@desc delete User
//@route delete /api/users/:id
//@access Private/Admin Access Only
const deleteUser = asyncHandler(async (req, res) => {
  res.send("Delete User- Admin Only");
});

//@desc Update User
//@route POST /api/users/:id
//@access Private/Admin Access Only
const updateUser = asyncHandler(async (req, res) => {
  res.send("Update User- Admin Only");
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
