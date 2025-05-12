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

    logo:string, 
    th_en:string, 
    th_fr:string,
    attestation_fr:string,
    attestation_en:string,
    attestation_mat:string,
    attestation_nursery:string,

    director:string,


    attestation_en_intro:string,
    attestation_en_body:string,
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

    th_en: {type:String},
    th_fr: {type:String},
    attestation_fr: {type:String},
    attestation_en: {type:String},
    logo: {type:String},

    director: {type:String, default: 'DASSI Armande'},
    attestation_en_intro: {type:String, default: 'I, the undersigned Mrs,'},
    attestation_en_body: {type:String, default: 'Headmistress    of    GSBPL   La   SEMENCE    attests   that   the   pupil :'},
    
   },
   {
   timestamps:true,
   strict:false
   }
)

export const schoolSchema = mg.models.School || mg.model('School', SchoolSchema)