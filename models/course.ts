import mg from "../services/mg"
import SubjectInterface from "./subject"

export default interface CourseInterface{
    _id?:string,
    name:string,
    subject:SubjectInterface,
    point:number
}

const CourseSchema = new mg.Schema({
    name: {type:String, required:true},
    details: {type:String},
    subject: {
        type:mg.Schema.Types.ObjectId,
        ref:'Subject',
        require:true
    },
    point:{type:Number, required:true}
   },
   {
   timestamps:true
   }
)

export const courseSchema = mg.models.Course || mg.model('Course', CourseSchema)