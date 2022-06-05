import mg from "../services/mg"
import ClasseInterface, { classeSchema } from "./classe"
import ExamInterface, { examSchema } from "./exam"
import TermInterface, { reportType, termSchema } from "./terms"

export default interface AnnualExamInterface{
    _id?:string,
    name:string,
    class?:string & ClasseInterface,
    terms?:string[] & TermInterface[],
    report_type ?: reportType
}

const AnnualExamSchema = new mg.Schema({
        name: {type:String, required:true},
        report_type: {type:String},
        class:  {
            type:mg.Schema.Types.ObjectId,
            ref:'Classe',
        },
        terms : [{
            type:mg.Schema.Types.ObjectId,
            ref:'Term',
        }],
   },
   {
        timestamps:true,
        strict:false
   }
)

examSchema
classeSchema
termSchema
export const annualExamSchema = mg.models.AnnualExam || mg.model('AnnualExam', AnnualExamSchema)