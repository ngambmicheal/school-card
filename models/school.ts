import mg from "../services/mg"

export default interface SchoolInterface{
    _id?:string,
    name:string, 
    phone?:string, 
    address?:string,
    allowUpdate?:boolean,
    email?:string, 
    box?:string, 
    details?: string
}

const SchoolSchema = new mg.Schema({
    name: {type:String, required:true},
    details: {type:String},
    phone: {type:String},
    address: {type:String},
    allowUpdate: {type:Boolean}, 
    email: {type:String},
    box:{type:String}
   },
   {
   timestamps:true,
   strict:false
   }
)

export const schoolSchema = mg.models.School || mg.model('School', SchoolSchema)