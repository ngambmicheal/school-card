// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { termSchema } from '../../../../models/terms';
import { examResultSchema } from '../../../../models/examResult';
import { examSchema } from '../../../../models/exam';



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) { 

    const {term_id, student_id} = req.query;

    const term = await termSchema.findOne({_id:term_id})
    const exams = await examSchema.find({_id:{$in:term.exams}})
    const results =  await examResultSchema.find({student:student_id, exam_id:{ $in: term.exams}})
    const termResult = await examResultSchema.findOne({term_id, student:student_id})

    res.json({data:{term, results, exams, termResult}, status:true})

}
