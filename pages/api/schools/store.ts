// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import ClasseInterface, { classeSchema } from '../../../models/classe';
import SchoolInterface, { schoolSchema } from '../../../models/school';

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{data?:SchoolInterface, success:boolean, message:string}>
) {

    const schoolQuery = req.body;

    const school = new schoolSchema(schoolQuery)
    school.save().then(()=>{
                    res.status(200).json({data:school, success:true, message:'done'});
                })
                .catch(() => {
                    res.status(400).json({message:'Could not be sent', success:false });
                })

}
