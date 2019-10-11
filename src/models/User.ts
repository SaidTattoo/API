import {Schema,model,Document} from 'mongoose'
import  bcrypt from 'bcryptjs'

export interface IUser extends Document{
    username:string,
    email:string,
    password:string,
    encryptPassword(password : string) :Promise<string>
    validatePassword(password : string) :Promise<boolean>
}

const UserSchema = new Schema({
    username:{
        type:String,
        required:true,
        min:4,
        lowercase:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    }
})
UserSchema.methods.encryptPassword = async(password:string) : Promise<string> =>{
   const salt = await bcrypt.genSalt(10)
   return bcrypt.hash(password, salt)
}


UserSchema.methods.validatePassword = async function(password:string) : Promise<boolean>{
  return await bcrypt.compare(password,this.password)
 }
 

export default model<IUser>('User',UserSchema)