import mg from "../services/mg"
import CompetenceInterface, { competenceSchema } from "./competence"
import SchoolInterface, { schoolSchema } from "./school"

export default interface SubjectInterface{
    _id?:string,
    name:string,
    school?:string | SchoolInterface,
    competence?:string | CompetenceInterface
}

const SubjectSchema = new mg.Schema({
    name: {type:String, required:true},
    details: {type:String},
    school:  {
        type:mg.Schema.Types.ObjectId,
        ref:'School',
        required:true
    },
    competence : {
        type:mg.Schema.Types.ObjectId,
        ref:'Competence',
        required:true
    }
   },
   {
   timestamps:true
   }
)

schoolSchema
competenceSchema
export const subjectSchema = mg.models.Subject || mg.model('Subject', SubjectSchema)