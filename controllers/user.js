import { User } from "../models/user.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { sendCookie } from "../utils/features.js"
import ErrorHandler from "../middleware/error.js"

export const logout = (req,res)=>{
    res
        .status(200)
        .cookie("token","",{
            expires: new Date(Date.now()),
            sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
            secure: process.env.NODE_ENV === "Development" ? false : true,
        })
        .json({
            success: true,
            user: req.user,
        })
}
export const login = async(req,res,next)=>{
    try {
        const {email,password} = req.body;
        //console.log(password);
        const user = await User.findOne({email}).select("+password"); //select is set as false in model for password
        //console.log(user.password);

        if(!user) return next(new ErrorHandler("Invalid email or password!", 404))

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch) return next(new ErrorHandler("Invalid email or password!", 404))
        sendCookie(user,res,`Welcome back! ${user.name}`,200);
    } catch (error) {
        next(error);
    }
}

// export const getAllUsers = async (req,res)=>{
    
// }

export const register = async (req,res,next)=>{
    try {
        const {name,email,password} = req.body;
        let user = await User.findOne({email});
        console.log(user);
        if(user) return next(new ErrorHandler("User already exists!", 404))
        const hashedPassword = await bcrypt.hash(password,10);
        user = await User.create({name,email,password: hashedPassword});
        sendCookie(user,res,"Registered Successfully!",201);
    } catch (error) {
        next(error);
    }
}

export const getMyProfile = (req,res)=>{
    res.status(200).json({
        success: true,
        user: req.user,
    })
}

// export const updateUser = async(req,res)=>{
//     const {id} = req.params
//     //console.log(id);
//     const user = await User.findById(id)
//     res.json({
//         success: true,
//         message: "Updated Successfully!",
//     })
// }

// export const deleteUser = async(req,res)=>{
//     const {id} = req.params
//     //console.log(id);
//     const user = await User.findById(id)
//     await user.remove();
//     res.json({
//         success: true,
//         message: "Deleted Successfully!",
//     })
// }