import mg from "../services/mg"
import ClasseInterface, { classeSchema } from "./classe"
import CompetenceInterface from "./competence"

export default interface StudentInterface{
    _id ?:string,
    name: string, 
    surname?: string, 
    phone?:string, 
    email?:string, 
    dob?:string,
    class_id ?:string | ClasseInterface,
    number?:string,
    sex?:string,
    place?:string
}

const StudentSchema = new mg.Schema({
    name: {type:String, required:true},
    details: {type:String},
    class_id : {
        type:mg.Schema.Types.ObjectId,
        ref:'Classe',
    },
    surname: {type:String},
    phone: {type:String},
    date: {type:String},
    email:{type:String},
    sex: {type:String},
    dob: {type:String},
    number:{type:String},
   },
   {
   timestamps:true,
   strict:false
   }
)


classeSchema
export const studentSchema = mg.models.Student || mg.model('Student', StudentSchema)