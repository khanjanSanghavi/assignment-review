import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

//CREATE USER
export const createUser = async (req,res)=>{
  try{
    console.log("req.body:", req.body);
    const {name,email,add,password,role} = req.body;
    if(!name|| !email ||!add ||!password||!role){
      return res.status(400).json({message:"All fields are required"})
    }
    const existing = await prisma.user.findUnique({
      where:{
        email: email  //can also write it as {email} if variable and property have same name 
      }
    }) 
    if(existing){
      return res.status(409).json({message:"email id exsit - try loging in"})
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const User = await prisma.user.create({
      data:{
        name:name,
        email,                //Shorthand ver of - (email:email)
        address:add,
        password:hashedPassword,
        role
      }
    })

    return res.status(201).json({message:"User created successfully",user:User})

    }catch(e){
      console.error(e)
      return res.status(501).json({message:"server Error-user can't be created --",e})
    }
}

//login 
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid password or email" });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error during login", e });
  }
};



//get all users
export const getAllUsers = async (req,res) => {
  try{
    const Users = await prisma.user.findMany({
      select:{id:true, name:true,email: true, address: true, role: true,
        store:{
          select:{                                  //i love prismaaaaaa for this 
            overallRating:true
          }
        }
       }
    })
    return res.status(201).json({message:"Users fetched successfully",user:Users})
  }catch(e){
    console.error(e)
    return res.status(501).json({message:"Server Error- Can't fetch users",e})
  }
}

//get user by id
export const getUserById = async (req,res) => {
  try{
    const {id} = req.params;
    const User = await prisma.user.findUnique({
      where:{id}
    })
    let Rating = null;
    if (User.role == "OWNER"){
       Rating = await prisma.store.findFirst({
        where:{
          OwnerID:id
        },
        select:{overallRating:true}
      })
    }
    return res.status(200).json({message:"User fetched successfully",user:User,rating:Rating})
  }catch(e){
    console.error(e)
    return res.status(501).json({message:"Server Error- Can't fetch users",e})
  }
}


//update user 
export const updateUserPassword = async (req,res)=> {
  try {
    const {id} = req.params;
    const {password} = req.body;
    const updatedUser = await prisma.user.update({
      where:{id},
      data:{
        password
      }
    })
    return res.status(201).json({message:"User password updated successfully",user:updatedUser})
  } catch (e) {
    console.error(e)
    return res.status(501).json({message:"Server Error --in updating user---",e});
  }
}


//delete user 
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    res.json({ message: "User deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: "Server error -- can't delete useer--",e});
  }
};



