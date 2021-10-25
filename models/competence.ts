import mg from "../services/mg"
import SchoolInterface, { schoolSchema } from "./school"

export default interface CompetenceInterface{
    _id?:string,
    name:string,
    school?:string | SchoolInterface,
}

const CompetenceSchema = new mg.Schema({
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

schoolSchema
export const competenceSchema = mg.models.Competence || mg.model('Competence', CompetenceSchema)