// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import ClasseInterface, {classeSchema} from '../../../models/classe';
import { examSchema } from '../../../models/exam';
import mg from '../../../services/mg';



export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) { 

    const query = req.query
    examSchema.find(query).populate('class_id').then(exams => {
            res.json({data:exams, status:true});
        })
        .catch((e) => {
            res.json({message:e.message, success:false });
        })  

}
