import mg from "../services/mg"
import { UserRole, UserType } from "../utils/enums"
import ClasseInterface, { classeSchema } from "./classe"
import CompetenceInterface from "./competence"
import SchoolInterface, { schoolSchema } from "./school"

export default interface UserInterface{
    _id ?:string,
    name: string, 
    surname?: string, 
    phone?:string, 
    email?:string, 
    dob?:string,
    school_id ?: string | SchoolInterface,
    number?:string,
    sex?:string,
    place?:string, 
    type: UserType, 
    role: UserRole[], 
    username:string, 
    password:string, 
    matricule:string,
}

const UserSchema = new mg.Schema({
    name: {type:String, required:true},
    details: {type:String},
    school_id : {
        type:mg.Schema.Types.ObjectId,
        ref:'School',
    },
    surname: {type:String},
    phone: {type:String},
    date: {type:String},
    email:{type:String},
    sex: {type:String},
    dob: {type:String},
    number:{type:String},
    type: {type:String},
    role: [{type:String}], 
    username: {type:String},
    password: {type:String},
    matricule: {type:String}
   },
   {
   timestamps:true,
   strict:false
   }
)

schoolSchema
export const userSchema = mg.models.User || mg.model('User', UserSchema)