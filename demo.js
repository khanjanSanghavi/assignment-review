
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// CREATE USER
export const createUser = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;

    // validation (basic)
    if (!name || !email || !address || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check existing
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashedPass = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, address, password: hashedPass, role: role || "USER" },
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, address: true, role: true },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET SINGLE USER
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, address: true, role: true },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, password } = req.body;

    const data = {};
    if (name) data.name = name;
    if (address) data.address = address;
    if (password) data.password = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
    });

    res.json({ message: "User updated successfully", updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
