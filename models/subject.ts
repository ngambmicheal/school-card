import mg from "../services/mg"
import SchoolInterface, { schoolSchema } from "./school"

export default interface SubjectInterface{
    _id?:string,
    name:string,
    school?:string | SchoolInterface,
}

const SubjectSchema = new mg.Schema({
    name: {type:String, required:true},
    details: {type:String},
    school:  {
        type:mg.Schema.Types.ObjectId,
        ref:'School',
        required:true
    },
   },
   {
   timestamps:true
   }
)

export const subjectSchema = mg.models.Subject || mg.model('Subject', SubjectSchema)