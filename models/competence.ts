import mg from "../services/mg"
import SchoolInterface, { schoolSchema } from "./school"
import SubjectInterface, { subjectSchema } from "./subject"

export default interface CompetenceInterface{
    _id?:string,
    name:string,
    school?:string | SchoolInterface,
    subjects?:SubjectInterface[]
}

const CompetenceSchema = new mg.Schema({
    name: {type:String, required:true},
    details: {type:String},
    school:  {
        type:mg.Schema.Types.ObjectId,
        ref:'School',
    },
    subjects: [
        {
            type:mg.Schema.Types.ObjectId,
            ref:'Subject',
        }
    ]
   },
   {
   timestamps:true
   }
)

schoolSchema
subjectSchema
export const competenceSchema = mg.models.Competence || mg.model('Competence', CompetenceSchema)