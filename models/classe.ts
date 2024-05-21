import mg from "../services/mg"
import SchoolInterface, { schoolSchema } from "./school"
import SectionInterface, { sectionSchema } from "./section"

export default interface ClasseInterface {
    _id?:string,
    id?:string,
    name:string,
    school?:SchoolInterface & string,
    section?:SectionInterface & string,
    promoted?: string
    teacher:string;
    teacher_id:string;
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
    section:  {
        type:mg.Schema.Types.ObjectId,
        ref:'Section',
    },
     details: {type:String},
     teacher:{type:String},
     teacher_id: {type: String}
    },
    {
    timestamps:true,
    strict:false
    }
)

schoolSchema 
sectionSchema
export const classeSchema = mg.models.Classe || mg.model('Classe', ClasseSchema)