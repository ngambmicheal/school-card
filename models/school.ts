import mg from "../services/mg"

export default interface SchoolInterface{
    _id?:string,
    name:string
}

const SchoolSchema = new mg.Schema({
    name: {type:String, required:true},
    details: {type:String},
   },
   {
   timestamps:true
   }
)

export const schoolSchema = mg.models.School || mg.model('School', SchoolSchema)