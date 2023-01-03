import mg from "../services/mg"

export default interface SchoolInterface{
    _id?:string,
    name:string, 
    phone?:string, 
    address?:string,
    allowUpdate?:boolean,
    email?:string, 
    box?:string
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