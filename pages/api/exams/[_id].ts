// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import SubjectInterface, {examSchema} from '../../../models/exam';



export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) { 

    const {_id} = req.query
    examSchema.findOne({_id}).populate('class_id').then(exam => {
            res.json({data:exam, status:true});
        })
        .catch((e) => {
            res.json({message:e.message, success:false });
        })  

}
