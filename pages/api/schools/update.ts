// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { schoolSchema } from '../../../models/school';



export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) { 

    const {_id, ...obj} = req.body

    schoolSchema.findOneAndUpdate({_id},obj).then(exam => {
            res.json({data:exam, status:true, message: 'School updated successfully!'});
        })
        .catch((e) => {
            res.json({message:e.message, success:false });
        })  

}
