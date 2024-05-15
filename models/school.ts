import mg from "../services/mg"

export default interface SchoolInterface{
    _id?:string,
    name:string, 
    phone?:string, 
    address?:string,
    allowUpdate?:boolean,
    email?:string, 
    box?:string, 
    details?: string,
    staff_password_length?:number, 
    session_id?:string,
    code:string, 

    police_stats: number, 
    police_reports: number,
    subject_display: number,
    name_display_stats: 0 | 1 | 2 
    sub_total_display: 0 | 1, 
    td_font_size: number
    td_font_size_name: number
}

const SchoolSchema = new mg.Schema({
    name: {type:String, required:true},
    details: {type:String},
    phone: {type:String},
    address: {type:String},
    allowUpdate: {type:Boolean}, 
    email: {type:String},
    box:{type:String},
    staff_password_length:{type:Number},
    code:{type:String}, 
    session_id: {type:String},


    //settings
    police_stats: {type:Number},
    police_reports: {type:Number},
    subject_display: {type:Number}, 
    name_display_stats: {type:Number, default: 2},
    sub_total_display: {type:Number, default:1},
    td_font_size: {type:Number, default:35},
    td_font_size_name: {type:Number, default:40}
   },
   {
   timestamps:true,
   strict:false
   }
)

export const schoolSchema = mg.models.School || mg.model('School', SchoolSchema)