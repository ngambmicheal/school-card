import mg from "../services/mg"
import ClasseInterface, { classeSchema } from "./classe"
import ExamInterface, { examSchema } from "./exam"

export type reportType = 'Competence' | 'Maternelle' | 'Matiere' | 'Nursery' | 'Special'

export default interface TermInterface{
    _id?:string,
    name:string,
    class?:string & ClasseInterface,
    exams?:string[] & ExamInterface[],
    report_type ?: reportType,
    slug?: string; 
}

const TermSchema = new mg.Schema({
        name: {type:String, required:true},
        report_type: {type:String},
        class:  {
            type:mg.Schema.Types.ObjectId,
            ref:'Classe',
        },
        exams : [{
            type:mg.Schema.Types.ObjectId,
            ref:'Exam',
        }],
   },
   {
        timestamps:true,
        strict:false
   }
)

examSchema
classeSchema
export const termSchema = mg.models.Term || mg.model('Term', TermSchema)