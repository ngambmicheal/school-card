import mg from "../services/mg"
import ClasseInterface, { classeSchema } from "./classe"
import SchoolInterface, { schoolSchema } from "./school"
import { reportType } from "./terms"


export default interface SectionInterface {
    _id?:string,
    name:string,
    school?:string & SchoolInterface,
    classes?:ClasseInterface[],
    report_type ?:reportType,
}


const SectionSchema = new mg.Schema({
     name: {type:String, required:true},
     report_type:{type:String, required:true},
     school:  {
        type:mg.Schema.Types.ObjectId,
        ref:'School',
        required:true
    },
    classes:[{
        type:mg.Schema.Types.ObjectId,
        ref:'Classe'
    }],
     details: {type:String},
    },
    {
    timestamps:true
    }
)

schoolSchema


export const sectionSchema = mg.models.Section || mg.model('Section', SectionSchema)