import { Router } from "express";
import { createUser,loginUser,updateUserPassword,deleteUser,getAllUsers,getUserById } from "../controllers/user.controller.js";

const router = Router();

router.post("/", createUser);       // Create a new user
router.get("/", getAllUsers);       // Get all users
router.post("/login", loginUser); // User login
router.get("/:id", getUserById);    // Get single user by id
router.put("/:id", updateUserPassword);     // Update user password
router.delete("/:id", deleteUser);  // Delete user

export default router;
