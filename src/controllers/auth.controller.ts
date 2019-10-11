import {Request,Response} from 'express'
import User, {IUser} from '../models/User'
import jwt  from 'jsonwebtoken'

export const signup = async (req:Request,res:Response) =>{
   //guardando un usuario nuevo
    const user:IUser = new User({
    username : req.body.username,
    email : req.body.email,
    password : req.body.password
    })
    user.password = await user.encryptPassword(user.password)
    const saveUser =  await user.save()

    // token
    const token:string = jwt.sign({_id:saveUser._id},process.env.TOKEN_SECRET || 'tokentest')
    res.header('auth-token',token).json(saveUser)
    res.send('signup')
    console.log(saveUser)
}




export const signin = async (req:Request,res:Response) =>{
    const user = await User.findOne({email:req.body.email})
    if(!user) return res.status(400).json({message:'email o password esta mal'})
    const correctPassword:boolean =  await user.validatePassword(req.body.password)
   if(!correctPassword) return res.status(400).json({message:'password esta mal'})


  const token:string =  jwt.sign({_id:user._id},process.env.TOKEN_SECRET || 'tokentest',{
       expiresIn:60 * 60 * 24
   })
    res.header('auth-token',token).json(user)
}



export const profile = async (req:Request,res:Response) =>{
    //console.log(req.header('auth-token'))
   const user =  await User.findById(req.userId,{password:0})
   if(!user) return res.status(400).json({message:'user no exist'})
    res.json(user)
}