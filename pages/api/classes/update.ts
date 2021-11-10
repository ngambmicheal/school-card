// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { classeSchema } from '../../../models/classe';
import SubjectInterface, {examSchema} from '../../../models/exam';
import { examResultSchema } from '../../../models/examResult';



export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) { 

    const {_id, ...obj} = req.body

    classeSchema.findOneAndUpdate({_id},obj).then(exam => {
            res.json({data:exam, status:true});
        })
        .catch((e) => {
            res.json({message:e.message, success:false });
        })  

}
