// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import ClasseInterface, { classeSchema } from '../../../models/classe';
import StudentInterface, { studentSchema } from '../../../models/student';

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{data?:StudentInterface, success:boolean, message:string}>
) {

    const studentQuery = req.body;

    const student = new studentSchema(studentQuery)
    student.save().then(()=>{
                    res.status(200).json({data:student, success:true, message:'done'});
                })
                .catch(() => {
                    res.status(400).json({message:'Could not be sent', success:false });
                })

}
