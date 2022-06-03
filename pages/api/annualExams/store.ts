// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import TermInterface, { annualExamSchema } from '../../../models/annualExam';

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{data?:TermInterface, success:boolean, message:string}>
) {

    const annualExamQuery = req.body;

    const annualExam = new annualExamSchema(annualExamQuery)
    annualExam.save().then(()=>{
                    res.status(200).json({data:annualExam, success:true, message:'done'});
                })
                .catch((e) => {
                    res.status(400).json({message:e.message, success:false });
                })

}
