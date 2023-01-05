// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import ClasseInterface, {classeSchema} from '../../../models/classe';
import { schoolSchema } from '../../../models/school';
import { sectionSchema } from '../../../models/section';
import mg from '../../../services/mg';
import { HeadersEnum } from '../../../utils/enums';



export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) { 

    const {user_id} = req.body; 
    const query ={school:req.headers[HeadersEnum.SchoolId], ...req.query}; 

    const classes = classeSchema.find({teacher_id:user_id}).populate({path:'school', model:schoolSchema}).populate({path:'section', model:sectionSchema}).then(classes => {
                                            res.json({data:classes, status:true});
                                        })
                                        .catch((e) => {
                                            res.json({message:e.message, success:false });
                                        })  

}
