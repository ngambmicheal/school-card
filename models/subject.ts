import mg from "../services/mg"

export default interface SubjectInterface{
    _id?:string,
    name:string
}

const SubjectSchema = new mg.Schema({
    name: {type:String, required:true},
    details: {type:String},
   },
   {
   timestamps:true
   }
)

export const subjectSchema = mg.models.Subject || mg.model('Subject', SubjectSchema)