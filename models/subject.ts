import mg from "../services/mg"
import CompetenceInterface, { competenceSchema } from "./competence"
import CourseInterface, { courseSchema } from "./course"
import SchoolInterface, { schoolSchema } from "./school"

export default interface SubjectInterface{
    _id?:string,
    name:string,
    school?:string & SchoolInterface,
    competence?:string & CompetenceInterface,
    slug?:string,
    courses?:CourseInterface[],
    report_type?:string,
}

const SubjectSchema = new mg.Schema({
    name: {type:String, required:true},
    details: {type:String},
    report_type:{type:String, required:true},
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
   timestamps:true,
   strict:false
   }
)

schoolSchema
courseSchema
export const subjectSchema = mg.models.Subject || mg.model('Subject', SubjectSchema)