import mg from "../services/mg"
import StudentInterface from "./student"

export default interface ExamResultInterface{
    _id?:string,
    class_id:string,
    name: string,
    student : string & StudentInterface,
    exam_id: string ,
    number:string

}


const ExamResultSchema = new mg.Schema({
    name: {type:String, required:true},
    details: {type:String},
    student: {
        type: mg.Schema.Types.ObjectId,
        ref: 'Student'
    },
    exam_id: {
        type: mg.Schema.Types.ObjectId,
        ref: 'Exam'
    },
    number:{type:String}
   },
   {
   timestamps:true,
   strict:false,
   strictQuery:false
   }
)


export const examResultSchema = mg.models.ExamResult || mg.model('ExamResult', ExamResultSchema)
