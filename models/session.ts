import mg from "../services/mg"
import SchoolInterface, { schoolSchema } from "./school"

export default interface SessionInterface{
    _id?:string,
    name:string,
    school?:string & SchoolInterface,
}

const SessionSchema = new mg.Schema({
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
export const sessionSchema = mg.models.Session || mg.model('Session', SessionSchema)