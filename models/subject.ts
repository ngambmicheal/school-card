import mg from "../services/mg"
import CompetenceInterface, { competenceSchema } from "./competence"
import CourseInterface, { courseSchema } from "./course"
import SchoolInterface, { schoolSchema } from "./school"

export default interface SubjectInterface{
    _id?:string,
    name:string,
    school?:string | SchoolInterface,
    competence?:string | CompetenceInterface,
    courses?:CourseInterface[]
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
    },
    courses:[
        {
            type:mg.Schema.Types.ObjectId,
            ref:'Course',
        }
    ]
   },
   {
   timestamps:true
   }
)

schoolSchema
courseSchema
export const subjectSchema = mg.models.Subject || mg.model('Subject', SubjectSchema)