
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { classeSchema } from '../../../models/classe';
import SubjectInterface, {examSchema} from '../../../models/exam';
import { sectionSchema } from '../../../models/section';
import { termSchema } from '../../../models/terms';



export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) { 

    const {_id} = req.query
    termSchema.findOne({_id}).populate({path:'class', model:classeSchema, populate:{path:'section', model:sectionSchema}}).populate({path:'exams', model:examSchema})
    .then(exam => {
                res.json({data:exam, status:true});
            })
        .catch((e) => {
            res.json({message:e.message, success:false });
        })  

}
