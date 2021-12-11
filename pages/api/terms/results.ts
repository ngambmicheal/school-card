// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import SubjectInterface, {examSchema} from '../../../models/exam';
import { examResultSchema } from '../../../models/examResult';
import { studentSchema } from '../../../models/student';



export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) { 

    const {term_id} = req.query

    examResultSchema.find({term_id}).sort({number:1}).populate({path:'student', model:studentSchema}).collation({locale: "en_US", numericOrdering: true}).then(results => {
        res.json({data:results, status:true});
    })

}
