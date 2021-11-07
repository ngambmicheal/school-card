// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { examResultSchema } from '../../../models/examResult';
import CompetenceInterface, {studentSchema} from '../../../models/student';



export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) { 

    const {_id} = req.body
    studentSchema.findOneAndDelete({_id}).then(student => {
        examResultSchema.findOneAndDelete({student_id:_id});

            res.json({data:student, status:true});
        })
        .catch((e) => {
            res.json({message:e.message, success:false });
        })  

}
