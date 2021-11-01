import mg from "../services/mg"

export default interface ExamInterface{
    _id?:string,
    class_id:string,
    name: string
}


const ExamSchema = new mg.Schema({
    name: {type:String, required:true},
    details: {type:String},
    class_id : {
        type:mg.Schema.Types.ObjectId,
        ref:'Classe',
        require:true
    }
   },
   {
   timestamps:true,
   strict:false
   }
)


export const examSchema = mg.models.Exam || mg.model('Exam', ExamSchema)
