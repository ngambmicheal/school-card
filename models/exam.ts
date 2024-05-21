import mg from "../services/mg"
import ClasseInterface from "./classe"
import SessionInterface from "./session"

export default interface ExamInterface{
    _id?:string,
    class_id?:string & ClasseInterface,
    session_id?:string & SessionInterface
    name: string
}


const ExamSchema = new mg.Schema({
    name: {type:String, required:true},
    details: {type:String},
    class_id : {
        type:mg.Schema.Types.ObjectId,
        ref:'Classe',
        require:true
    },
    session_id: {type:mg.Schema.Types.ObjectId, 
    ref: 'Session'}
   },
   {
   timestamps:true,
   strict:false,
   strictPopulate:false
   }
)


export const examSchema = mg.models.Exam || mg.model('Exam', ExamSchema)
