import { Model } from "mongoose"
import mg from "../services/mg"
import StudentInterface from "./student"
import ExamInterface from "./exam"

export default interface ExamResultInterface{
    _id?:string,
    class_id:string,
    name: string,
    student : string & StudentInterface,
    exam_id: string & ExamInterface
    number:string

}


const ExamResultSchema = new mg.Schema<ExamResultInterface>({
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
    term_id:{
        type: mg.Schema.Types.ObjectId, 
        ref: 'Term'
    },
    number:{type:String}
   },
   {
   timestamps:true,
   strict:false,
   strictQuery:false, 
   strictPopulate:false
   }
)


export const examResultSchema:Model<ExamResultInterface> = mg.models.ExamResult || mg.model('ExamResult', ExamResultSchema)
