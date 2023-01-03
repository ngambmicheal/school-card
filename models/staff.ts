import mg from "../services/mg"
import SchoolInterface, { schoolSchema } from "./school"

export default interface StaffInterface{
    _id ?:string,
    name: string, 
    surname?: string, 
    phone?:string, 
    email?:string, 
    dob?:string,
    school_id :string & SchoolInterface,
    number?:string,
    sex?:string,
    place?:string,
    username?:string, 
    password?:string
}

const StaffSchema = new mg.Schema({
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
    username: {type:String},
    password: {type:String}
   },
   {
   timestamps:true,
   strict:false
   }
)


schoolSchema
export const staffSchema = mg.models.Staff || mg.model('Staff', StaffSchema)