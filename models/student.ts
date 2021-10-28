import mg from "../services/mg"
import ClasseInterface, { classeSchema } from "./classe"
import CompetenceInterface from "./competence"

export default interface StudentInterface{
    _id ?:string,
    name: string, 
    surname?: string, 
    phone?:string, 
    email?:string, 
    date?:string,
    class_id ?:string | ClasseInterface,
    competence: string | CompetenceInterface
}

const StudentSchema = new mg.Schema({
    name: {type:String, required:true},
    details: {type:String},
    class_id : { type:String},
    competence: { type:String},
    surname: {type:String},
    phone: {type:String},
    date: {type:String},
    email:{type:String},
   },
   {
   timestamps:true
   }
)


export const studentSchema = mg.models.Student || mg.model('Student', StudentSchema)