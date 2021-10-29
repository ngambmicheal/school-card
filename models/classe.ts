import mg from "../services/mg"
import SchoolInterface, { schoolSchema } from "./school"

export default interface ClasseInterface {
    _id?:string,
    id?:string,
    name:string,
    school?:SchoolInterface | string
}


const ClasseSchema = new mg.Schema({
     name: {type:String, required:true},
     school:  {
        type:mg.Schema.Types.ObjectId,
        ref:'School',
        required:true
    },
    students:[{
        type:mg.Schema.Types.ObjectId,
        ref:'Student'
    }],
     details: {type:String},
    },
    {
    timestamps:true
    }
)

schoolSchema
export const classeSchema = mg.models.Classe || mg.model('Classe', ClasseSchema)