// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import SubjectInterface, {examSchema} from '../../../models/exam';
import { examResultSchema } from '../../../models/examResult';
import { termSchema } from '../../../models/terms';



export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) { 

    const {_id, term_id, student, createdAt, updatedAt, __v, ...obj} = req.body

    termSchema.findOneAndUpdate({_id},obj).then(exam => {
            res.json({data:exam, status:true});
        })
        .catch((e) => {
            res.json({message:e.message, success:false });
        })  

}
